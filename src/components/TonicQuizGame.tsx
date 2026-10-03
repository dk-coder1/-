import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { soundEngine } from '../utils/audioEngine';
import {
  Trophy,
  Sparkles,
  Volume2,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lightbulb,
  Award,
  Flame,
  ArrowRight,
  Music,
  Crown,
  Shuffle,
  Compass
} from 'lucide-react';

export type TonicQuizFilter = 'all' | 'textbook' | 'major' | 'minor';
export type KeyLabelType = 'korean' | 'english' | 'solfege' | 'hidden';

export interface KeySignatureQuestion {
  id: string;
  name: string; // "사장조 (G Major)"
  shortName: string; // "사장조"
  mode: 'major' | 'minor';
  tonicPitchNames: string[]; // ["G"] or ["A#", "Bb"]
  tonicKoreanName: string; // "사"
  tonicEngName: string; // "G"
  tonicSolfege: string; // "도" (장조) or "라" (단조)
  sharpsCount: number;
  flatsCount: number;
  accidentals: Array<{
    type: '#' | 'b';
    x: number;
    y: number; // SVG y-coordinate on staff
    noteLabel: string;
  }>;
  explanation: string;
  mnemonicRule: string;
  isTextbookKey: boolean;
  textbookBadge?: string;
  celebrationChord: string[]; // for arpeggio / chord feedback
}

// 2-Octave Virtual Keyboard Key Definitions (C3 to D5)
interface PianoKey {
  pitch: string; // e.g. "C4"
  basePitchName: string; // e.g. "C"
  octave: number;
  isBlack: boolean;
  koreanName: string;
  engName: string;
  keyboardKey?: string;
}

const PIANO_KEYS: PianoKey[] = [
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
];

