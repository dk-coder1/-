import React, { useState, useEffect, useCallback } from 'react';
import { soundEngine } from '../utils/audioEngine';
import { MusicalKey, ChordVoicing } from '../data/musicTheoryData';
import { Hand, Sparkles, Crown } from 'lucide-react';

interface InteractivePianoProps {
  currentKey: MusicalKey;
  activeChord?: ChordVoicing | null;
  chordInversionMode?: 'textbook' | 'root';
  labelMode: 'solfege' | 'korean' | 'english';
  showFingering: boolean;
  highlightedPitches?: string[];
  onNotePlay?: (pitch: string, solfege: string) => void;
}

interface KeyDefinition {
  pitch: string; // e.g. "C4"
  basePitchName: string; // e.g. "C"
  octave: number;
  isBlack: boolean;
  koreanName: string;
  engName: string;
  keyboardKey?: string;
}

// 2-Octave Keyboard definitions (C3 to D5, covers primary elementary range)
const KEYBOARD_KEYS: KeyDefinition[] = [
  { pitch: 'C3', basePitchName: 'C', octave: 3, isBlack: false, koreanName: '다', engName: 'C' },
  { pitch: 'C#3', basePitchName: 'C#', octave: 3, isBlack: true, koreanName: '올림다', engName: 'C#' },
  { pitch: 'D3', basePitchName: 'D', octave: 3, isBlack: false, koreanName: '라', engName: 'D' },
  { pitch: 'D#3', basePitchName: 'D#', octave: 3, isBlack: true, koreanName: '올림라', engName: 'D#' },
  { pitch: 'E3', basePitchName: 'E', octave: 3, isBlack: false, koreanName: '마', engName: 'E' },
  { pitch: 'F3', basePitchName: 'F', octave: 3, isBlack: false, koreanName: '바', engName: 'F' },
  { pitch: 'F#3', basePitchName: 'F#', octave: 3, isBlack: true, koreanName: '올림바', engName: 'F#' },
  { pitch: 'G3', basePitchName: 'G', octave: 3, isBlack: false, koreanName: '사', engName: 'G' },
  { pitch: 'G#3', basePitchName: 'G#', octave: 3, isBlack: true, koreanName: '올림사', engName: 'G#' },
  { pitch: 'A3', basePitchName: 'A', octave: 3, isBlack: false, koreanName: '가', engName: 'A' },
  { pitch: 'A#3', basePitchName: 'A#', octave: 3, isBlack: true, koreanName: '내림나', engName: 'Bb' },
  { pitch: 'B3', basePitchName: 'B', octave: 3, isBlack: false, koreanName: '나', engName: 'B' },

  { pitch: 'C4', basePitchName: 'C', octave: 4, isBlack: false, koreanName: '다', engName: 'C', keyboardKey: 'a' },
  { pitch: 'C#4', basePitchName: 'C#', octave: 4, isBlack: true, koreanName: '올림다', engName: 'C#', keyboardKey: 'w' },
  { pitch: 'D4', basePitchName: 'D', octave: 4, isBlack: false, koreanName: '라', engName: 'D', keyboardKey: 's' },
  { pitch: 'D#4', basePitchName: 'D#', octave: 4, isBlack: true, koreanName: '올림라', engName: 'D#', keyboardKey: 'e' },
  { pitch: 'E4', basePitchName: 'E', octave: 4, isBlack: false, koreanName: '마', engName: 'E', keyboardKey: 'd' },
  { pitch: 'F4', basePitchName: 'F', octave: 4, isBlack: false, koreanName: '바', engName: 'F', keyboardKey: 'f' },
  { pitch: 'F#4', basePitchName: 'F#', octave: 4, isBlack: true, koreanName: '올림바', engName: 'F#', keyboardKey: 't' },
  { pitch: 'G4', basePitchName: 'G', octave: 4, isBlack: false, koreanName: '사', engName: 'G', keyboardKey: 'g' },
  { pitch: 'G#4', basePitchName: 'G#', octave: 4, isBlack: true, koreanName: '올림사', engName: 'G#', keyboardKey: 'y' },
  { pitch: 'A4', basePitchName: 'A', octave: 4, isBlack: false, koreanName: '가', engName: 'A', keyboardKey: 'h' },
  { pitch: 'A#4', basePitchName: 'A#', octave: 4, isBlack: true, koreanName: '내림나', engName: 'Bb', keyboardKey: 'u' },
  { pitch: 'B4', basePitchName: 'B', octave: 4, isBlack: false, koreanName: '나', engName: 'B', keyboardKey: 'j' },

  { pitch: 'C5', basePitchName: 'C', octave: 5, isBlack: false, koreanName: '다', engName: 'C', keyboardKey: 'k' },
  { pitch: 'C#5', basePitchName: 'C#', octave: 5, isBlack: true, koreanName: '올림다', engName: 'C#' },
  { pitch: 'D5', basePitchName: 'D', octave: 5, isBlack: false, koreanName: '라', engName: 'D', keyboardKey: 'l' },
  { pitch: 'D#5', basePitchName: 'D#', octave: 5, isBlack: true, koreanName: '올림라', engName: 'D#' },
  { pitch: 'E5', basePitchName: 'E', octave: 5, isBlack: false, koreanName: '마', engName: 'E' },
  { pitch: 'F5', basePitchName: 'F', octave: 5, isBlack: false, koreanName: '바', engName: 'F' },
  { pitch: 'F#5', basePitchName: 'F#', octave: 5, isBlack: true, koreanName: '올림바', engName: 'F#' },
  { pitch: 'G5', basePitchName: 'G', octave: 5, isBlack: false, koreanName: '사', engName: 'G' },
];

