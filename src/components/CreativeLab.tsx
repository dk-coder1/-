import React, { useState, useEffect, useRef } from 'react';
import { MUSICAL_KEYS, MusicalKey } from '../data/musicTheoryData';
import { soundEngine } from '../utils/audioEngine';
import { InteractivePiano } from './InteractivePiano';
import { Sparkles, Play, Pause, Wand2, CircleDot, Award } from 'lucide-react';

interface ChordPattern {
  id: string;
  name: string;
  description: string;
  chords: string[]; // ["I", "IV", "V", "I"]
  keyId: string;
}

const CHORD_PATTERNS: ChordPattern[] = [
  {
    id: 'bright-clover',
    name: '🍀 네잎클로버 스타일 (사장조)',
    description: '교과서 사장조의 밝고 싱그러운 화음 진행 (I - V - IV - I)',
    chords: ['I', 'V', 'IV', 'I'],
    keyId: 'g-major'
  },
  {
    id: 'night-star',
    name: '🌙 별 보며 달 보며 스타일 (라단조)',
    description: '교과서 라단조의 신비롭고 아련한 감성 진행 (i - iv - V - i)',
    chords: ['i', 'iv', 'V', 'i'],
    keyId: 'd-minor'
  },
  {
    id: 'happy-classic',
    name: '☀️ 씩씩한 동요 기본형 (다장조)',
    description: '언제 들어도 안정되고 밝은 대표 진행 (I - IV - V - I)',
    chords: ['I', 'IV', 'V', 'I'],
    keyId: 'c-major'
  },
  {
    id: 'warm-pastoral',
    name: '🌸 따뜻한 들판 (바장조)',
    description: '온화하고 포근한 바장조 진행 (I - IV - I - V)',
    chords: ['I', 'IV', 'I', 'V'],
    keyId: 'f-major'
  }
];