// Rich Database of Key Signatures and their Tonic Notes
// Staff line coordinates:
// Line 5 (F5) = 74
// Line 4 (D5) = 88
// Line 3 (B4) = 102
// Line 2 (G4) = 116
// Line 1 (E4) = 130
// Space 4 (E5) = 81
// Space 3 (C5) = 95
// Space 2 (A4) = 109
// Space 1 (F4) = 123
const KEY_SIGNATURE_QUESTIONS: KeySignatureQuestion[] = [
  // 1. 다장조 (C Major) - 0 sharps, 0 flats
  {
    id: 'c-major-tonic',
    name: '다장조 (C Major)',
    shortName: '다장조',
    mode: 'major',
    tonicPitchNames: ['C'],
    tonicKoreanName: '다',
    tonicEngName: 'C',
    tonicSolfege: '도',
    sharpsCount: 0,
    flatsCount: 0,
    accidentals: [],
    explanation: '조표가 아무것도 붙지 않는 기본 장조입니다. 건반의 기본 자리인 다(C)가 그대로 으뜸음 "도"가 됩니다!',
    mnemonicRule: '조표 없음 ➔ 피아노의 "다(C)" 건반이 바로 으뜸음(도)!',
    isTextbookKey: true,
    textbookBadge: '기초 필수',
    celebrationChord: ['C4', 'E4', 'G4', 'C5']
  },

  // 2. 사장조 (G Major) - 1 sharp (F#)
  {
    id: 'g-major-tonic',
    name: '사장조 (G Major)',
    shortName: '사장조',
    mode: 'major',
    tonicPitchNames: ['G'],
    tonicKoreanName: '사',
    tonicEngName: 'G',
    tonicSolfege: '도',
    sharpsCount: 1,
    flatsCount: 0,
    accidentals: [
      { type: '#', x: 88, y: 79, noteLabel: '파#' } // Line 5 F5
    ],
    explanation: '조표에 #이 1개(파#) 붙어 있어요! 샵(#)의 마법 공식: "마지막 샵의 바로 윗음이 도!" 따라서 파# 바로 위인 솔(사, G)이 으뜸음 도가 됩니다.',
    mnemonicRule: '샵(#) 1개(파#) ➔ 바로 윗음인 "솔(사, G)"이 으뜸음(도)!',
    isTextbookKey: true,
    textbookBadge: '교과서 <네잎클로버>',
    celebrationChord: ['G3', 'B3', 'D4', 'G4']
  },

  // 3. 바장조 (F Major) - 1 flat (Bb)
  {
    id: 'f-major-tonic',
    name: '바장조 (F Major)',
    shortName: '바장조',
    mode: 'major',
    tonicPitchNames: ['F'],
    tonicKoreanName: '바',
    tonicEngName: 'F',
    tonicSolfege: '도',
    sharpsCount: 0,
    flatsCount: 1,
    accidentals: [
      { type: 'b', x: 88, y: 104, noteLabel: '시b' } // Line 3 B4
    ],
    explanation: '조표에 b이 1개(시b) 붙어 있어요! 플랫이 1개일 땐 시b에서 4도 아래인 파(바, F)가 으뜸음 도가 됩니다.',
    mnemonicRule: '플랫(b) 1개(시b) ➔ 4도 아래인 "파(바, F)"가 으뜸음(도)!',
    isTextbookKey: true,
    textbookBadge: '교과서 수록 악곡',
    celebrationChord: ['F3', 'A3', 'C4', 'F4']
  },

  // 4. 라장조 (D Major) - 2 sharps (F#, C#)
  {
    id: 'd-major-tonic',
    name: '라장조 (D Major)',
    shortName: '라장조',
    mode: 'major',
    tonicPitchNames: ['D'],
    tonicKoreanName: '라',
    tonicEngName: 'D',
    tonicSolfege: '도',
    sharpsCount: 2,
    flatsCount: 0,
    accidentals: [
      { type: '#', x: 88, y: 79, noteLabel: '파#' },
      { type: '#', x: 104, y: 99, noteLabel: '도#' } // Space 3 C5
    ],
    explanation: '조표에 #이 2개(파#, 도#) 붙어 있어요! 마지막 샵인 "도#"의 바로 윗음(반음 위)은 "레(라, D)"입니다. 따라서 레(라, D)가 으뜸음 도가 됩니다!',
    mnemonicRule: '마지막 샵인 "도#"의 바로 윗음 ➔ "레(라, D)"가 으뜸음(도)!',
    isTextbookKey: true,
    textbookBadge: '교과서 음계 단원',
    celebrationChord: ['D4', 'F#4', 'A4', 'D5']
  },

  // 5. 라단조 (D minor) - 1 flat (Bb) - 나란한 단조!
  {
    id: 'd-minor-tonic',
    name: '라단조 (D minor)',
    shortName: '라단조',
    mode: 'minor',
    tonicPitchNames: ['D'],
    tonicKoreanName: '라',
    tonicEngName: 'D',
    tonicSolfege: '라',
    sharpsCount: 0,
    flatsCount: 1,
    accidentals: [
      { type: 'b', x: 88, y: 104, noteLabel: '시b' }
    ],
    explanation: '플랫(b)이 1개 붙은 바장조의 "나란한 단조"예요! 바장조의 으뜸음 파(도)에서 3반음 아래로 쏙 내려간 "레(라, D)"가 단조의 으뜸음 "라"가 됩니다.',
    mnemonicRule: '바장조(파)에서 3반음 아래 ➔ "레(라, D)"가 라단조 으뜸음(라)!',
    isTextbookKey: true,
    textbookBadge: '교과서 <별 보며 달 보며>',
    celebrationChord: ['D4', 'F4', 'A4', 'D5']
  },

  // 6. 가단조 (A minor) - 0 sharps, 0 flats - 다장조의 나란한 단조!
  {
    id: 'a-minor-tonic',
    name: '가단조 (A minor)',
    shortName: '가단조',
    mode: 'minor',
    tonicPitchNames: ['A'],
    tonicKoreanName: '가',
    tonicEngName: 'A',
    tonicSolfege: '라',
    sharpsCount: 0,
    flatsCount: 0,
    accidentals: [],
    explanation: '조표가 없는 다장조의 "나란한 단조"예요! 다장조 으뜸음 "도(C)"에서 3반음 아래로 내려간 "라(가, A)"가 가단조의 으뜸음이 됩니다.',
    mnemonicRule: '다장조(도)에서 3반음 아래 ➔ "라(가, A)"가 가단조 으뜸음(라)!',
    isTextbookKey: true,
    textbookBadge: '기초 단조',
    celebrationChord: ['A3', 'C4', 'E4', 'A4']
  },

  // 7. 내림나장조 (Bb Major) - 2 flats (Bb, Eb)
  {
    id: 'bb-major-tonic',
    name: '내림나장조 (Bb Major)',
    shortName: '내림나장조',
    mode: 'major',
    tonicPitchNames: ['A#', 'Bb'],
    tonicKoreanName: '내림나',
    tonicEngName: 'Bb',
    tonicSolfege: '도',
    sharpsCount: 0,
    flatsCount: 2,
    accidentals: [
      { type: 'b', x: 88, y: 104, noteLabel: '시b' },
      { type: 'b', x: 104, y: 86, noteLabel: '미b' } // Space 4 E5
    ],
    explanation: '플랫(b)이 2개 이상 붙었을 때의 마법: "끝에서 두 번째 플랫이 바로 으뜸음 도!" 따라서 끝에서 두 번째인 "시b(내림나, Bb)" 건반이 으뜸음이 됩니다.',
    mnemonicRule: '플랫이 2개(시b, 미b) ➔ 끝에서 두 번째인 "시b(내림나, Bb)"이 으뜸음(도)!',
    isTextbookKey: false,
    textbookBadge: '확장 조',
    celebrationChord: ['A#3', 'D4', 'F4', 'A#4']
  },

  // 8. 가장조 (A Major) - 3 sharps (F#, C#, G#)
  {
    id: 'a-major-tonic',
    name: '가장조 (A Major)',
    shortName: '가장조',
    mode: 'major',
    tonicPitchNames: ['A'],
    tonicKoreanName: '가',
    tonicEngName: 'A',
    tonicSolfege: '도',
    sharpsCount: 3,
    flatsCount: 0,
    accidentals: [
      { type: '#', x: 88, y: 79, noteLabel: '파#' },
      { type: '#', x: 102, y: 99, noteLabel: '도#' },
      { type: '#', x: 116, y: 65, noteLabel: '솔#' } // Above Line 5 G5
    ],
    explanation: '조표에 #이 3개(파#, 도#, 솔#) 있어요! 마지막 샵인 "솔#"의 바로 윗음(반음 위)은 "라(가, A)"입니다!',
    mnemonicRule: '마지막 샵인 "솔#"의 바로 윗음 ➔ "라(가, A)"가 으뜸음(도)!',
    isTextbookKey: false,
    textbookBadge: '장조 챌린지 (# 3개)',
    celebrationChord: ['A3', 'C#4', 'E4', 'A4']
  },

  // 9. 내림마장조 (Eb Major) - 3 flats (Bb, Eb, Ab)
  {
    id: 'eb-major-tonic',
    name: '내림마장조 (Eb Major)',
    shortName: '내림마장조',
    mode: 'major',
    tonicPitchNames: ['D#', 'Eb'],
    tonicKoreanName: '내림마',
    tonicEngName: 'Eb',
    tonicSolfege: '도',
    sharpsCount: 0,
    flatsCount: 3,
    accidentals: [
      { type: 'b', x: 88, y: 104, noteLabel: '시b' },
      { type: 'b', x: 104, y: 86, noteLabel: '미b' },
      { type: 'b', x: 120, y: 112, noteLabel: '라b' } // Space 2 A4
    ],
    explanation: '플랫(b)이 3개(시b, 미b, 라b) 붙었어요! 끝에서 두 번째 플랫인 "미b(내림마, Eb)" 검은건반이 으뜸음 도가 됩니다!',
    mnemonicRule: '끝에서 두 번째 플랫 ➔ "미b(내림마, Eb)"이 으뜸음(도)!',
    isTextbookKey: false,
    textbookBadge: '플랫 챌린지 (b 3개)',
    celebrationChord: ['D#4', 'G4', 'A#4', 'D#5']
  },

  // 10. 마단조 (E minor) - 1 sharp (F#) - 사장조의 나란한 단조!
  {
    id: 'e-minor-tonic',
    name: '마단조 (E minor)',
    shortName: '마단조',
    mode: 'minor',
    tonicPitchNames: ['E'],
    tonicKoreanName: '마',
    tonicEngName: 'E',
    tonicSolfege: '라',
    sharpsCount: 1,
    flatsCount: 0,
    accidentals: [
      { type: '#', x: 88, y: 79, noteLabel: '파#' }
    ],
    explanation: '샵(#)이 1개 붙은 사장조의 "나란한 단조"입니다! 사장조의 으뜸음 솔(사, G)에서 3반음 아래로 쏙 내려간 "미(마, E)"가 마단조의 으뜸음 "라"가 됩니다.',
    mnemonicRule: '사장조(솔)에서 3반음 아래 ➔ "미(마, E)"가 마단조 으뜸음(라)!',
    isTextbookKey: false,
    textbookBadge: '단조 챌린지 (# 1개)',
    celebrationChord: ['E3', 'G3', 'B3', 'E4']
  }
];

