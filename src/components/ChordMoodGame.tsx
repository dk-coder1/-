import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { soundEngine } from '../utils/audioEngine';
import {
  Volume2,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Flame,
  HelpCircle,
  Music,
  Play,
  Sparkle
} from 'lucide-react';

export type ChordQuality = 'major' | 'minor';
export type GameMode = 'textbook' | 'all';

export interface ChordQuestion {
  id: string;
  name: string; // e.g. "C Major (다장조 으뜸화음)"
  chordQuality: ChordQuality;
  rootPitch: string; // "C"
  rootKorean: string; // "다"
  notes: string[]; // ['C4', 'E4', 'G4']
  noteNamesKorean: string[]; // ['도', '미', '솔']
  noteNamesPitch: string[]; // ['C', 'E', 'G']
  mood: 'happy' | 'sad';
  moodDescription: string;
  thirdIntervalName: string; // "장3도 (반음 4개)"
  thirdIntervalExplanation: string;
  pedagogicalTip: string;
  difficulty: 'easy' | 'normal';
}

const CHORD_QUESTIONS_POOL: ChordQuestion[] = [
  // 1. C Major (다장조 으뜸화음)
  {
    id: 'c-major',
    name: '다장조 으뜸화음 (C Major)',
    chordQuality: 'major',
    rootPitch: 'C',
    rootKorean: '다',
    notes: ['C4', 'E4', 'G4'],
    noteNamesKorean: ['도', '미', '솔'],
    noteNamesPitch: ['C', 'E', 'G'],
    mood: 'happy',
    moodDescription: '햇살처럼 밝고 씩씩하며 당당한 울림',
    thirdIntervalName: '장3도 (반음 4개 거리)',
    thirdIntervalExplanation: '으뜸음 "도(C)"에서 세 번째 음 "미(E)"까지 온음 2개(반음 4개)로 넓어서 활짝 웃는 표정처럼 밝아요.',
    pedagogicalTip: '초등 5·6학년 교과서 다장조의 기본 으뜸화음(Ⅰ, 도-미-솔)입니다.',
    difficulty: 'easy'
  },
  // 2. A Minor (가단조 으뜸화음)
  {
    id: 'a-minor',
    name: '가단조 으뜸화음 (A Minor)',
    chordQuality: 'minor',
    rootPitch: 'A',
    rootKorean: '가',
    notes: ['A3', 'C4', 'E4'],
    noteNamesKorean: ['라', '도', '미'],
    noteNamesPitch: ['A', 'C', 'E'],
    mood: 'sad',
    moodDescription: '가을 저녁처럼 차분하고 쓸쓸하며 애틋한 울림',
    thirdIntervalName: '단3도 (반음 3개 거리)',
    thirdIntervalExplanation: '으뜸음 "라(A)"에서 세 번째 음 "도(C)"까지 온음 1개+반음 1개(반음 3개)로 좁아져 마음을 차분하게 가라앉혀 줍니다.',
    pedagogicalTip: '다장조와 조표가 똑같은 나란한 단조(가단조)의 으뜸화음(라-도-미)입니다.',
    difficulty: 'easy'
  },
  // 3. G Major (사장조 으뜸화음 - 네잎클로버)
  {
    id: 'g-major',
    name: '사장조 으뜸화음 (G Major)',
    chordQuality: 'major',
    rootPitch: 'G',
    rootKorean: '사',
    notes: ['G4', 'B4', 'D5'],
    noteNamesKorean: ['솔', '시', '레'],
    noteNamesPitch: ['G', 'B', 'D'],
    mood: 'happy',
    moodDescription: '네잎클로버처럼 희망차고 활기찬 울림',
    thirdIntervalName: '장3도 (반음 4개 거리)',
    thirdIntervalExplanation: '으뜸음 "솔(G)"에서 "시(B)"까지 4반음(장3도)이라 빛나고 힘차게 도약하는 느낌을 줍니다.',
    pedagogicalTip: '교과서 사장조 대표곡 <네잎클로버>의 중심 으뜸화음입니다.',
    difficulty: 'easy'
  },
  // 4. E Minor (마단조 으뜸화음 - 사장조의 나란한 단조)
  {
    id: 'e-minor',
    name: '마단조 으뜸화음 (E Minor)',
    chordQuality: 'minor',
    rootPitch: 'E',
    rootKorean: '마',
    notes: ['E4', 'G4', 'B4'],
    noteNamesKorean: ['미', '솔', '시'],
    noteNamesPitch: ['E', 'G', 'B'],
    mood: 'sad',
    moodDescription: '조용하고 아련하며 사색적인 쓸쓸한 울림',
    thirdIntervalName: '단3도 (반음 3개 거리)',
    thirdIntervalExplanation: '으뜸음 "미(E)"와 세 번째 음 "솔(G)" 사이가 3반음(단3도)이라 서정적인 그늘이 생겨요.',
    pedagogicalTip: '사장조(# 1개)와 조표를 공유하는 나란한 단조(마단조)의 으뜸화음입니다.',
    difficulty: 'easy'
  },
  // 5. F Major (바장조 으뜸화음)
  {
    id: 'f-major',
    name: '바장조 으뜸화음 (F Major)',
    chordQuality: 'major',
    rootPitch: 'F',
    rootKorean: '바',
    notes: ['F4', 'A4', 'C5'],
    noteNamesKorean: ['파', '라', '도'],
    noteNamesPitch: ['F', 'A', 'C'],
    mood: 'happy',
    moodDescription: '푸른 들판처럼 싱그럽고 따뜻하며 평화로운 울림',
    thirdIntervalName: '장3도 (반음 4개 거리)',
    thirdIntervalExplanation: '으뜸음 "파(F)"에서 "라(A)"까지 4반음(장3도)으로 밝고 포근한 화음입니다.',
    pedagogicalTip: '초등 5학년 교과서 바장조(플랫 1개)의 으뜸화음입니다.',
    difficulty: 'easy'
  },
  // 6. D Minor (라단조 으뜸화음 - 별 보며 달 보며)
  {
    id: 'd-minor',
    name: '라단조 으뜸화음 (D Minor)',
    chordQuality: 'minor',
    rootPitch: 'D',
    rootKorean: '라',
    notes: ['D4', 'F4', 'A4'],
    noteNamesKorean: ['레', '파', '라'],
    noteNamesPitch: ['D', 'F', 'A'],
    mood: 'sad',
    moodDescription: '밤하늘의 별과 달처럼 은은하고 차분하며 쓸쓸한 울림',
    thirdIntervalName: '단3도 (반음 3개 거리)',
    thirdIntervalExplanation: '으뜸음 "레(D)"에서 세 번째 음 "파(F)"까지 3반음(단3도)이라 살포시 슬픈 감성이 묻어납니다.',
    pedagogicalTip: '교과서 6학년 라단조 곡 <별 보며 달 보며>의 으뜸화음입니다.',
    difficulty: 'easy'
  },
  // 7. D Major (라장조 으뜸화음 - # 2개)
  {
    id: 'd-major',
    name: '라장조 으뜸화음 (D Major)',
    chordQuality: 'major',
    rootPitch: 'D',
    rootKorean: '라',
    notes: ['D4', 'F#4', 'A4'],
    noteNamesKorean: ['레', '파#', '라'],
    noteNamesPitch: ['D', 'F#', 'A'],
    mood: 'happy',
    moodDescription: '황금빛 나팔처럼 당당하고 찬란한 울림',
    thirdIntervalName: '장3도 (반음 4개 거리)',
    thirdIntervalExplanation: '가운데 음에 샵(#)이 붙어 "레"부터 "파#"까지 시원하게 4반음(장3도)을 이룹니다.',
    pedagogicalTip: '같은 "레(D)" 으뜸음이라도 파#이 들어가면 라장조(밝음), 파 제자리표면 라단조(쓸쓸함)가 됩니다.',
    difficulty: 'normal'
  },
  // 8. C Minor (다단조 으뜸화음)
  {
    id: 'c-minor',
    name: '다단조 으뜸화음 (C Minor)',
    chordQuality: 'minor',
    rootPitch: 'C',
    rootKorean: '다',
    notes: ['C4', 'D#4', 'G4'],
    noteNamesKorean: ['도', '미b', '솔'],
    noteNamesPitch: ['C', 'Eb', 'G'],
    mood: 'sad',
    moodDescription: '웅장하면서도 비장하고 깊은 쓸쓸함을 담은 울림',
    thirdIntervalName: '단3도 (반음 3개 거리)',
    thirdIntervalExplanation: '다장조의 "미"를 반음 내려 "미b"으로 연주하면 신기하게도 밝았던 울림이 순식간에 차분하고 슬프게 바뀝니다.',
    pedagogicalTip: '베토벤 운명 교향곡으로 유명한 대표적인 단조 울림입니다.',
    difficulty: 'normal'
  },
  // 9. A Major (가장조 으뜸화음)
  {
    id: 'a-major',
    name: '가장조 으뜸화음 (A Major)',
    chordQuality: 'major',
    rootPitch: 'A',
    rootKorean: '가',
    notes: ['A3', 'C#4', 'E4'],
    noteNamesKorean: ['라', '도#', '미'],
    noteNamesPitch: ['A', 'C#', 'E'],
    mood: 'happy',
    moodDescription: '봄날의 꽃잎처럼 화사하고 활짝 갠 화창한 울림',
    thirdIntervalName: '장3도 (반음 4개 거리)',
    thirdIntervalExplanation: '가단조(쓸쓸함)의 가운데 음 "도"에 샵(#)을 붙여 장3도로 넓히면 활기찬 가장조가 됩니다.',
    pedagogicalTip: '가단조(A Minor)와 비교 청음하기에 가장 좋은 화음입니다.',
    difficulty: 'normal'
  },
  // 10. G Minor (사단조 으뜸화음)
  {
    id: 'g-minor',
    name: '사단조 으뜸화음 (G Minor)',
    chordQuality: 'minor',
    rootPitch: 'G',
    rootKorean: '사',
    notes: ['G4', 'A#4', 'D5'],
    noteNamesKorean: ['솔', '시b', '레'],
    noteNamesPitch: ['G', 'Bb', 'D'],
    mood: 'sad',
    moodDescription: '모차르트 교향곡처럼 우아하면서도 애수 어린 쓸쓸한 울림',
    thirdIntervalName: '단3도 (반음 3개 거리)',
    thirdIntervalExplanation: '사장조의 "시"를 반음 내린 "시b"을 써서 단3도로 만들어 쓸쓸한 감성을 자아냅니다.',
    pedagogicalTip: '사장조의 밝음과 사단조의 슬픔을 한 끗 차이로 보여주는 대표 화음입니다.',
    difficulty: 'normal'
  }
];