export const CreativeLab: React.FC = () => {
  const [selectedPatternId, setSelectedPatternId] = useState<string>(CHORD_PATTERNS[0].id);
  const [isPlayingBacking, setIsPlayingBacking] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [tempoBpm, setTempoBpm] = useState<number>(80);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedNotes, setRecordedNotes] = useState<{ pitch: string; solfege: string; time: number }[]>([]);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState<boolean>(false);

  const pattern = CHORD_PATTERNS.find(p => p.id === selectedPatternId) || CHORD_PATTERNS[0];
  const currentKey = MUSICAL_KEYS[pattern.keyId] || MUSICAL_KEYS['g-major'];

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recordStartTimeRef = useRef<number>(0);

  const currentChordSymbol = pattern.chords[currentStepIndex];
  const currentChordDef = currentKey.primaryChords.find(
    c => c.symbol.toLowerCase() === currentChordSymbol.toLowerCase()
  );

  const chordNotes = currentChordDef ? currentChordDef.textbookPosition.notes : [];

  useEffect(() => {
    if (!isPlayingBacking) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const stepDurationSec = (60 / tempoBpm) * 3;

    const playChordStep = (idx: number) => {
      const sym = pattern.chords[idx];
      const chord = currentKey.primaryChords.find(c => c.symbol.toLowerCase() === sym.toLowerCase());
      if (chord) {
        const notes = chord.textbookPosition.notes;
        soundEngine.playChord(notes, stepDurationSec * 0.9, 0.03, 0.22);
      }
    };

    playChordStep(currentStepIndex);

    timerRef.current = setInterval(() => {
      setCurrentStepIndex(prev => {
        const next = (prev + 1) % pattern.chords.length;
        playChordStep(next);
        return next;
      });
    }, stepDurationSec * 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlayingBacking, currentStepIndex, pattern, currentKey, tempoBpm]);

  const handleNotePlay = (pitch: string, solfege: string) => {
    if (isRecording) {
      const elapsed = (Date.now() - recordStartTimeRef.current) / 1000;
      setRecordedNotes(prev => [...prev, { pitch, solfege, time: elapsed }]);
    }
  };

  const handleToggleRecord = () => {
    if (!isRecording) {
      setRecordedNotes([]);
      recordStartTimeRef.current = Date.now();
      setIsRecording(true);
      if (!isPlayingBacking) setIsPlayingBacking(true);
    } else {
      setIsRecording(false);
    }
  };

  const handlePlayRecording = () => {
    if (recordedNotes.length === 0 || isPlayingRecorded) return;
    setIsPlayingRecorded(true);

    recordedNotes.forEach(item => {
      setTimeout(() => {
        soundEngine.playNote(item.pitch, 0.8, 0, 0.35);
      }, item.time * 1000);
    });

    const totalDuration = recordedNotes[recordedNotes.length - 1].time + 1.2;
    setTimeout(() => {
      setIsPlayingRecorded(false);
    }, totalDuration * 1000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner (교과서 창작 코너 스타일) */}
      <div className="bg-white border-2 border-purple-200 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                <Wand2 className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-jua">
                꼬마 음악가의 화성 창작 놀이터
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              음표나 계이름을 전혀 몰라도 괜찮아요!
              화음 반주를 켜두고 <strong>건반에 표시되는 추천 음</strong>들을 띵띵띵 눌러보세요. 나만의 멋진 멜로디가 탄생합니다.
            </p>
          </div>

          {/* Quick Play Controls */}
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => setIsPlayingBacking(prev => !prev)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm text-white shadow-sm cursor-pointer transition-all active:scale-95 font-jua ${
                isPlayingBacking ? 'bg-amber-600 hover:bg-amber-700' : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {isPlayingBacking ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isPlayingBacking ? '반주 멈추기' : '화음 반주 루프 시작'}</span>
            </button>
          </div>
        </div>

        {/* Chord Pattern Presets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {CHORD_PATTERNS.map(p => {
            const isSelected = p.id === selectedPatternId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedPatternId(p.id);
                  setCurrentStepIndex(0);
                }}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-50 border-purple-500 text-slate-900 shadow-sm translate-y-[-2px]'
                    : 'bg-[#F8F9FA] border-slate-200 hover:bg-white text-slate-700'
                }`}
              >
                <h4 className="font-black text-sm text-slate-900 font-jua">{p.name}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1 font-medium">{p.description}</p>
                <div className="flex items-center gap-1.5 mt-2.5">
                  {p.chords.map((c, i) => (
                    <span key={i} className="text-xs font-black px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 font-jua">
                      {c}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive Loop Stage */}
      <div className="bg-white rounded-3xl border-2 border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentKey.icon}</span>
              <h3 className="font-black text-lg text-slate-900 font-jua">
                {currentKey.name} 화음 진행: {pattern.chords.join(' → ')}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
              현재 울리는 화음과 가장 잘 어울리는 추천 음들이 건반에 표시됩니다.
            </p>
          </div>

          {/* Recording Controls */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleToggleRecord}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm cursor-pointer transition-all active:scale-95 font-jua ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-rose-50 text-rose-800 border-2 border-rose-300 hover:bg-rose-100'
              }`}
            >
              <CircleDot className="w-4 h-4 text-rose-600" />
              <span>{isRecording ? '녹음 중 (마치려면 클릭)' : '내 즉흥 연주 녹음하기'}</span>
            </button>

            {recordedNotes.length > 0 && !isRecording && (
              <button
                type="button"
                onClick={handlePlayRecording}
                disabled={isPlayingRecorded}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm cursor-pointer transition-all active:scale-95 disabled:opacity-50 font-jua shadow-2xs"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isPlayingRecorded ? '연주 재생 중...' : `내 노래 다시듣기 (${recordedNotes.length}음)`}</span>
              </button>
            )}
          </div>
        </div>

        {/* 4-Step Animated Chord Visualizer */}
        <div className="grid grid-cols-4 gap-3">
          {pattern.chords.map((chordSym, idx) => {
            const isCurrent = idx === currentStepIndex;
            const def = currentKey.primaryChords.find(c => c.symbol.toLowerCase() === chordSym.toLowerCase());
            return (
              <div
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm scale-105'
                    : 'bg-[#F8F9FA] border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="text-[11px] font-bold opacity-75">마디 {idx + 1}</span>
                <div className="text-2xl font-black my-1 font-jua">{chordSym}</div>
                <div className="text-xs font-black truncate">{def?.name}</div>
                <div className="text-[11px] opacity-80 truncate mt-0.5 font-bold">
                  {def?.rootPosition.notes.map(n => n.replace(/\d/, '')).join('-')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Piano for student's free playing */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <span className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5 font-jua">
              <Sparkles className="w-4 h-4 text-amber-500" />
              건반에 불빛이 들어온 추천 음들을 자유롭게 띵띵띵 쳐보세요!
            </span>
            <span className="text-xs text-slate-500 font-medium">
              컴퓨터 키보드(A,S,D,F,G,H,J,K)를 마구 눌러도 아름답게 어울려요!
            </span>
          </div>

          <InteractivePiano
            currentKey={currentKey}
            activeChord={currentChordDef}
            chordInversionMode="textbook"
            labelMode="solfege"
            showFingering={false}
            highlightedPitches={chordNotes}
            onNotePlay={handleNotePlay}
          />
        </div>

        {/* Record notes list if any */}
        {recordedNotes.length > 0 && (
          <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-black text-purple-950 flex items-center gap-1.5 font-jua">
                <Award className="w-4 h-4 text-purple-600" />
                내가 연주한 멜로디 음계:
              </span>
              <span className="text-slate-600 font-bold">총 {recordedNotes.length}개의 음이 작곡되었어요!</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {recordedNotes.map((n, i) => (
                <span key={i} className="text-xs font-black bg-white text-purple-900 px-3 py-1 rounded-xl border border-purple-200 shadow-2xs font-jua">
                  {n.solfege || n.pitch}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