export const TonicQuizGame: React.FC = () => {
  // Game Setup & Filter
  const [filterMode, setFilterMode] = useState<TonicQuizFilter>('textbook');
  const [keyLabel, setKeyLabel] = useState<KeyLabelType>('korean');
  const [showHint, setShowHint] = useState<boolean>(false);

  // Filter questions based on selected mode
  const filteredQuestions = useMemo(() => {
    switch (filterMode) {
      case 'textbook':
        return KEY_SIGNATURE_QUESTIONS.filter(q => q.isTextbookKey);
      case 'major':
        return KEY_SIGNATURE_QUESTIONS.filter(q => q.mode === 'major');
      case 'minor':
        return KEY_SIGNATURE_QUESTIONS.filter(q => q.mode === 'minor');
      case 'all':
      default:
        return KEY_SIGNATURE_QUESTIONS;
    }
  }, [filterMode]);

  // Current Question State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const totalRounds = 8;

  // Answer & Feedback State
  const [selectedKeyPitch, setSelectedKeyPitch] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [lastClickedNote, setLastClickedNote] = useState<PianoKey | null>(null);
  const [isRoundFinished, setIsRoundFinished] = useState<boolean>(false);

  // Score & Streak
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);

  // Pick a random question that isn't the same as current
  const pickNextRandomQuestion = useCallback(() => {
    if (filteredQuestions.length === 0) return;
    let nextIdx = Math.floor(Math.random() * filteredQuestions.length);
    if (filteredQuestions.length > 1 && nextIdx === currentQuestionIndex) {
      nextIdx = (nextIdx + 1) % filteredQuestions.length;
    }
    setCurrentQuestionIndex(nextIdx);
    setIsCorrect(null);
    setSelectedKeyPitch(null);
    setLastClickedNote(null);
    setShowHint(false);
  }, [filteredQuestions, currentQuestionIndex]);

  // Handle filter mode change
  const handleFilterChange = (mode: TonicQuizFilter) => {
    setFilterMode(mode);
    setScore(0);
    setStreak(0);
    setRoundNumber(1);
    setIsRoundFinished(false);
    setIsCorrect(null);
    setSelectedKeyPitch(null);
    setLastClickedNote(null);
    setShowHint(false);
    // Pick random question in new filter
    const newQuestions = mode === 'textbook'
      ? KEY_SIGNATURE_QUESTIONS.filter(q => q.isTextbookKey)
      : mode === 'major'
        ? KEY_SIGNATURE_QUESTIONS.filter(q => q.mode === 'major')
        : mode === 'minor'
          ? KEY_SIGNATURE_QUESTIONS.filter(q => q.mode === 'minor')
          : KEY_SIGNATURE_QUESTIONS;
    const rIdx = Math.floor(Math.random() * newQuestions.length);
    setCurrentQuestionIndex(rIdx);
  };

  const currentQuestion: KeySignatureQuestion =
    filteredQuestions[currentQuestionIndex] || filteredQuestions[0] || KEY_SIGNATURE_QUESTIONS[0];

  // Play celebration chord when correct
  const playSuccessEffect = useCallback((question: KeySignatureQuestion) => {
    soundEngine.playChord(question.celebrationChord, 1.8, 0.04, 0.35);
  }, []);

  // Handle student clicking a key on the virtual keyboard
  const handleKeyClick = (key: PianoKey) => {
    if (isRoundFinished) return;

    // 1. Play sound of the pressed key immediately
    soundEngine.playNote(key.pitch, 0.9, 0, 0.35);
    setLastClickedNote(key);
    setSelectedKeyPitch(key.pitch);

    // 2. Check if this key matches the tonic pitch
    // Matches if basePitchName is in tonicPitchNames or engName is in tonicPitchNames
    const isMatch =
      currentQuestion.tonicPitchNames.includes(key.basePitchName) ||
      currentQuestion.tonicPitchNames.includes(key.engName);

    if (isMatch) {
      setIsCorrect(true);
      playSuccessEffect(currentQuestion);

      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }
      setScore(prev => prev + 10 + (newStreak > 1 ? newStreak * 2 : 0));
    } else {
      setIsCorrect(false);
      setStreak(0);
    }
  };

  // Move to next question or complete game
  const handleNextQuestion = () => {
    if (roundNumber >= totalRounds) {
      setIsRoundFinished(true);
    } else {
      setRoundNumber(prev => prev + 1);
      pickNextRandomQuestion();
    }
  };

  // Restart the whole game round
  const handleRestart = () => {
    setRoundNumber(1);
    setScore(0);
    setStreak(0);
    setIsRoundFinished(false);
    pickNextRandomQuestion();
  };

  // Keyboard shortcut listener for keyboard playing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user is focused on an input, ignore
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Enter' && isCorrect) {
        handleNextQuestion();
        return;
      }

      const match = PIANO_KEYS.find(k => k.keyboardKey === e.key.toLowerCase());
      if (match) {
        handleKeyClick(match);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCorrect, handleNextQuestion, handleKeyClick]);

  // Determine key label display
  const getKeyLabel = (key: PianoKey): string => {
    if (keyLabel === 'hidden') return '';
    if (keyLabel === 'korean') return key.koreanName;
    if (keyLabel === 'english') return key.engName;
    if (keyLabel === 'solfege') {
      // Show hint solfege if it's the tonic or default scale relative
      if (currentQuestion.tonicPitchNames.includes(key.basePitchName) || currentQuestion.tonicPitchNames.includes(key.engName)) {
        return currentQuestion.tonicSolfege;
      }
      return '';
    }
    return '';
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Mode Switchers */}
      <div className="bg-white rounded-3xl border-2 border-amber-300 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl shadow-xs shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-jua">
                  🎹 조표 보고 으뜸음 건반 찾기 훈련소
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed">
                악보 맨 앞의 조표(#, b)를 보고 <strong>으뜸음</strong>을 건반에서 직접 짚어보세요!
                장조는 <strong>'도'</strong>, 단조는 <strong>'라'</strong>를 찾는 것이 핵심 공식입니다.
              </p>
            </div>
          </div>

          {/* Score & Streak Stats Badge */}
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <div className="flex items-center gap-1.5 bg-amber-50 border-2 border-amber-300 px-3.5 py-2 rounded-2xl shadow-2xs">
              <Award className="w-4 h-4 text-amber-600" />
              <div className="text-left">
                <div className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">점수</div>
                <div className="text-sm sm:text-base font-black text-amber-950 font-jua leading-tight">{score}점</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-rose-50 border-2 border-rose-300 px-3.5 py-2 rounded-2xl shadow-2xs">
              <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
              <div className="text-left">
                <div className="text-[10px] text-rose-800 font-bold uppercase tracking-wider">연속</div>
                <div className="text-sm sm:text-base font-black text-rose-950 font-jua leading-tight">{streak}콤보</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs & Label Mode Options */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-3 border-t border-amber-100 text-xs">
          {/* Question Category Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-extrabold text-slate-700 font-jua">문제 범위:</span>
            <div className="flex items-center gap-1 bg-[#F8F9FA] p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => handleFilterChange('textbook')}
                className={`px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer font-jua ${
                  filterMode === 'textbook'
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🌟 초등 교과서 모드 (추천)
              </button>
              <button
                type="button"
                onClick={() => handleFilterChange('major')}
                className={`px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer font-jua ${
                  filterMode === 'major'
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ☀️ 장조 모드 ('도' 찾기)
              </button>
              <button
                type="button"
                onClick={() => handleFilterChange('minor')}
                className={`px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer font-jua ${
                  filterMode === 'minor'
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🌙 단조 모드 ('라' 찾기)
              </button>
              <button
                type="button"
                onClick={() => handleFilterChange('all')}
                className={`px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer font-jua ${
                  filterMode === 'all'
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🎲 전체 무작위
              </button>
            </div>
          </div>

          {/* Virtual Keyboard Labels Toggle */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-extrabold text-slate-700 font-jua">건반 라벨:</span>
            <div className="flex items-center gap-1 bg-[#F8F9FA] p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setKeyLabel('korean')}
                className={`px-2.5 py-1 rounded-lg font-black transition-all cursor-pointer ${
                  keyLabel === 'korean' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                우리말 (다·라·마)
              </button>
              <button
                type="button"
                onClick={() => setKeyLabel('english')}
                className={`px-2.5 py-1 rounded-lg font-black transition-all cursor-pointer ${
                  keyLabel === 'english' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                영문 (C·D·E)
              </button>
              <button
                type="button"
                onClick={() => setKeyLabel('hidden')}
                className={`px-2.5 py-1 rounded-lg font-black transition-all cursor-pointer ${
                  keyLabel === 'hidden' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="건반 위치만 보고 맞추는 진짜 실력 모드!"
              >
                🙈 라벨 숨기기 (도전!)
              </button>
            </div>
          </div>
        </div>
      </div>

      {!isRoundFinished ? (
        <div className="space-y-6">
          {/* 2. Question Prompt & Music Staff Card */}
          <div className="bg-white rounded-3xl border-2 border-slate-300 p-6 shadow-sm space-y-4">
            {/* Top Question Info Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-sm font-jua">
                  문제 {roundNumber} / {totalRounds}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
                  currentQuestion.mode === 'major'
                    ? 'bg-amber-100 text-amber-950 border-amber-300'
                    : 'bg-indigo-100 text-indigo-950 border-indigo-300'
                }`}>
                  {currentQuestion.mode === 'major' ? '☀️ 장조 (Major)' : '🌙 단조 (minor)'}
                </span>
                {currentQuestion.textbookBadge && (
                  <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-black text-xs border border-emerald-300 font-jua">
                    📖 {currentQuestion.textbookBadge}
                  </span>
                )}
              </div>

              {/* Shuffle button to skip / pick another */}
              <button
                type="button"
                onClick={pickNextRandomQuestion}
                className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors"
                title="다른 문제 뽑기"
              >
                <Shuffle className="w-3.5 h-3.5 text-slate-600" />
                <span>다른 문제 뽑기</span>
              </button>
            </div>

            {/* Main Question Text */}
            <div className="text-center py-1">
              <h4 className="text-lg sm:text-2xl font-black text-slate-900 font-jua leading-snug">
                오선지의 조표를 보고{' '}
                <span className="text-amber-600 underline decoration-amber-400 decoration-wavy decoration-2">
                  [{currentQuestion.name}]
                </span>
                의 으뜸음({currentQuestion.tonicSolfege}) 건반을 눌러보세요!
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                {currentQuestion.mode === 'major'
                  ? '장조의 으뜸음은 항상 계이름 "도" 자리가 됩니다. 피아노 건반에서 찾아보세요!'
                  : '단조의 으뜸음은 항상 계이름 "라" 자리가 됩니다. 피아노 건반에서 찾아보세요!'}
              </p>
            </div>

            {/* SVG Musical Staff Rendering */}
            <div className="bg-[#FFFDF8] rounded-2xl border-2 border-amber-200/80 p-4 sm:p-5 flex flex-col items-center justify-center relative overflow-hidden">
              <svg
                viewBox="0 0 460 170"
                className="w-full max-w-[500px] h-40 select-none"
              >
                {/* 5 Staff Lines */}
                {[74, 88, 102, 116, 130].map((y, idx) => (
                  <line
                    key={idx}
                    x1="25"
                    y1={y}
                    x2="435"
                    y2={y}
                    stroke="#1E293B"
                    strokeWidth="2.5"
                  />
                ))}

                {/* Left & Right End Bar Lines */}
                <line x1="25" y1="74" x2="25" y2="130" stroke="#1E293B" strokeWidth="3" />
                <line x1="435" y1="74" x2="435" y2="130" stroke="#1E293B" strokeWidth="3" />

                {/* Treble Clef (높은음자리표) */}
                <text
                  x="35"
                  y="126"
                  fontFamily="serif"
                  fontSize="68"
                  fill="#0F172A"
                  className="select-none"
                >
                  𝄞
                </text>

                {/* Key Signature Accidentals (조표 위치) */}
                {currentQuestion.accidentals.map((acc, idx) => (
                  <g key={idx}>
                    <text
                      x={acc.x}
                      y={acc.y}
                      fontFamily="sans-serif"
                      fontWeight="900"
                      fontSize={acc.type === '#' ? '28' : '26'}
                      fill={acc.type === '#' ? '#D97706' : '#2563EB'}
                      className="select-none"
                    >
                      {acc.type === '#' ? '♯' : '♭'}
                    </text>
                    {/* Small helper label under accidental if hint is open */}
                    {showHint && (
                      <text
                        x={acc.x + (acc.type === '#' ? 2 : 1)}
                        y={acc.y + 22}
                        fontSize="10"
                        fontWeight="700"
                        fill="#64748B"
                        textAnchor="middle"
                      >
                        {acc.noteLabel}
                      </text>
                    )}
                  </g>
                ))}

                {/* When No Sharps and No Flats (다장조 / 가단조) */}
                {currentQuestion.sharpsCount === 0 && currentQuestion.flatsCount === 0 && (
                  <g>
                    <rect x="95" y="80" width="130" height="42" rx="10" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
                    <text x="160" y="106" fontSize="13" fontWeight="900" fill="#92400E" textAnchor="middle" fontFamily="sans-serif">
                      조표 없음 (깨끗함)
                    </text>
                  </g>
                )}

                {/* Question mark placeholder note in staff */}
                <g transform="translate(300, 102)">
                  <circle cx="0" cy="0" r="18" fill={isCorrect ? '#10B981' : isCorrect === false ? '#EF4444' : '#F59E0B'} opacity="0.2" className="animate-pulse" />
                  <circle cx="0" cy="0" r="12" fill={isCorrect ? '#059669' : isCorrect === false ? '#DC2626' : '#D97706'} />
                  <text x="0" y="5" fontSize="14" fontWeight="900" fill="#FFFFFF" textAnchor="middle" fontFamily="sans-serif">
                    {isCorrect ? '✓' : isCorrect === false ? '?' : '으뜸음'}
                  </text>
                </g>
              </svg>

              {/* Hint Toggle Button */}
              <div className="mt-2 flex items-center justify-between w-full max-w-[500px]">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-1.5 text-xs text-amber-900 bg-amber-100/90 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300 font-extrabold transition-all cursor-pointer shadow-2xs font-jua"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
                  <span>{showHint ? '힌트 닫기' : '💡 으뜸음 공식 힌트 보기'}</span>
                </button>

                <span className="text-[11px] text-slate-500 font-medium">
                  {currentQuestion.sharpsCount > 0 && `올림표(#) ${currentQuestion.sharpsCount}개`}
                  {currentQuestion.flatsCount > 0 && `내림표(b) ${currentQuestion.flatsCount}개`}
                  {currentQuestion.sharpsCount === 0 && currentQuestion.flatsCount === 0 && '조표 없음'}
                </span>
              </div>

              {/* Expanded Hint Box */}
              {showHint && (
                <div className="w-full max-w-[500px] mt-3 p-3.5 bg-amber-50 rounded-2xl border-2 border-amber-300 text-xs text-amber-950 space-y-1.5 animate-fadeIn">
                  <div className="flex items-center gap-2 font-black font-jua text-sm text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>초등 음악 교과서 으뜸음 공식 힌트:</span>
                  </div>
                  <p className="leading-relaxed font-bold">
                    👉 {currentQuestion.mnemonicRule}
                  </p>
                  <p className="text-amber-800 leading-relaxed font-medium">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Answer Feedback Banner */}
            {isCorrect === true && (
              <div className="p-4 sm:p-5 bg-emerald-50 rounded-2xl border-2 border-emerald-400 space-y-3 shadow-xs animate-fadeIn">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-500 text-white rounded-xl shrink-0 mt-0.5">
                      <Crown className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base sm:text-lg font-black text-emerald-950 font-jua">
                          🎉 정답입니다! 으뜸음 [{currentQuestion.tonicKoreanName}({currentQuestion.tonicEngName})] 건반을 완벽하게 찾았습니다!
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950 font-black text-xs">
                          +10점 {streak > 1 ? `(연속 콤보 +${streak * 2}점)` : ''}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-emerald-800 mt-1.5 font-bold leading-relaxed">
                        💡 {currentQuestion.mnemonicRule}
                      </p>
                      <p className="text-xs text-emerald-700 mt-0.5 font-medium leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm transition-all cursor-pointer font-jua shadow-sm shrink-0"
                  >
                    <span>다음 문제</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {isCorrect === false && lastClickedNote && (
              <div className="p-4 bg-rose-50 rounded-2xl border-2 border-rose-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-shake">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-rose-500 text-white rounded-xl shrink-0 mt-0.5">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-black text-rose-950 text-sm sm:text-base font-jua">
                      앗! 누르신 건반은 [{lastClickedNote.koreanName}({lastClickedNote.engName})] 이에요.
                    </h5>
                    <p className="text-xs sm:text-sm text-rose-800 font-bold mt-1">
                      💡 힌트: {currentQuestion.mnemonicRule}
                    </p>
                    <p className="text-xs text-rose-700 mt-0.5 font-medium">
                      건반을 다시 잘 살펴보고 올바른 으뜸음을 눌러보세요!
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-950 rounded-xl text-xs font-black cursor-pointer transition-colors font-jua shrink-0"
                >
                  공식 다시보기
                </button>
              </div>
            )}
          </div>

          {/* 3. Interactive Virtual Keyboard for Student Input */}
          <div className="bg-white rounded-3xl border-2 border-slate-300 p-5 sm:p-6 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-amber-600" />
                <h4 className="font-black text-slate-900 text-sm sm:text-base font-jua">
                  가상 건반에서 으뜸음 건반을 직접 터치하세요:
                </h4>
              </div>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">
                키보드 자판 (a, s, d, f, g...)으로도 칠 수 있어요!
              </span>
            </div>

            {/* Virtual Piano Canvas */}
            <div className="relative pt-2 pb-4 overflow-x-auto select-none">
              <div className="min-w-[620px] max-w-[850px] mx-auto relative flex justify-center bg-[#2B231B] p-3 rounded-3xl shadow-xl border-4 border-[#3D3025]">
                {/* White Keys Container */}
                <div className="flex relative w-full h-44 sm:h-52">
                  {PIANO_KEYS.filter(k => !k.isBlack).map(key => {
                    const isTonic =
                      currentQuestion.tonicPitchNames.includes(key.basePitchName) ||
                      currentQuestion.tonicPitchNames.includes(key.engName);
                    const isSelected = selectedKeyPitch === key.pitch;
                    const showSuccessHighlight = isCorrect === true && isTonic;
                    const showWrongHighlight = isCorrect === false && isSelected;

                    return (
                      <button
                        key={key.pitch}
                        type="button"
                        onClick={() => handleKeyClick(key)}
                        className={`flex-1 relative flex flex-col justify-end items-center pb-3 rounded-b-xl border-b-4 transition-all cursor-pointer ${
                          showSuccessHighlight
                            ? 'bg-gradient-to-t from-emerald-400 to-emerald-200 border-emerald-600 text-emerald-950 shadow-md ring-4 ring-emerald-300/80 z-10'
                            : showWrongHighlight
                              ? 'bg-gradient-to-t from-rose-300 to-rose-100 border-rose-500 text-rose-950 ring-2 ring-rose-400'
                              : 'bg-[#FFFDF7] hover:bg-amber-50 active:bg-amber-100 border-slate-400/90 text-slate-800'
                        }`}
                        style={{
                          marginRight: '2px',
                        }}
                      >
                        {/* Keyboard shortcut hint badge */}
                        {key.keyboardKey && (
                          <span className="absolute top-2 text-[10px] font-bold text-slate-400/80 bg-slate-100/80 px-1 rounded">
                            {key.keyboardKey}
                          </span>
                        )}

                        {/* Crown/Star indicator when correct */}
                        {showSuccessHighlight && (
                          <div className="absolute top-8 p-1 bg-emerald-500 text-white rounded-full animate-bounce">
                            <Crown className="w-3.5 h-3.5" />
                          </div>
                        )}

                        {/* Note Label */}
                        <div className="text-center font-bold">
                          <span className="text-xs sm:text-sm font-black block font-jua">
                            {getKeyLabel(key)}
                          </span>
                          {keyLabel !== 'hidden' && (
                            <span className="text-[10px] text-slate-500 block">
                              {key.pitch}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Black Keys Container (Absolute Overlay) */}
                <div className="absolute top-3 left-3 right-3 h-28 sm:h-32 pointer-events-none flex w-[calc(100%-24px)]">
                  {/* Black keys positioned at relative percentages */}
                  {/* 15 white keys in total: C3 to D5 = 16 white keys */}
                  {/* We map black keys to their slot */}
                  {renderBlackKeys(currentQuestion, selectedKeyPitch, isCorrect, handleKeyClick, keyLabel)}
                </div>
              </div>
            </div>

            {/* Instruction helper */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1">
              <span>💡 으뜸음은 어느 옥타브의 건반을 눌러도 모두 정답으로 인정됩니다!</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-bold text-emerald-700">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> 초록: 정답 으뜸음
                </span>
                <span className="flex items-center gap-1 font-bold text-rose-700">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" /> 빨강: 오답
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 4. Round Completion Summary Report */
        <div className="bg-white rounded-3xl border-2 border-amber-300 p-8 text-center space-y-6 shadow-sm">
          <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto text-amber-600 shadow-inner">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-jua">
              🎉 으뜸음 건반 찾기 훈련 완주!
            </h3>
            <p className="text-sm text-slate-600 font-medium max-w-md mx-auto">
              조표를 보고 으뜸음(도/라)을 찾는 공식을 훌륭하게 마스터했습니다!
            </p>
          </div>

          {/* Score & Badge Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
            <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-200">
              <div className="text-xs text-amber-800 font-bold">최종 점수</div>
              <div className="text-2xl font-black text-amber-950 font-jua mt-1">{score}점</div>
            </div>
            <div className="p-4 bg-rose-50 rounded-2xl border-2 border-rose-200">
              <div className="text-xs text-rose-800 font-bold">최대 연속 콤보</div>
              <div className="text-2xl font-black text-rose-950 font-jua mt-1">{bestStreak}콤보</div>
            </div>
            <div className="p-4 bg-indigo-50 rounded-2xl border-2 border-indigo-200">
              <div className="text-xs text-indigo-800 font-bold">도전 모드</div>
              <div className="text-sm font-black text-indigo-950 font-jua mt-1.5">
                {filterMode === 'textbook' ? '초등 교과서' : filterMode === 'major' ? '장조 집중' : filterMode === 'minor' ? '단조 집중' : '전체 무작위'}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              type="button"
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-sm transition-all cursor-pointer font-jua shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>한 번 더 도전하기</span>
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('all')}
              className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm transition-all cursor-pointer font-jua shadow-sm"
            >
              <Compass className="w-4 h-4" />
              <span>전체 무작위 모드로 도전하기</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. Elementary Key Signature Cheat Sheet (초등 교과서 조표 꿀팁 치트시트) */}
      <div className="bg-[#FFFDF9] rounded-3xl border-2 border-amber-200 p-5 sm:p-6 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500 text-white rounded-xl shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="font-black text-slate-900 text-base font-jua">
            📖 초등 음악 교과서 조표 & 으뜸음 공식 정리표 (요약)
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-white rounded-2xl border-2 border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <strong className="text-slate-900 font-black text-sm font-jua">☀️ 다장조 (C Major)</strong>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">조표 없음</span>
            </div>
            <p className="text-slate-700 font-medium">
              • 으뜸음: <strong>다(C) = "도"</strong><br />
              • 기본 흰건반으로 연주하는 가장 기초적인 장조입니다.
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border-2 border-amber-200 space-y-1">
            <div className="flex items-center justify-between">
              <strong className="text-amber-950 font-black text-sm font-jua">🍀 사장조 (G Major)</strong>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold"># 1개 (파#)</span>
            </div>
            <p className="text-slate-700 font-medium">
              • 으뜸음: <strong>사(G) = "도"</strong><br />
              • 교과서 14쪽 &lt;네잎클로버&gt; 수록곡! 파# 바로 위 솔이 도!
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border-2 border-blue-200 space-y-1">
            <div className="flex items-center justify-between">
              <strong className="text-blue-950 font-black text-sm font-jua">🌊 바장조 (F Major)</strong>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-bold">b 1개 (시b)</span>
            </div>
            <p className="text-slate-700 font-medium">
              • 으뜸음: <strong>바(F) = "도"</strong><br />
              • 시b에서 4도 아래 파가 으뜸음 도!
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border-2 border-purple-200 space-y-1">
            <div className="flex items-center justify-between">
              <strong className="text-purple-950 font-black text-sm font-jua">🎺 라장조 (D Major)</strong>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-bold"># 2개 (파#, 도#)</span>
            </div>
            <p className="text-slate-700 font-medium">
              • 으뜸음: <strong>라(D) = "도"</strong><br />
              • 마지막 샵인 도# 바로 위 레가 으뜸음 도!
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border-2 border-indigo-200 space-y-1">
            <div className="flex items-center justify-between">
              <strong className="text-indigo-950 font-black text-sm font-jua">🌙 라단조 (D minor)</strong>
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 text-[10px] font-bold">b 1개 (시b)</span>
            </div>
            <p className="text-slate-700 font-medium">
              • 으뜸음: <strong>라(D) = "라"</strong><br />
              • 교과서 50쪽 &lt;별 보며 달 보며&gt;! 바장조(파)에서 3반음 아래!
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border-2 border-rose-200 space-y-1">
            <div className="flex items-center justify-between">
              <strong className="text-rose-950 font-black text-sm font-jua">✨ 가단조 (A minor)</strong>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 text-[10px] font-bold">조표 없음</span>
            </div>
            <p className="text-slate-700 font-medium">
              • 으뜸음: <strong>가(A) = "라"</strong><br />
              • 다장조(도)에서 3반음 아래로 내려간 차분한 단조입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to render black keys with accurate alignment above white keys
function renderBlackKeys(
  currentQuestion: KeySignatureQuestion,
  selectedKeyPitch: string | null,
  isCorrect: boolean | null,
  handleKeyClick: (key: PianoKey) => void,
  keyLabel: KeyLabelType
) {
  // Total white keys = 16 (C3, D3, E3, F3, G3, A3, B3, C4, D4, E4, F4, G4, A4, B4, C5, D5)
  // Index of white keys:
  // C3=0, D3=1, E3=2, F3=3, G3=4, A3=5, B3=6, C4=7, D4=8, E4=9, F4=10, G4=11, A4=12, B4=13, C5=14, D5=15
  // Black keys sit between white keys:
  // C#3 between 0 & 1 -> left offset = (1 / 16) * 100%
  // D#3 between 1 & 2 -> left offset = (2 / 16) * 100%
  // F#3 between 3 & 4 -> left offset = (4 / 16) * 100%
  // G#3 between 4 & 5 -> left offset = (5 / 16) * 100%
  // A#3 between 5 & 6 -> left offset = (6 / 16) * 100%
  // C#4 between 7 & 8 -> left offset = (8 / 16) * 100%
  // D#4 between 8 & 9 -> left offset = (9 / 16) * 100%
  // F#4 between 10 & 11 -> left offset = (11 / 16) * 100%
  // G#4 between 11 & 12 -> left offset = (12 / 16) * 100%
  // A#4 between 12 & 13 -> left offset = (13 / 16) * 100%
  // C#5 between 14 & 15 -> left offset = (15 / 16) * 100%

  const blackKeysMap: { pitch: string; betweenWhiteIndex: number }[] = [
    { pitch: 'C#3', betweenWhiteIndex: 1 },
    { pitch: 'D#3', betweenWhiteIndex: 2 },
    { pitch: 'F#3', betweenWhiteIndex: 4 },
    { pitch: 'G#3', betweenWhiteIndex: 5 },
    { pitch: 'A#3', betweenWhiteIndex: 6 },

    { pitch: 'C#4', betweenWhiteIndex: 8 },
    { pitch: 'D#4', betweenWhiteIndex: 9 },
    { pitch: 'F#4', betweenWhiteIndex: 11 },
    { pitch: 'G#4', betweenWhiteIndex: 12 },
    { pitch: 'A#4', betweenWhiteIndex: 13 },

    { pitch: 'C#5', betweenWhiteIndex: 15 },
  ];

  const totalWhite = 16;
  const blackKeyWidthPercent = 3.9; // % width of each black key

  return blackKeysMap.map(({ pitch, betweenWhiteIndex }) => {
    const key = PIANO_KEYS.find(k => k.pitch === pitch);
    if (!key) return null;

    const isTonic =
      currentQuestion.tonicPitchNames.includes(key.basePitchName) ||
      currentQuestion.tonicPitchNames.includes(key.engName);
    const isSelected = selectedKeyPitch === key.pitch;
    const showSuccessHighlight = isCorrect === true && isTonic;
    const showWrongHighlight = isCorrect === false && isSelected;

    const leftPercent = (betweenWhiteIndex / totalWhite) * 100 - blackKeyWidthPercent / 2;

    return (
      <button
        key={key.pitch}
        type="button"
        onClick={() => handleKeyClick(key)}
        className={`pointer-events-auto absolute top-0 h-full rounded-b-xl border-x border-b-4 flex flex-col justify-end items-center pb-2 transition-all cursor-pointer shadow-lg ${
          showSuccessHighlight
            ? 'bg-gradient-to-t from-emerald-500 to-emerald-400 border-emerald-700 text-white ring-4 ring-emerald-300 z-30'
            : showWrongHighlight
              ? 'bg-gradient-to-t from-rose-600 to-rose-500 border-rose-800 text-white ring-2 ring-rose-400 z-30'
              : 'bg-[#1E1A16] hover:bg-[#342D25] border-black text-slate-200 z-20'
        }`}
        style={{
          left: `${leftPercent}%`,
          width: `${blackKeyWidthPercent}%`,
        }}
      >
        {/* Keyboard shortcut */}
        {key.keyboardKey && (
          <span className="text-[9px] text-slate-400 bg-black/50 px-0.5 rounded mb-1">
            {key.keyboardKey}
          </span>
        )}

        {/* Crown indicator if correct */}
        {showSuccessHighlight && (
          <Crown className="w-3 h-3 text-amber-300 mb-1 animate-bounce" />
        )}

        {/* Label */}
        {keyLabel !== 'hidden' && (
          <span className="text-[10px] font-black leading-none block text-center font-jua">
            {keyLabel === 'korean' ? key.koreanName : keyLabel === 'english' ? key.engName : isTonic ? currentQuestion.tonicSolfege : ''}
          </span>
        )}
      </button>
    );
  });
}
