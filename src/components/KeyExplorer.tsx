import React, { useState } from 'react';
import { MusicalKey, ChordVoicing, MUSICAL_KEYS } from '../data/musicTheoryData';
import { soundEngine } from '../utils/audioEngine';
import { InteractivePiano } from './InteractivePiano';
import { Play, Music, Sparkles, BookOpen, Hand, HelpCircle, CheckCircle2 } from 'lucide-react';

interface KeyExplorerProps {
  currentKey: MusicalKey;
  onSelectKey: (keyId: string) => void;
  onOpenQnADemo?: (demoType: string) => void;
}

const SOLFEGE_COLORS: Record<string, { bg: string; text: string }> = {
  '도': { bg: 'bg-rose-500', text: 'text-white' },
  '레': { bg: 'bg-orange-500', text: 'text-white' },
  '미': { bg: 'bg-amber-400', text: 'text-amber-950' },
  '파': { bg: 'bg-emerald-500', text: 'text-white' },
  '솔': { bg: 'bg-sky-500', text: 'text-white' },
  '라': { bg: 'bg-indigo-500', text: 'text-white' },
  '시': { bg: 'bg-purple-500', text: 'text-white' },
};

export const KeyExplorer: React.FC<KeyExplorerProps> = ({
  currentKey,
  onSelectKey,
}) => {
  const [selectedChord, setSelectedChord] = useState<ChordVoicing>(currentKey.primaryChords[0]);
  const [inversionMode, setInversionMode] = useState<'textbook' | 'root'>('textbook');
  const [labelMode, setLabelMode] = useState<'solfege' | 'korean' | 'english'>('solfege');
  const [showFingering, setShowFingering] = useState<boolean>(true);
  const [lastPlayedNote, setLastPlayedNote] = useState<{ pitch: string; solfege: string } | null>(null);

  React.useEffect(() => {
    setSelectedChord(currentKey.primaryChords[0]);
  }, [currentKey]);

  const currentVoicing = inversionMode === 'textbook'
    ? selectedChord.textbookPosition
    : selectedChord.rootPosition;

  const handlePlayChord = () => {
    soundEngine.playChord(currentVoicing.notes, 1.8, 0.03, 0.3);
  };

  const handlePlayArpeggio = () => {
    soundEngine.playArpeggio(currentVoicing.notes, 100);
  };

  const handlePlayScale = () => {
    currentKey.scaleNotes.forEach((note, index) => {
      soundEngine.playNote(note.pitch, 0.8, index * 0.4, 0.28);
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Key Selector Bar (미래엔 교과서 단원 선택 탭 스타일) */}
      <div className="bg-white rounded-3xl border-2 border-slate-200/90 p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-sm shadow-xs">
              <BookOpen className="w-4 h-4" />
            </span>
            <span className="text-base font-black text-slate-900 font-jua">
              어떤 조(Key)를 탐험해볼까요?
            </span>
            <span className="hidden sm:inline text-xs text-slate-500">
              초등 음악 교과서에 실린 조를 콕 눌러보세요!
            </span>
          </div>
          {currentKey.textbookReference && (
            <span className="text-xs bg-amber-100 text-amber-900 font-extrabold px-3 py-1 rounded-full border border-amber-300 shadow-2xs">
              📖 {currentKey.textbookReference}
            </span>
          )}
        </div>

        {/* Tab Buttons (8개 교과서 조 4x2 / 8열 그리드) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {Object.values(MUSICAL_KEYS).map((k) => {
            const isSelected = k.id === currentKey.id;
            return (
              <button
                key={k.id}
                type="button"
                onClick={() => onSelectKey(k.id)}
                className={`flex flex-col p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-50 border-amber-500 text-slate-900 shadow-sm translate-y-[-2px]'
                    : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl">{k.icon}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    k.mode === 'major' ? 'bg-amber-100 text-amber-900' : 'bg-indigo-100 text-indigo-900'
                  }`}>
                    {k.mode === 'major' ? '밝은 장조' : '아련한 단조'}
                  </span>
                </div>
                <span className="font-extrabold text-sm sm:text-base mt-1.5 text-slate-900 font-jua">{k.shortName}</span>
                <span className="text-xs text-slate-600 font-bold mt-0.5 truncate">
                  으뜸음: {k.tonicKorean} ({k.tonicPitch})
                </span>
                <span className="text-[11px] text-amber-700 font-extrabold mt-1">
                  {k.keySignature.sharps.length > 0 ? `# 샵 ${k.keySignature.sharps.join(',')}` : ''}
                  {k.keySignature.flats.length > 0 ? `b 플랫 ${k.keySignature.flats.join(',')}` : ''}
                  {k.keySignature.sharps.length === 0 && k.keySignature.flats.length === 0 ? '조표 없음' : ''}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Key Profile & Scale Ribbon (교과서 '생각 열기' 코너 스타일) */}
      <div className="bg-white border-2 border-amber-300/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-100 pb-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-3xl">{currentKey.icon}</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-jua">{currentKey.name}</h2>
              <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-950 font-black border border-amber-300">
                으뜸음: {currentKey.tonicKorean}음 ({currentKey.tonicPitch}) = 계이름 "{currentKey.tonicSolfege}"
              </span>
            </div>
            <p className="text-sm text-slate-700 font-medium leading-relaxed">{currentKey.vibe}</p>
            <div className="flex items-center gap-2 text-xs text-amber-950 bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-200">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>조표의 비밀: </strong> {currentKey.keySignature.textbookRule}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePlayScale}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-sm transition-all active:scale-95 cursor-pointer font-jua text-sm"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{currentKey.shortName} 8음 음계 듣기</span>
            </button>
          </div>
        </div>

        {/* 8-Note Scale Ribbon (초등 표준 무지개 컬러 코딩 적용) */}
        <div>
          <div className="text-xs font-black text-slate-800 mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>8음 음계 계단 (각 음의 계이름과 음이름):</span>
            </span>
            <span className="text-xs text-rose-700 font-extrabold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
              🔴 반음(미-파 / 시-도) 자리를 잘 살펴보세요!
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {currentKey.scaleNotes.map((sn, idx) => {
              const solColor = SOLFEGE_COLORS[sn.solfege] || { bg: 'bg-amber-500', text: 'text-white' };
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    soundEngine.playNote(sn.pitch, 0.9, 0, 0.35);
                    setLastPlayedNote({ pitch: sn.pitch, solfege: sn.solfege });
                  }}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 transition-all cursor-pointer ${
                    sn.isAccidental
                      ? 'bg-amber-50 border-amber-400 text-slate-900 shadow-2xs'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-amber-50/40 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-0.5 text-[10px] text-slate-500 font-bold">
                    <span>{sn.degree}음</span>
                    {sn.isAccidental && <span className="text-rose-600 font-black">{sn.accidentalType}</span>}
                  </div>

                  {/* Rainbow Circle Badge */}
                  <div className={`w-8 h-8 rounded-full ${solColor.bg} ${solColor.text} font-black text-sm flex items-center justify-center shadow-xs my-1 font-jua`}>
                    {sn.solfege}
                  </div>

                  <span className="text-xs font-extrabold text-slate-800">
                    {sn.koreanName}({sn.engName})
                  </span>

                  <span className={`text-[10px] mt-1.5 px-2 py-0.2 rounded-full font-extrabold ${
                    sn.stepTypeAfter === 'half' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {sn.stepTypeAfter === 'half' ? '▲반음' : '—온음'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Chord Selector & Hand Fingering (교과서 15쪽 '주요 3화음' 코너 스타일) */}
      <div className="bg-white rounded-3xl border-2 border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2 font-jua">
              <Hand className="w-5 h-5 text-amber-500" />
              <span>{currentKey.shortName} 주요 3화음 & 건반 손가락 운지법</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              화음을 클릭하면 아래 건반에 1번(엄지), 3번(중지), 5번(새끼) 손가락 번호가 퐁퐁 떠올라요!
            </p>
          </div>

          {/* Inversion Toggle (도톰한 토글 버튼) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setInversionMode('textbook')}
              className={`px-3 py-1.5 rounded-xl font-black transition-all cursor-pointer ${
                inversionMode === 'textbook'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📖 교과서 쉬운 자리바꿈 운지
            </button>
            <button
              type="button"
              onClick={() => setInversionMode('root')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                inversionMode === 'root'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              기본자리 운지
            </button>
          </div>
        </div>

        {/* Chord Cards (미래엔 교과서 파스텔 박스) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {currentKey.primaryChords.map((chord) => {
            const isSelected = selectedChord.id === chord.id;
            const voicing = inversionMode === 'textbook' ? chord.textbookPosition : chord.rootPosition;

            return (
              <div
                key={chord.id}
                onClick={() => {
                  setSelectedChord(chord);
                  soundEngine.playChord(voicing.notes, 1.5, 0.03, 0.3);
                }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-amber-50/80 border-amber-400 shadow-sm translate-y-[-2px]'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 text-amber-600">
                    <CheckCircle2 className="w-5 h-5 fill-amber-100" />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-amber-500 text-white font-black text-sm flex items-center justify-center font-jua shadow-2xs">
                    {chord.symbol}
                  </span>
                  <div>
                    <h4 className="font-black text-sm text-slate-900 font-jua">{chord.name}</h4>
                    <span className="text-xs text-slate-500 font-extrabold">{chord.rootName}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed font-medium">
                  {chord.function}
                </p>

                {/* Notes & Fingering info */}
                <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold">계이름:</span>
                    <span className="font-black text-amber-900">
                      {voicing.solfege.join(' - ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold">음이름:</span>
                    <span className="font-extrabold text-slate-700">
                      {voicing.koreanNames.join(' - ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-amber-900 font-bold flex items-center gap-1">
                      <Hand className="w-3.5 h-3.5 text-amber-600" />
                      손가락 번호:
                    </span>
                    <span className="font-black text-amber-900">
                      {voicing.fingersRight.map(f => `${f}번`).join(' · ')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chord Play Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-800">
              현재 선택된 화음: <span className="text-amber-800 font-black font-jua text-sm">{selectedChord.symbol} ({selectedChord.name})</span>
            </span>
            <span className="text-xs text-slate-500 font-bold">
              ({currentVoicing.notes.map(n => n.replace(/\d/, '')).join(', ')})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePlayChord}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-2xs transition-all cursor-pointer active:scale-95 font-jua"
            >
              <Music className="w-3.5 h-3.5" />
              <span>화음 쾅! 한번에 듣기</span>
            </button>
            <button
              type="button"
              onClick={handlePlayArpeggio}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-2xs transition-all cursor-pointer active:scale-95 font-jua"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>아르페지오 (쿵-짝-짝)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Interactive Piano Display Controls & Keyboard */}
      <div className="bg-white rounded-3xl border-2 border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-slate-900 font-jua">
              🎹 스마트 건반 플레이어
            </h3>
            {lastPlayedNote && (
              <span className="text-xs bg-amber-100 text-amber-950 font-black px-2.5 py-0.5 rounded-full border border-amber-300">
                방금 친 음: {lastPlayedNote.solfege} ({lastPlayedNote.pitch})
              </span>
            )}
          </div>

          {/* Label Mode Switcher */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-extrabold px-1.5">이름표:</span>
              <button
                type="button"
                onClick={() => setLabelMode('solfege')}
                className={`px-3 py-1 rounded-xl font-black transition-all cursor-pointer ${
                  labelMode === 'solfege'
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                계이름 (도레미)
              </button>
              <button
                type="button"
                onClick={() => setLabelMode('korean')}
                className={`px-3 py-1 rounded-xl font-black transition-all cursor-pointer ${
                  labelMode === 'korean'
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                우리말 (다라마)
              </button>
              <button
                type="button"
                onClick={() => setLabelMode('english')}
                className={`px-3 py-1 rounded-xl font-black transition-all cursor-pointer ${
                  labelMode === 'english'
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                영문 (CDE)
              </button>
            </div>

            <label className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                checked={showFingering}
                onChange={(e) => setShowFingering(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500 cursor-pointer"
              />
              <span>손가락 번호 표시</span>
            </label>
          </div>
        </div>

        {/* The Piano Component */}
        <InteractivePiano
          currentKey={currentKey}
          activeChord={selectedChord}
          chordInversionMode={inversionMode}
          labelMode={labelMode}
          showFingering={showFingering}
          onNotePlay={(pitch, solfege) => setLastPlayedNote({ pitch, solfege })}
        />

        {/* Pedagogical Hint Callout (미래엔 교과서 팁 박스) */}
        <div className="bg-amber-50/90 border-2 border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-700">
          <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-black text-slate-900 text-sm font-jua">
              💡 선생님 팁: 왜 계이름과 음이름 두 가지로 볼 수 있을까요?
            </span>
            <p className="leading-relaxed font-medium">
              피아노 건반의 위치는 평생 변하지 않는 <strong>"음이름(다, 라, 마... / C, D, E...)"</strong>이에요.
              하지만 노래를 부를 때는 으뜸음이 누구냐에 따라 <strong>"도 레 미 파 솔 라 시 도"</strong>의 자리가 바뀐답니다(이동도법)!
              위의 [이름표] 버튼을 눌러 계이름과 음이름이 어떻게 연결되는지 비교해 보세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