export const ChordMoodGame: React.FC = () => {
  // Game Setup
  const [mode, setMode] = useState<GameMode>('textbook');
  const [questions, setQuestions] = useState<ChordQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [answeredState, setAnsweredState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [selectedGuess, setSelectedGuess] = useState<ChordQuality | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Compare Lab (직접 귀로 비교해보는 미니 연구소)
  const [compareKey, setCompareKey] = useState<'C' | 'A' | 'D' | 'G'>('C');

  // Filter questions according to mode
  const activePool = useMemo(() => {
    if (mode === 'textbook') {
      return CHORD_QUESTIONS_POOL.filter(q => q.difficulty === 'easy');
    }
    return CHORD_QUESTIONS_POOL;
  }, [mode]);

  // Play chord function with mode
  const playChordSound = useCallback((notes: string[], style: 'block' | 'arpeggio' | 'third-only') => {
    if (!notes || notes.length < 3) return;
    setIsPlayingAudio(true);

    if (style === 'block') {
      soundEngine.playChord(notes, 1.8, 0.03, 0.28);
      setTimeout(() => setIsPlayingAudio(false), 1900);
    } else if (style === 'arpeggio') {
      notes.forEach((note, idx) => {
        soundEngine.playNote(note, 0.9, idx * 0.45, 0.25);
      });
      soundEngine.playChord(notes, 1.5, notes.length * 0.45 + 0.1, 0.22);
      setTimeout(() => setIsPlayingAudio(false), 2400);
    } else if (style === 'third-only') {
      soundEngine.playNote(notes[0], 0.8, 0, 0.26);
      soundEngine.playNote(notes[1], 1.2, 0.4, 0.28);
      setTimeout(() => setIsPlayingAudio(false), 1700);
    }
  }, []);

  // Start a new game session
  const startNewGame = useCallback(() => {
    const shuffled = [...activePool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 8);
    setQuestions(selected);
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setAnsweredState('idle');
    setSelectedGuess(null);
    setIsGameOver(false);
    setShowExplanation(false);

    setTimeout(() => {
      if (selected[0]) {
        playChordSound(selected[0].notes, 'block');
      }
    }, 450);
  }, [activePool, playChordSound]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const currentQuestion = questions[currentIndex] || questions[0];

  const playFeedbackSound = (isCorrectFeedback: boolean) => {
    if (isCorrectFeedback) {
      soundEngine.playNote('C5', 0.25, 0, 0.28);
      soundEngine.playNote('E5', 0.25, 0.12, 0.28);
      soundEngine.playNote('G5', 0.35, 0.24, 0.32);
      soundEngine.playNote('C6', 0.7, 0.38, 0.35);
    } else {
      soundEngine.playNote('A3', 0.4, 0, 0.22);
      soundEngine.playNote('C4', 0.6, 0.12, 0.2);
    }
  };

  const handleGuess = (quality: ChordQuality) => {
    if (answeredState !== 'idle' || !currentQuestion) return;

    setSelectedGuess(quality);
    const isCorrectGuess = quality === currentQuestion.chordQuality;

    if (isCorrectGuess) {
      const nextCombo = combo + 1;
      const points = 10 + nextCombo * 2;
      setScore(prev => prev + points);
      setCombo(nextCombo);
      if (nextCombo > maxCombo) {
        setMaxCombo(nextCombo);
      }
      setAnsweredState('correct');
      playFeedbackSound(true);
    } else {
      setCombo(0);
      setAnsweredState('wrong');
      playFeedbackSound(false);
    }
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setIsGameOver(true);
      return;
    }

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setAnsweredState('idle');
    setSelectedGuess(null);
    setShowExplanation(false);

    setTimeout(() => {
      const nextQ = questions[nextIndex];
      if (nextQ) {
        playChordSound(nextQ.notes, 'block');
      }
    }, 300);
  };

  const comparePairs: Record<'C' | 'A' | 'D' | 'G', {
    name: string;
    majorName: string;
    majorNotes: string[];
    majorNoteNames: string;
    minorName: string;
    minorNotes: string[];
    minorNoteNames: string;
    explanation: string;
  }> = {
    C: {
      name: '다(C)음 기준 비교',
      majorName: '다장조 (C Major)',
      majorNotes: ['C4', 'E4', 'G4'],
      majorNoteNames: '도 - 미 - 솔',
      minorName: '다단조 (C Minor)',
      minorNotes: ['C4', 'D#4', 'G4'],
      minorNoteNames: '도 - 미b - 솔',
      explanation: '가운데 음인 "미"를 반음 내린 "미b"으로 바꾸면, 밝았던 화음이 한순간에 쓸쓸한 화음으로 변신해요!'
    },
    A: {
      name: '가(A)음 기준 비교',
      majorName: '가장조 (A Major)',
      majorNotes: ['A3', 'C#4', 'E4'],
      majorNoteNames: '라 - 도# - 미',
      minorName: '가단조 (A Minor)',
      minorNotes: ['A3', 'C4', 'E4'],
      minorNoteNames: '라 - 도 - 미',
      explanation: '교과서 가단조(라-도-미)의 쓸쓸한 울림에서, 가운데 음 "도"를 반음 올리면 활짝 웃는 가장조가 됩니다.'
    },
    D: {
      name: '라(D)음 기준 비교',
      majorName: '라장조 (D Major)',
      majorNotes: ['D4', 'F#4', 'A4'],
      majorNoteNames: '레 - 파# - 라',
      minorName: '라단조 (D Minor)',
      minorNotes: ['D4', 'F4', 'A4'],
      minorNoteNames: '레 - 파 - 라',
      explanation: '교과서 <별 보며 달 보며>의 라단조(레-파-라)와 라장조(레-파#-라)를 나란히 들어보며 3도 음의 마법을 느껴보세요.'
    },
    G: {
      name: '사(G)음 기준 비교',
      majorName: '사장조 (G Major)',
      majorNotes: ['G4', 'B4', 'D5'],
      majorNoteNames: '솔 - 시 - 레',
      minorName: '사단조 (G Minor)',
      minorNotes: ['G4', 'A#4', 'D5'],
      minorNoteNames: '솔 - 시b - 레',
      explanation: '희망찬 <네잎클로버> 사장조(솔-시-레)의 "시"를 반음 내리면 깊은 사색에 잠기는 사단조가 됩니다.'
    }
  };

  const selectedPair = comparePairs[compareKey];

  return (
    <div className="space-y-6">
      {/* 1. Challenge Header & Controls */}
      <div className="bg-white border-2 border-amber-300/80 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl shadow-xs shrink-0">
              <span className="text-2xl">👂</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-md border border-amber-200">
                  초등 화음 청음 훈련
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  장화음(Major) vs 단화음(Minor)
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 font-jua">
                화음 소리 느낌 맞추기
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                소리를 귀 기울여 듣고 밝고 신나는 느낌(장화음)인지, 차분하고 쓸쓸한 느낌(단화음)인지 맞춰보세요!
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-[#F8F9FA] p-1.5 rounded-2xl border border-slate-200 self-start md:self-center shrink-0">
            <button
              type="button"
              onClick={() => setMode('textbook')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer font-jua ${
                mode === 'textbook'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              교과서 중심 (기초)
            </button>
            <button
              type="button"
              onClick={() => setMode('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer font-jua ${
                mode === 'all'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              전체 화음 (도전)
            </button>
            <button
              type="button"
              onClick={startNewGame}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition-colors cursor-pointer"
              title="처음부터 다시 시작"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Score & Progress Status Ribbon */}
        {!isGameOver && questions.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-700 font-jua">
                문제 {currentIndex + 1} / {questions.length}
              </span>
              <div className="w-28 sm:w-36 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {combo > 1 && (
                <div className="flex items-center gap-1 font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 font-jua animate-pulse">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{combo} 연속 콤보!</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 font-black text-slate-800 bg-[#F8F9FA] px-3 py-1 rounded-xl border border-slate-200 font-jua">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>점수: <strong className="text-amber-700 text-base">{score}</strong>점</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Main Game Play Arena */}
      {!isGameOver && currentQuestion ? (
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
          {/* Sound Replay Station */}
          <div className="bg-gradient-to-br from-amber-50/70 to-orange-50/40 border-2 border-amber-200/80 rounded-3xl p-6 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-amber-300 text-xs font-black text-amber-900 shadow-2xs font-jua">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>화음 번호 #{currentIndex + 1}번의 소리를 듣고 맞춰보세요</span>
            </div>

            {/* Giant Play Chord Button */}
            <div className="flex flex-col items-center justify-center gap-3 py-2">
              <button
                type="button"
                onClick={() => playChordSound(currentQuestion.notes, 'block')}
                disabled={isPlayingAudio}
                className={`relative group px-8 py-5 rounded-3xl text-white font-black text-lg sm:text-xl shadow-lg transition-all cursor-pointer font-jua flex items-center gap-3 ${
                  isPlayingAudio
                    ? 'bg-amber-600 scale-98 shadow-md ring-4 ring-amber-200'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 hover:scale-102 hover:shadow-xl active:scale-95'
                }`}
              >
                <Volume2 className={`w-7 h-7 ${isPlayingAudio ? 'animate-bounce' : 'group-hover:scale-110'}`} />
                <span>{isPlayingAudio ? '소리 울려 퍼지는 중...' : '🔊 화음 소리 다시 듣기'}</span>
              </button>

              {/* Sub Listening Buttons: Arpeggio & Third only */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => playChordSound(currentQuestion.notes, 'arpeggio')}
                  disabled={isPlayingAudio}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-200 text-amber-950 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  title="3개 음을 차례대로 하나씩 펼쳐서 듣기"
                >
                  <Music className="w-3.5 h-3.5 text-amber-600" />
                  <span>한 음씩 펼쳐 듣기 (도-미-솔)</span>
                </button>
                <button
                  type="button"
                  onClick={() => playChordSound(currentQuestion.notes, 'third-only')}
                  disabled={isPlayingAudio}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-200 text-amber-950 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  title="으뜸음과 3도 음만 연주하여 느낌 비교하기"
                >
                  <Sparkle className="w-3.5 h-3.5 text-amber-600" />
                  <span>으뜸음과 3도 음만 듣기</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              💡 귀를 기울여보세요! 방금 울린 화음은 어떤 마음의 표정을 짓고 있나요?
            </p>
          </div>

          {/* Two Big Choice Buttons: Happy (Major) vs Sad (Minor) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* 1. Happy (Major / 장화음) Button */}
            <button
              type="button"
              onClick={() => handleGuess('major')}
              disabled={answeredState !== 'idle'}
              className={`p-6 sm:p-7 rounded-3xl border-3 text-left transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between ${
                answeredState === 'idle'
                  ? 'bg-amber-50/60 border-amber-300 hover:border-amber-500 hover:bg-amber-100/80 hover:shadow-md hover:-translate-y-1'
                  : answeredState === 'correct' && currentQuestion.chordQuality === 'major'
                  ? 'bg-amber-100 border-amber-600 ring-4 ring-amber-300 shadow-md'
                  : answeredState === 'wrong' && selectedGuess === 'major'
                  ? 'bg-red-50 border-red-400 opacity-80'
                  : currentQuestion.chordQuality === 'major'
                  ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400'
                  : 'bg-slate-50 border-slate-200 opacity-40'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-400 text-white flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">
                  ☀️
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-200/80 text-amber-950 font-jua">
                  Major
                </span>
              </div>

              <div className="mt-4">
                <h4 className="text-xl sm:text-2xl font-black text-amber-950 font-jua">
                  밝고 씩씩한 장화음
                </h4>
                <p className="text-xs sm:text-sm text-amber-900/80 font-medium mt-1 leading-relaxed">
                  햇살처럼 환하고, 기쁘고 당당하게 울려 퍼지는 느낌
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs font-black text-amber-900 font-jua">
                <span>선택하기</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* 2. Sad (Minor / 단화음) Button */}
            <button
              type="button"
              onClick={() => handleGuess('minor')}
              disabled={answeredState !== 'idle'}
              className={`p-6 sm:p-7 rounded-3xl border-3 text-left transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between ${
                answeredState === 'idle'
                  ? 'bg-indigo-50/60 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-100/80 hover:shadow-md hover:-translate-y-1'
                  : answeredState === 'correct' && currentQuestion.chordQuality === 'minor'
                  ? 'bg-indigo-100 border-indigo-600 ring-4 ring-indigo-300 shadow-md'
                  : answeredState === 'wrong' && selectedGuess === 'minor'
                  ? 'bg-red-50 border-red-400 opacity-80'
                  : currentQuestion.chordQuality === 'minor'
                  ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-400'
                  : 'bg-slate-50 border-slate-200 opacity-40'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500 text-white flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">
                  🌙
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-indigo-200/80 text-indigo-950 font-jua">
                  Minor
                </span>
              </div>

              <div className="mt-4">
                <h4 className="text-xl sm:text-2xl font-black text-indigo-950 font-jua">
                  차분하고 쓸쓸한 단화음
                </h4>
                <p className="text-xs sm:text-sm text-indigo-900/80 font-medium mt-1 leading-relaxed">
                  달밤처럼 고요하고, 은은하며 아련하게 가라앉는 느낌
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-indigo-200/60 flex items-center justify-between text-xs font-black text-indigo-900 font-jua">
                <span>선택하기</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* Instant Feedback Card with Musical Explanations */}
          {showExplanation && (
            <div
              className={`rounded-3xl p-5 sm:p-6 border-2 transition-all space-y-4 animate-in fade-in-50 duration-200 ${
                answeredState === 'correct'
                  ? 'bg-green-50/90 border-green-300 text-green-950'
                  : 'bg-amber-50/90 border-amber-300 text-amber-950'
              }`}
            >
              {/* Feedback Title */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  {answeredState === 'correct' ? (
                    <div className="w-9 h-9 rounded-xl bg-green-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg sm:text-xl font-black font-jua">
                      {answeredState === 'correct'
                        ? '정답입니다! 완벽하게 맞추셨어요!'
                        : '아쉬워요! 다시 한번 귀담아 들어볼까요?'}
                    </h4>
                    <p className="text-xs sm:text-sm font-semibold opacity-90">
                      방금 들으신 화음은 <strong>{currentQuestion.name}</strong> 이었습니다.
                    </p>
                  </div>
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-black font-jua flex items-center gap-1.5 shadow-md cursor-pointer transition-transform hover:scale-103 shrink-0"
                >
                  <span>{currentIndex + 1 >= questions.length ? '결과 보기' : '다음 문제'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Musical Breakdown */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500">으뜸음 (1음 / 근음)</span>
                    <p className="text-base font-black text-slate-900 font-jua mt-0.5">
                      {currentQuestion.noteNamesKorean[0]} ({currentQuestion.noteNamesPitch[0]})
                    </p>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${
                    currentQuestion.chordQuality === 'major'
                      ? 'bg-amber-50 border-amber-300 text-amber-950'
                      : 'bg-indigo-50 border-indigo-300 text-indigo-950'
                  }`}>
                    <span className="text-[11px] font-bold">
                      분위기를 결정하는 3음 ★
                    </span>
                    <p className="text-base font-black font-jua mt-0.5">
                      {currentQuestion.noteNamesKorean[1]} ({currentQuestion.noteNamesPitch[1]})
                    </p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500">기둥음 (5음)</span>
                    <p className="text-base font-black text-slate-900 font-jua mt-0.5">
                      {currentQuestion.noteNamesKorean[2]} ({currentQuestion.noteNamesPitch[2]})
                    </p>
                  </div>
                </div>

                {/* Explanation text */}
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-1.5">
                  <p>
                    <strong className="text-slate-900 font-black font-jua">🔍 소리의 비밀: </strong>
                    {currentQuestion.thirdIntervalExplanation}
                  </p>
                  <p className="text-slate-600">
                    <strong className="text-amber-900 font-bold">💡 교과서 포인트: </strong>
                    {currentQuestion.pedagogicalTip}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* 3. Game Over Results Card */
        <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 sm:p-10 shadow-sm text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-400 text-white flex items-center justify-center text-4xl shadow-md">
            🏆
          </div>

          <div>
            <span className="text-xs font-black bg-amber-100 text-amber-950 px-3 py-1 rounded-full border border-amber-200 font-jua">
              소리 맞추기 도전 완료!
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-jua">
              훌륭합니다! 화음의 마음을 잘 들으셨어요!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              음악에서 밝은 장화음과 쓸쓸한 단화음을 귀로 구별하는 멋진 귀를 가졌습니다.
            </p>
          </div>

          {/* Results Metric Grid */}
          <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
              <span className="text-xs font-bold text-amber-800">최종 획득 점수</span>
              <p className="text-2xl sm:text-3xl font-black text-amber-950 font-jua mt-1">
                {score}점
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200">
              <span className="text-xs font-bold text-orange-800">최대 연속 콤보</span>
              <p className="text-2xl sm:text-3xl font-black text-orange-950 font-jua mt-1">
                {maxCombo} 연속
              </p>
            </div>
          </div>

          {/* Restart Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={startNewGame}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black font-jua text-sm sm:text-base shadow-md cursor-pointer transition-transform hover:scale-103 inline-flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>새로운 문제로 다시 도전하기</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Interactive Compare Lab */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-black text-sm shadow-xs">
              ⚖️
            </span>
            <div>
              <h4 className="text-base sm:text-lg font-black text-slate-900 font-jua">
                화음 소리 비교 연구소 (같은 으뜸음, 다른 느낌)
              </h4>
              <p className="text-xs text-slate-500">
                같은 시작음에서 3도 음 하나만 살짝 바뀌었을 때 분위기가 어떻게 바뀌는지 직접 귀로 확인해보세요.
              </p>
            </div>
          </div>

          {/* Root key selector */}
          <div className="flex items-center gap-1.5 bg-[#F8F9FA] p-1 rounded-xl border border-slate-200 shrink-0 self-start sm:self-center">
            {(['C', 'A', 'D', 'G'] as const).map(k => (
              <button
                key={k}
                type="button"
                onClick={() => setCompareKey(k)}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer font-jua ${
                  compareKey === k
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {k}음 기준
              </button>
            ))}
          </div>
        </div>

        {/* Side-by-side player */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Major Side */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">☀️</span>
                <span className="text-sm sm:text-base font-black text-amber-950 font-jua">
                  {selectedPair.majorName}
                </span>
              </div>
              <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                장3도 (밝음)
              </span>
            </div>

            <div className="p-2.5 bg-white/90 rounded-xl border border-amber-200/80 text-center">
              <span className="text-xs text-slate-500 font-medium">화음 구성음: </span>
              <strong className="text-sm font-black text-slate-900 font-jua ml-1">
                {selectedPair.majorNoteNames}
              </strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => playChordSound(selectedPair.majorNotes, 'block')}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs font-jua flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>화음 한 번에 쾅!</span>
              </button>
              <button
                type="button"
                onClick={() => playChordSound(selectedPair.majorNotes, 'arpeggio')}
                className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-300 text-amber-950 font-black text-xs font-jua flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
              >
                <Music className="w-3.5 h-3.5" />
                <span>차례대로 듣기</span>
              </button>
            </div>
          </div>

          {/* Minor Side */}
          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌙</span>
                <span className="text-sm sm:text-base font-black text-indigo-950 font-jua">
                  {selectedPair.minorName}
                </span>
              </div>
              <span className="text-[11px] font-bold text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded-md">
                단3도 (쓸쓸함)
              </span>
            </div>

            <div className="p-2.5 bg-white/90 rounded-xl border border-indigo-200/80 text-center">
              <span className="text-xs text-slate-500 font-medium">화음 구성음: </span>
              <strong className="text-sm font-black text-slate-900 font-jua ml-1">
                {selectedPair.minorNoteNames}
              </strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => playChordSound(selectedPair.minorNotes, 'block')}
                className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs font-jua flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>화음 한 번에 쾅!</span>
              </button>
              <button
                type="button"
                onClick={() => playChordSound(selectedPair.minorNotes, 'arpeggio')}
                className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-indigo-100/60 border border-indigo-300 text-indigo-950 font-black text-xs font-jua flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
              >
                <Music className="w-3.5 h-3.5" />
                <span>차례대로 듣기</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 bg-[#F8F9FA] p-3 rounded-xl border border-slate-200 leading-relaxed">
          <strong className="text-indigo-900 font-bold font-jua">💡 선생님의 설명 힌트: </strong>
          {selectedPair.explanation}
        </p>
      </div>
    </div>
  );
};