// 초등 음악 교육 표준 무지개 컬러 코딩 (가독성 최적화)
const SOLFEGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  '도': { bg: 'bg-rose-500', text: 'text-white', border: 'border-rose-600' },
  '레': { bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-600' },
  '미': { bg: 'bg-amber-400', text: 'text-amber-950', border: 'border-amber-500' },
  '파': { bg: 'bg-emerald-500', text: 'text-white', border: 'border-emerald-600' },
  '솔': { bg: 'bg-sky-500', text: 'text-white', border: 'border-sky-600' },
  '라': { bg: 'bg-indigo-500', text: 'text-white', border: 'border-indigo-600' },
  '시': { bg: 'bg-purple-500', text: 'text-white', border: 'border-purple-600' },
};

export const InteractivePiano: React.FC<InteractivePianoProps> = ({
  currentKey,
  activeChord,
  chordInversionMode = 'textbook',
  labelMode,
  showFingering,
  highlightedPitches = [],
  onNotePlay
}) => {
  const [pressedPitches, setPressedPitches] = useState<Set<string>>(new Set());

  // Determine current active notes and fingering from active chord
  const activeChordVoicing = activeChord
    ? chordInversionMode === 'textbook'
      ? activeChord.textbookPosition
      : activeChord.rootPosition
    : null;

  const chordNotes = activeChordVoicing ? activeChordVoicing.notes : [];
  const chordFingers = activeChordVoicing ? activeChordVoicing.fingersRight : [];

  // Function to calculate solfege for any pitch based on current musical key (이동도법)
  const getSolfegeForPitch = useCallback((pitch: string): string => {
    const noteClass = pitch.replace(/\d/, '');
    const scaleMatch = currentKey.scaleNotes.find(
      s => s.pitch.replace(/\d/, '') === noteClass || s.engName === noteClass
    );
    if (scaleMatch) {
      return scaleMatch.solfege;
    }
    return '';
  }, [currentKey]);

  const handleKeyPress = useCallback((pitch: string) => {
    soundEngine.playNote(pitch, 0.9, 0, 0.35);
    setPressedPitches(prev => new Set(prev).add(pitch));

    const solfege = getSolfegeForPitch(pitch);
    onNotePlay?.(pitch, solfege);

    setTimeout(() => {
      setPressedPitches(prev => {
        const next = new Set(prev);
        next.delete(pitch);
        return next;
      });
    }, 250);
  }, [getSolfegeForPitch, onNotePlay]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const keyDef = KEYBOARD_KEYS.find(k => k.keyboardKey === e.key.toLowerCase());
      if (keyDef) {
        handleKeyPress(keyDef.pitch);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  const whiteKeys = KEYBOARD_KEYS.filter(k => !k.isBlack);

  return (
    <div className="w-full select-none">
      {/* Keyboard Controls / Status Bar (초등 교과서 스타일) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5 px-1 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-amber-900 bg-amber-100/90 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            키보드 자판 (A S D F G H J K / 흑건: W E T Y U)으로 칠 수 있어요!
          </span>
        </div>

        {activeChordVoicing && (
          <div className="flex items-center gap-2 bg-emerald-50 border-2 border-emerald-300 text-emerald-950 px-3 py-1 rounded-full text-xs font-bold shadow-2xs">
            <Hand className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{activeChord?.symbol} {activeChord?.name} 운지:</span>
            <span className="text-emerald-700">
              {activeChordVoicing.notes.map((n, i) => `${n.replace(/\d/, '')} (${chordFingers[i]}번)`).join(' · ')}
            </span>
          </div>
        )}
      </div>

      {/* Piano Bed Container (미래엔 교과서 교구 스타일 - 따뜻한 크림/아이보리 프레임) */}
      <div className="relative bg-[#F4EFE6] border-2 border-[#E2D8C3] p-3 sm:p-4 pt-4 rounded-3xl shadow-sm overflow-x-auto">
        {/* Felt strip above keys (교실 피아노 레드 펠트) */}
        <div className="h-2 w-full bg-rose-500/80 rounded-t-md mb-1.5 shadow-2xs" />

        {/* Keys Frame */}
        <div className="relative flex min-w-[760px] h-48 sm:h-52 bg-[#EAE2D2] rounded-2xl p-1.5 border border-[#D5C9B3] shadow-inner">
          {whiteKeys.map((wKey, index) => {
            const isPressed = pressedPitches.has(wKey.pitch);
            const isChordNote = chordNotes.includes(wKey.pitch);
            const isHighlighted = highlightedPitches.includes(wKey.pitch);
            const chordIndex = chordNotes.indexOf(wKey.pitch);
            const fingerNum = chordIndex !== -1 ? chordFingers[chordIndex] : null;

            // Is this the tonic note (으뜸음)?
            const isTonic = wKey.basePitchName === currentKey.tonicPitch;

            // Solfege / Label text
            const solfege = getSolfegeForPitch(wKey.pitch);
            let displayLabel = '';
            if (labelMode === 'solfege') displayLabel = solfege || wKey.basePitchName;
            else if (labelMode === 'korean') displayLabel = wKey.koreanName;
            else displayLabel = wKey.engName;

            const solfegeColor = solfege ? SOLFEGE_COLORS[solfege] : null;

            return (
              <button
                key={wKey.pitch}
                type="button"
                onClick={() => handleKeyPress(wKey.pitch)}
                className={`relative flex-1 h-full rounded-b-xl border border-slate-200/90 transition-all duration-75 flex flex-col justify-end items-center pb-3 cursor-pointer
                  ${isPressed ? 'bg-amber-100 shadow-inner translate-y-1' : ''}
                  ${!isPressed && isChordNote ? 'bg-amber-50/90 ring-3 ring-amber-400 ring-inset shadow-[0_4px_0_#F59E0B]' : ''}
                  ${!isPressed && isHighlighted && !isChordNote ? 'bg-emerald-50 ring-3 ring-emerald-400 ring-inset shadow-[0_4px_0_#10B981]' : ''}
                  ${!isPressed && !isChordNote && !isHighlighted ? 'bg-white hover:bg-amber-50/40 shadow-[0_4px_0_#CBD5E1]' : ''}
                  active:translate-y-1 active:shadow-none
                `}
                style={{
                  marginRight: index === whiteKeys.length - 1 ? 0 : '3px',
                }}
              >
                {/* Finger Indicator Bubble (도톰한 교과서 스타일) */}
                {showFingering && fingerNum !== null && (
                  <div className="absolute top-14 z-20 flex flex-col items-center">
                    <span className="w-7 h-7 rounded-full bg-amber-500 border-2 border-white text-white font-black text-sm flex items-center justify-center shadow-md animate-bounce">
                      {fingerNum}
                    </span>
                    <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100/90 px-1.5 py-0.2 rounded-md mt-0.5 border border-amber-300">
                      {fingerNum === 1 ? '엄지' : fingerNum === 2 ? '검지' : fingerNum === 3 ? '중지' : fingerNum === 4 ? '약지' : '새끼'}
                    </span>
                  </div>
                )}

                {/* Tonic Mark (귀여운 왕관 뱃지) */}
                {isTonic && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-xs whitespace-nowrap flex items-center gap-0.5 border border-amber-600">
                    <Crown className="w-2.5 h-2.5" />
                    <span>으뜸음</span>
                  </div>
                )}

                {/* Keyboard Shortcut Hint */}
                {wKey.keyboardKey && (
                  <span className="text-[10px] text-slate-400 font-mono font-bold mb-1 uppercase">
                    [{wKey.keyboardKey}]
                  </span>
                )}

                {/* Color-Coded Solfege Badge or Simple Label */}
                {labelMode === 'solfege' && solfegeColor ? (
                  <div className={`w-8 h-8 rounded-full ${solfegeColor.bg} ${solfegeColor.text} ${solfegeColor.border} border flex items-center justify-center font-black text-base shadow-xs mb-0.5`}>
                    {displayLabel}
                  </div>
                ) : (
                  <span className={`text-lg font-black transition-colors ${
                    isTonic ? 'text-amber-700' : isChordNote ? 'text-blue-700' : 'text-slate-800'
                  }`}>
                    {displayLabel}
                  </span>
                )}

                {/* Secondary label (Absolute pitch) */}
                <span className="text-[11px] text-slate-500 font-semibold mt-0.5">
                  {labelMode === 'solfege' ? `${wKey.koreanName}(${wKey.basePitchName})` : solfege}
                </span>
              </button>
            );
          })}

          {/* Black Keys Overlay (가독성 높은 매트 다크 차콜) */}
          {KEYBOARD_KEYS.map((keyDef) => {
            if (!keyDef.isBlack) return null;

            const prevWhiteKeyIndex = whiteKeys.findIndex(w => {
              const targetBase = keyDef.basePitchName.replace('#', '');
              return w.basePitchName === targetBase && w.octave === keyDef.octave;
            });

            if (prevWhiteKeyIndex === -1) return null;

            const totalWhite = whiteKeys.length;
            const leftPercent = ((prevWhiteKeyIndex + 0.68) / totalWhite) * 100;
            const keyWidthPercent = (0.65 / totalWhite) * 100;

            const isPressed = pressedPitches.has(keyDef.pitch);
            const isChordNote = chordNotes.includes(keyDef.pitch);
            const isHighlighted = highlightedPitches.includes(keyDef.pitch);
            const chordIndex = chordNotes.indexOf(keyDef.pitch);
            const fingerNum = chordIndex !== -1 ? chordFingers[chordIndex] : null;

            const solfege = getSolfegeForPitch(keyDef.pitch);
            let displayLabel = '';
            if (labelMode === 'solfege') displayLabel = solfege || keyDef.engName;
            else if (labelMode === 'korean') displayLabel = keyDef.koreanName;
            else displayLabel = keyDef.engName;

            return (
              <button
                key={keyDef.pitch}
                type="button"
                onClick={() => handleKeyPress(keyDef.pitch)}
                className={`absolute top-1.5 h-28 sm:h-32 rounded-b-xl z-30 flex flex-col justify-end items-center pb-2.5 cursor-pointer transition-all duration-75
                  ${isPressed ? 'bg-amber-600 translate-y-1' : ''}
                  ${!isPressed && isChordNote ? 'bg-amber-600 ring-3 ring-amber-300 shadow-[0_3px_0_#B45309]' : ''}
                  ${!isPressed && isHighlighted && !isChordNote ? 'bg-emerald-600 ring-3 ring-emerald-300 shadow-[0_3px_0_#047857]' : ''}
                  ${!isPressed && !isChordNote && !isHighlighted ? 'bg-[#2A303A] hover:bg-[#3A4250] shadow-[0_4px_0_#15191F]' : ''}
                  active:translate-y-0.5 active:shadow-none
                `}
                style={{
                  left: `${leftPercent}%`,
                  width: `${keyWidthPercent}%`,
                }}
              >
                {/* Finger Indicator */}
                {showFingering && fingerNum !== null && (
                  <div className="absolute top-5 flex flex-col items-center">
                    <span className="w-6 h-6 rounded-full bg-amber-400 border-2 border-slate-900 text-slate-900 font-black text-xs flex items-center justify-center shadow-md animate-bounce">
                      {fingerNum}
                    </span>
                  </div>
                )}

                {/* Key hint */}
                {keyDef.keyboardKey && (
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase mb-0.5">
                    [{keyDef.keyboardKey}]
                  </span>
                )}

                {/* Black Key Text (명확하고 큰 화이트 텍스트) */}
                <span className="text-white text-xs font-black leading-tight">
                  {displayLabel}
                </span>
                <span className="text-[9px] text-slate-300 font-bold leading-tight mt-0.5">
                  {keyDef.engName}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
