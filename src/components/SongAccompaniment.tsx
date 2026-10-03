import React, { useState, useEffect, useRef } from 'react';
import { TextbookSong, TEXTBOOK_SONGS, MUSICAL_KEYS } from '../data/musicTheoryData';
import { soundEngine } from '../utils/audioEngine';
import { InteractivePiano } from './InteractivePiano';
import { Play, Pause, RotateCcw, Music, Sparkles, Users, Award, BookOpen } from 'lucide-react';

interface SongAccompanimentProps {
  initialSongId?: string;
}

export const SongAccompaniment: React.FC<SongAccompanimentProps> = ({
  initialSongId = 'four-leaf-clover'
}) => {
  const [selectedSongId, setSelectedSongId] = useState<string>(initialSongId);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentMeasureIndex, setCurrentMeasureIndex] = useState<number>(0);
  const [tempoBpm, setTempoBpm] = useState<number>(85); // BPM
  const [includeHarmony, setIncludeHarmony] = useState<boolean>(true); // 라단조 2중창 학생 2 가락
  const [includeChordAccomp, setIncludeChordAccomp] = useState<boolean>(true); // 화음 반주
  const [interactivePlayMode, setInteractivePlayMode] = useState<boolean>(false); // 내가 반주자 모드
  const [userScore, setUserScore] = useState<number>(0);
  const [lastUserChord, setLastUserChord] = useState<string | null>(null);
  const [activeNotes, setActiveNotes] = useState<string[]>([]);

  const song = TEXTBOOK_SONGS.find(s => s.id === selectedSongId) || TEXTBOOK_SONGS[0];
  const songKey = MUSICAL_KEYS[song.keyId] || MUSICAL_KEYS['g-major'];

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentMeasureIndex(0);
    setUserScore(0);
    setLastUserChord(null);
    setActiveNotes([]);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [selectedSongId]);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const beatsPerMeasure = song.timeSignature === '6/8' ? 2 : 4;
    const measureDurationSec = (60 / tempoBpm) * beatsPerMeasure;

    const playMeasure = (idx: number) => {
      const measure = song.measures[idx];
      if (!measure) return;

      const newActiveNotes: string[] = [];

      if (includeChordAccomp && !interactivePlayMode) {
        const chordDef = songKey.primaryChords.find(c => c.symbol.toLowerCase() === measure.chords.toLowerCase());
        if (chordDef) {
          const chordPitches = chordDef.textbookPosition.notes;
          soundEngine.playChord(chordPitches, measureDurationSec * 0.9, 0.02, 0.22);
          newActiveNotes.push(...chordPitches);
        }
      }

      let noteOffset = 0;
      measure.melodyNotes.forEach(mNote => {
        soundEngine.playNote(mNote.note, mNote.duration * (60 / tempoBpm), noteOffset, 0.35);
        newActiveNotes.push(mNote.note);
        noteOffset += mNote.duration * (60 / tempoBpm);
      });

      if (includeHarmony && measure.harmonyNotes) {
        let harmOffset = 0;
        measure.harmonyNotes.forEach(hNote => {
          soundEngine.playNote(hNote.note, hNote.duration * (60 / tempoBpm), harmOffset, 0.26);
          newActiveNotes.push(hNote.note);
          harmOffset += hNote.duration * (60 / tempoBpm);
        });
      }

      setActiveNotes(newActiveNotes);
    };

    playMeasure(currentMeasureIndex);

    timerRef.current = setInterval(() => {
      setCurrentMeasureIndex(prev => {
        const next = prev + 1;
        if (next >= song.measures.length) {
          setIsPlaying(false);
          return 0;
        }
        playMeasure(next);
        return next;
      });
    }, measureDurationSec * 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentMeasureIndex, song, songKey, tempoBpm, includeHarmony, includeChordAccomp, interactivePlayMode]);

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentMeasureIndex(0);
    setUserScore(0);
    setLastUserChord(null);
    setActiveNotes([]);
  };

  const handleUserPlayChord = (chordSymbol: string) => {
    const chordDef = songKey.primaryChords.find(c => c.symbol.toLowerCase() === chordSymbol.toLowerCase());
    if (chordDef) {
      soundEngine.playChord(chordDef.textbookPosition.notes, 1.2, 0.02, 0.35);
      setLastUserChord(chordSymbol);

      const targetChord = song.measures[currentMeasureIndex]?.chords;
      if (targetChord && targetChord.toLowerCase() === chordSymbol.toLowerCase()) {
        setUserScore(s => s + 10);
      }
    }
  };

  const currentMeasure = song.measures[currentMeasureIndex];
  const targetChordDef = songKey.primaryChords.find(c => c.symbol.toLowerCase() === currentMeasure?.chords.toLowerCase());

  return (
    <div className="space-y-6">
      {/* 1. Song Selection Header (교과서 곡 목록) */}
      <div className="bg-white rounded-3xl border-2 border-slate-200/90 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-sm shadow-xs">
              <BookOpen className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-black text-slate-900 font-jua">교과서 악곡 합주 & 화음 체험실</h2>
          </div>
          <span className="text-xs sm:text-sm text-slate-500 font-medium">
            교과서에 실린 악보와 가사를 보며 화음의 어울림을 느껴보세요!
          </span>
        </div>

        {/* Song Select Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TEXTBOOK_SONGS.map(s => {
            const isSelected = s.id === selectedSongId;
            const k = MUSICAL_KEYS[s.keyId];
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSongId(s.id)}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-50 border-amber-500 text-slate-900 shadow-sm translate-y-[-2px]'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                    {k?.shortName}
                  </span>
                  <span className="text-xs text-slate-400 font-extrabold">{s.timeSignature} 박자</span>
                </div>
                <h3 className="font-black text-base text-slate-900 mt-2 font-jua">{s.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5 truncate font-medium">{s.subtitle}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Song Stage & Animated Score Sheet (교과서 악보 페이지 스타일) */}
      <div className="bg-white rounded-3xl border-2 border-amber-300/80 p-5 sm:p-6 shadow-sm space-y-5">
        {/* Title & Info Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-100 pb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-3xl">{songKey.icon}</span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-jua">{song.title}</h3>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-300">
                {song.subtitle}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              {song.composer} · {song.description}
            </p>
          </div>

          {/* Player Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={togglePlay}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white text-sm font-black shadow-sm transition-all cursor-pointer active:scale-95 font-jua ${
                isPlaying ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isPlaying ? '잠시 멈춤' : '노래 & 반주 재생'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200"
              title="처음부터 다시"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Tempo Slider */}
            <div className="flex items-center gap-2 bg-[#F8F9FA] border border-slate-200 px-3.5 py-2 rounded-2xl text-xs">
              <span className="text-slate-600 font-bold">빠르기:</span>
              <span className="font-black text-slate-900 w-8 text-center">{tempoBpm}</span>
              <input
                type="range"
                min="60"
                max="120"
                value={tempoBpm}
                onChange={(e) => setTempoBpm(Number(e.target.value))}
                className="w-20 accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-[#F8F9FA] p-3.5 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-4 flex-wrap">
            {song.id === 'stars-and-moon' && (
              <label className="flex items-center gap-2 font-black text-indigo-950 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-indigo-200 shadow-2xs">
                <input
                  type="checkbox"
                  checked={includeHarmony}
                  onChange={(e) => setIncludeHarmony(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-indigo-600" />
                  교과서 51쪽 학생 2 '어울림 가락(2중창)' 켜기
                </span>
              </label>
            )}

            <label className="flex items-center gap-2 font-black text-amber-950 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-amber-200 shadow-2xs">
              <input
                type="checkbox"
                checked={includeChordAccomp}
                disabled={interactivePlayMode}
                onChange={(e) => setIncludeChordAccomp(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded cursor-pointer"
              />
              <span>자동 피아노 화음 반주</span>
            </label>
          </div>

          {/* Interactive Accompanist Mode Toggle */}
          <button
            type="button"
            onClick={() => setInteractivePlayMode(prev => !prev)}
            className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 font-jua ${
              interactivePlayMode
                ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-300'
                : 'bg-purple-100/80 text-purple-950 border border-purple-300 hover:bg-purple-200/80'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>{interactivePlayMode ? '🎮 내가 반주자 모드 진행 중!' : '🎮 내가 반주자 모드 도전!'}</span>
          </button>
        </div>

        {/* Measures Carousel / Sheet display (교과서 악보처럼 또렷한 가사) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-600 font-extrabold px-1">
            <span>마디별 가사와 화음 진행:</span>
            <span>현재: {currentMeasureIndex + 1} / {song.measures.length} 마디</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
            {song.measures.map((measure, idx) => {
              const isCurrent = idx === currentMeasureIndex;
              return (
                <div
                  key={idx}
                  onClick={() => setCurrentMeasureIndex(idx)}
                  className={`p-3 rounded-2xl border-2 flex flex-col justify-between min-h-[105px] transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm scale-105 z-10'
                      : 'bg-white border-slate-200 hover:border-amber-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold opacity-70">#{measure.measureNum}</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full font-jua ${
                      isCurrent ? 'bg-slate-900 text-white' : 'bg-amber-100 text-amber-950'
                    }`}>
                      {measure.chords}
                    </span>
                  </div>

                  <div className="my-1.5 text-center">
                    <span className={`font-black text-sm block leading-tight font-jua ${isCurrent ? 'text-slate-950' : 'text-slate-900'}`}>
                      {measure.lyrics}
                    </span>
                  </div>

                  <div className="text-[11px] text-center font-bold opacity-80 truncate">
                    {measure.melodyNotes.map(m => m.solfege).join(' ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* If in Interactive Game Mode: Chord Play Buttons */}
        {interactivePlayMode && (
          <div className="bg-purple-50 border-2 border-purple-200 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                <span className="font-black text-purple-950 text-sm sm:text-base font-jua">
                  내가 반주자 도전! 지금 마디에 맞는 화음 버튼을 쿵~ 눌러보세요!
                </span>
              </div>
              <span className="text-xs bg-purple-200 text-purple-950 font-black px-3 py-1 rounded-full border border-purple-300">
                내 반주 점수: {userScore}점
              </span>
            </div>

            <div className="flex items-center justify-center gap-4">
              {songKey.primaryChords.map(c => {
                const isTarget = c.symbol.toLowerCase() === currentMeasure?.chords.toLowerCase();
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleUserPlayChord(c.symbol)}
                    className={`flex flex-col items-center justify-center px-7 py-3.5 rounded-2xl font-black transition-all shadow-sm active:scale-95 cursor-pointer font-jua ${
                      isTarget
                        ? 'bg-amber-500 hover:bg-amber-600 text-white ring-4 ring-amber-300 scale-105'
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl">{c.symbol}</span>
                    <span className="text-xs mt-0.5">{c.name}</span>
                    <span className="text-[11px] opacity-80">{c.rootPosition.notes.map(n => n.replace(/\d/, '')).join('-')}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Embedded Real-time Piano */}
      <div className="bg-white rounded-3xl border-2 border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-black text-slate-900 font-jua">
              현재 울리는 화음과 멜로디 건반 불빛:
            </span>
            {targetChordDef && (
              <span className="text-xs bg-amber-100 text-amber-950 font-black px-3 py-1 rounded-full border border-amber-300">
                화음: {targetChordDef.symbol} ({targetChordDef.name})
              </span>
            )}
          </div>
          <span className="text-xs text-slate-500 font-medium">
            직접 건반을 눌러도 노래 소리와 함께 어울려요!
          </span>
        </div>

        <InteractivePiano
          currentKey={songKey}
          activeChord={targetChordDef}
          chordInversionMode="textbook"
          labelMode="solfege"
          showFingering={true}
          highlightedPitches={activeNotes}
        />
      </div>
    </div>
  );
};
