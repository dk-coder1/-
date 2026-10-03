import React, { useState, useEffect, useCallback } from 'react';
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
  Star
} from 'lucide-react';

export type TargetScale = 'all' | 'c-major' | 'g-major' | 'd-major';
export type AnswerMode = 'solfege' | 'korean' | 'english';

interface NoteQuestion {
  id: string;
  pitch: string; // e.g. "G4"
  octave: number;
  pitchName: string; // "G" or "F#"
  lineOffset: number; // Vertical position on staff (0 = bottom line E4, 1 = F4, 2 = G4, etc.)
  needsLedgerLineBottom?: boolean; // C4 (lineOffset -2)
  needsLedgerLineTop?: boolean; // A5 (lineOffset 10)
  scaleId: 'c-major' | 'g-major' | 'd-major';
  scaleName: string; // "사장조 (G Major)"
  solfege: string; // 계이름: "도"
  koreanName: string; // 우리말 음이름: "사"
  engName: string; // "G"
  explanation: string;
}

const SOLFEGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  '도': { bg: 'bg-rose-500', text: 'text-white', border: 'border-rose-600' },
  '레': { bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-600' },
  '미': { bg: 'bg-amber-400', text: 'text-amber-950', border: 'border-amber-500' },
  '파': { bg: 'bg-emerald-500', text: 'text-white', border: 'border-emerald-600' },
  '솔': { bg: 'bg-sky-500', text: 'text-white', border: 'border-sky-600' },
  '라': { bg: 'bg-indigo-500', text: 'text-white', border: 'border-indigo-600' },
  '시': { bg: 'bg-purple-500', text: 'text-white', border: 'border-purple-600' },
};

// Staff note database for C, G, D Major
const QUESTIONS_DATABASE: NoteQuestion[] = [
  // --- C Major (다장조) ---
  {
    id: 'c-c4',
    pitch: 'C4',
    octave: 4,
    pitchName: 'C',
    lineOffset: -2, // 아래 첫째 덧줄
    needsLedgerLineBottom: true,
    scaleId: 'c-major',
    scaleName: '다장조 (C Major)',
    solfege: '도',
    koreanName: '다',
    engName: 'C',
    explanation: '다장조의 으뜸음 "도"예요! 오선지 아래 첫째 덧줄에 걸려 있는 가장 친숙한 가온다(C)입니다.'
  },
  {
    id: 'c-d4',
    pitch: 'D4',
    octave: 4,
    pitchName: 'D',
    lineOffset: -1, // 아래 첫째 칸
    scaleId: 'c-major',
    scaleName: '다장조 (C Major)',
    solfege: '레',
    koreanName: '라',
    engName: 'D',
    explanation: '다장조 제2음 "레"예요. 오선지 첫째 줄 바로 아래 대롱대롱 매달려 있는 자리입니다.'
  },
  {
    id: 'c-e4',
    pitch: 'E4',
    octave: 4,
    pitchName: 'E',
    lineOffset: 0, // 제1줄
    scaleId: 'c-major',
    scaleName: '다장조 (C Major)',
    solfege: '미',
    koreanName: '마',
    engName: 'E',
    explanation: '다장조 제3음 "미"예요! 오선지의 맨 아랫줄인 "제1줄"에 걸려 있습니다.'
  },
  {
    id: 'c-f4',
    pitch: 'F4',
    octave: 4,
    pitchName: 'F',
    lineOffset: 1, // 제1칸
    scaleId: 'c-major',
    scaleName: '다장조 (C Major)',
    solfege: '파',
    koreanName: '바',
    engName: 'F',
    explanation: '다장조 제4음 "파"예요. 제1줄과 제2줄 사이의 "제1칸"입니다 (미와 파는 반음!).'
  },
  {
    id: 'c-g4',
    pitch: 'G4',
    octave: 4,
    pitchName: 'G',
    lineOffset: 2, // 제2줄
    scaleId: 'c-major',
    scaleName: '다장조 (C Major)',
    solfege: '솔',
    koreanName: '사',
    engName: 'G',
    explanation: '다장조 제5음 "솔"이에요. 높은음자리표의 꼬리가 감싸고 도는 "제2줄"입니다!'
  },
  {
    id: 'c-a4',
    pitch: 'A4',
    octave: 4,
    pitchName: 'A',
    lineOffset: 3, // 제2칸
    scaleId: 'c-major',
    scaleName: '다장조 (C Major)',
    solfege: '라',
    koreanName: '가',
    engName: 'A',
    explanation: '다장조 제6음 "라"예요. 제2줄과 제3줄 사이의 "제2칸"입니다.'
  },
  {
    id: 'c-b4',
    pitch: 'B4',
    octave: 4,
    pitchName: 'B',
    lineOffset: 4, // 제3줄
    scaleId: 'c-major',
    scaleName: '다장조 (C Major)',
    solfege: '시',
    koreanName: '나',
    engName: 'B',
    explanation: '다장조 제7음 "시"예요. 오선지의 정가운데 줄인 "제3줄"에 걸려 있습니다.'
  },
  {
    id: 'c-c5',
    pitch: 'C5',
    octave: 5,
    pitchName: 'C',
    lineOffset: 5, // 제3칸
    scaleId: 'c-major',
    scaleName: '다장조 (C Major)',
    solfege: '도',
    koreanName: '다',
    engName: 'C',
    explanation: '다장조 높은 "도"예요. 제3줄과 제4줄 사이의 "제3칸"입니다.'
  },

  // --- G Major (사장조 - 조표: F# 1개) ---
  {
    id: 'g-g4',
    pitch: 'G4',
    octave: 4,
    pitchName: 'G',
    lineOffset: 2, // 제2줄
    scaleId: 'g-major',
    scaleName: '사장조 (G Major)',
    solfege: '도',
    koreanName: '사',
    engName: 'G',
    explanation: '사장조의 으뜸음 "도"예요! 둘째 줄(G) 음이 사장조에서는 첫째 대장 "도"가 됩니다.'
  },
  {
    id: 'g-a4',
    pitch: 'A4',
    octave: 4,
    pitchName: 'A',
    lineOffset: 3, // 제2칸
    scaleId: 'g-major',
    scaleName: '사장조 (G Major)',
    solfege: '레',
    koreanName: '가',
    engName: 'A',
    explanation: '사장조의 제2음 "레"예요. 둘째 줄(도) 바로 위의 제2칸(A)입니다.'
  },
  {
    id: 'g-b4',
    pitch: 'B4',
    octave: 4,
    pitchName: 'B',
    lineOffset: 4, // 제3줄
    scaleId: 'g-major',
    scaleName: '사장조 (G Major)',
    solfege: '미',
    koreanName: '나',
    engName: 'B',
    explanation: '사장조의 제3음 "미"예요! 오선지 가운데 셋째 줄(B)이 사장조에서는 "미" 역할을 맡아요.'
  },
  {
    id: 'g-c5',
    pitch: 'C5',
    octave: 5,
    pitchName: 'C',
    lineOffset: 5, // 제3칸
    scaleId: 'g-major',
    scaleName: '사장조 (G Major)',
    solfege: '파',
    koreanName: '다',
    engName: 'C',
    explanation: '사장조의 제4음 "파"예요! 미(B)와 파(C) 사이는 반음 간격이 딱 맞아요.'
  },
  {
    id: 'g-d5',
    pitch: 'D5',
    octave: 5,
    pitchName: 'D',
    lineOffset: 6, // 제4줄
    scaleId: 'g-major',
    scaleName: '사장조 (G Major)',
    solfege: '솔',
    koreanName: '라',
    engName: 'D',
    explanation: '사장조의 제5음 "솔"이에요! 교과서 <네잎클로버> 첫 음 "깊고 작은(솔-도-미-솔)"의 그 솔입니다.'
  },
  {
    id: 'g-e5',
    pitch: 'E5',
    octave: 5,
    pitchName: 'E',
    lineOffset: 7, // 제4칸
    scaleId: 'g-major',
    scaleName: '사장조 (G Major)',
    solfege: '라',
    koreanName: '마',
    engName: 'E',
    explanation: '사장조의 제6음 "라"예요. 제4칸에 위치합니다.'
  },
  {
    id: 'g-fsharp5',
    pitch: 'F#5',
    octave: 5,
    pitchName: 'F#',
    lineOffset: 8, // 제5줄
    scaleId: 'g-major',
    scaleName: '사장조 (G Major)',
    solfege: '시',
    koreanName: '올림바',
    engName: 'F#',
    explanation: '사장조의 제7음 "시"예요! 조표 맨 위에 붙은 #의 영향으로 파#(F#)이 되어 으뜸음(솔)으로 향하는 이끔음(시)이 됩니다.'
  },
  {
    id: 'g-g5',
    pitch: 'G5',
    octave: 5,
    pitchName: 'G',
    lineOffset: 9, // 위 첫째 칸
    scaleId: 'g-major',
    scaleName: '사장조 (G Major)',
    solfege: '도',
    koreanName: '사',
    engName: 'G',
    explanation: '사장조의 높은 으뜸음 "도"예요! 오선지 맨 윗줄(5줄) 바로 위의 위 첫째 칸입니다.'
  },

  // --- D Major (라장조 - 조표: F#, C# 2개) ---
  {
    id: 'd-d4',
    pitch: 'D4',
    octave: 4,
    pitchName: 'D',
    lineOffset: -1, // 아래 첫째 칸
    scaleId: 'd-major',
    scaleName: '라장조 (D Major)',
    solfege: '도',
    koreanName: '라',
    engName: 'D',
    explanation: '라장조의 으뜸음 "도"예요! 라(D) 음을 첫째 대장 "도"로 삼고 행진합니다.'
  },
  {
    id: 'd-e4',
    pitch: 'E4',
    octave: 4,
    pitchName: 'E',
    lineOffset: 0, // 제1줄
    scaleId: 'd-major',
    scaleName: '라장조 (D Major)',
    solfege: '레',
    koreanName: '마',
    engName: 'E',
    explanation: '라장조의 제2음 "레"예요. 오선지 제1줄(E)이 라장조에서는 "레"예요!'
  },
  {
    id: 'd-fsharp4',
    pitch: 'F#4',
    octave: 4,
    pitchName: 'F#',
    lineOffset: 1, // 제1칸
    scaleId: 'd-major',
    scaleName: '라장조 (D Major)',
    solfege: '미',
    koreanName: '올림바',
    engName: 'F#',
    explanation: '라장조의 제3음 "미"예요! 조표에 파#이 붙어있으므로 제1칸(F)은 파#이 되어 예쁜 "미" 소리가 납니다.'
  },
  {
    id: 'd-g4',
    pitch: 'G4',
    octave: 4,
    pitchName: 'G',
    lineOffset: 2, // 제2줄
    scaleId: 'd-major',
    scaleName: '라장조 (D Major)',
    solfege: '파',
    koreanName: '사',
    engName: 'G',
    explanation: '라장조의 제4음 "파"예요! 둘째 줄(G)이 라장조에서는 "파" 역할을 맡습니다.'
  },
  {
    id: 'd-a4',
    pitch: 'A4',
    octave: 4,
    pitchName: 'A',
    lineOffset: 3, // 제2칸
    scaleId: 'd-major',
    scaleName: '라장조 (D Major)',
    solfege: '솔',
    koreanName: '가',
    engName: 'A',
    explanation: '라장조의 제5음 "솔"이에요! 제2칸(A)이 든든한 딸림음 "솔"입니다.'
  },
  {
    id: 'd-b4',
    pitch: 'B4',
    octave: 4,
    pitchName: 'B',
    lineOffset: 4, // 제3줄
    scaleId: 'd-major',
    scaleName: '라장조 (D Major)',
    solfege: '라',
    koreanName: '나',
    engName: 'B',
    explanation: '라장조의 제6음 "라"예요! 오선지 가운데 셋째 줄(B)이 라장조에서는 "라"예요.'
  },
  {
    id: 'd-csharp5',
    pitch: 'C#5',
    octave: 5,
    pitchName: 'C#',
    lineOffset: 5, // 제3칸
    scaleId: 'd-major',
    scaleName: '라장조 (D Major)',
    solfege: '시',
    koreanName: '올림다',
    engName: 'C#',
    explanation: '라장조의 제7음 "시"예요! 조표의 두 번째 샵인 도#(C#)이 적용되어 으뜸음 레로 이끄는 "시"가 돼요.'
  },
  {
    id: 'd-d5',
    pitch: 'D5',
    octave: 5,
    pitchName: 'D',
    lineOffset: 6, // 제4줄
    scaleId: 'd-major',
    scaleName: '라장조 (D Major)',
    solfege: '도',
    koreanName: '라',
    engName: 'D',
    explanation: '라장조의 높은 으뜸음 "도"예요! 제4줄에 위치합니다.'
  }
];

export const StaffNoteGame: React.FC = () => {
  const [selectedScale, setSelectedScale] = useState<TargetScale>('all');
  const [answerMode, setAnswerMode] = useState<AnswerMode>('solfege');

  const [currentQuestion, setCurrentQuestion] = useState<NoteQuestion>(QUESTIONS_DATABASE[0]);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [roundCount, setRoundCount] = useState<number>(1);
  const [totalRounds, setTotalRounds] = useState<number>(10);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [lastFeedback, setLastFeedback] = useState<{ isCorrect: boolean; selected: string } | null>(null);

  const getFilteredPool = useCallback(() => {
    if (selectedScale === 'all') return QUESTIONS_DATABASE;
    return QUESTIONS_DATABASE.filter(q => q.scaleId === selectedScale);
  }, [selectedScale]);

  const pickNewQuestion = useCallback((excludeId?: string) => {
    const pool = getFilteredPool();
    const available = pool.filter(q => q.id !== excludeId);
    const chosen = available[Math.floor(Math.random() * available.length)] || pool[0];
    setCurrentQuestion(chosen);
    setLastFeedback(null);

    setTimeout(() => {
      soundEngine.playNote(chosen.pitch, 0.8, 0, 0.35);
    }, 150);
  }, [getFilteredPool]);

  const handleRestart = useCallback(() => {
    setScore(0);
    setStreak(0);
    setRoundCount(1);
    setIsGameOver(false);
    setLastFeedback(null);
    pickNewQuestion();
  }, [pickNewQuestion]);

  useEffect(() => {
    handleRestart();
  }, [selectedScale, handleRestart]);

  const handleReplayNote = () => {
    soundEngine.playNote(currentQuestion.pitch, 0.9, 0, 0.35);
  };

  const getChoices = (): string[] => {
    if (answerMode === 'solfege') {
      return ['도', '레', '미', '파', '솔', '라', '시'];
    } else if (answerMode === 'korean') {
      return ['다', '라', '마', '바', '사', '가', '나', '올림바', '올림다'];
    } else {
      return ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'F#', 'C#'];
    }
  };

  const getCorrectAnswer = (q: NoteQuestion): string => {
    if (answerMode === 'solfege') return q.solfege;
    if (answerMode === 'korean') return q.koreanName;
    return q.engName;
  };

  const handleAnswer = (choice: string) => {
    if (lastFeedback) return;

    const correct = getCorrectAnswer(currentQuestion);
    const isCorrect = choice === correct;

    if (isCorrect) {
      const bonus = streak >= 2 ? streak * 5 : 0;
      setScore(s => s + 10 + bonus);
      setStreak(st => st + 1);
      soundEngine.playNote('C5', 0.15, 0, 0.3);
      soundEngine.playNote('G5', 0.3, 0.1, 0.3);
    } else {
      setStreak(0);
      soundEngine.playNote('F3', 0.3, 0, 0.25);
    }

    setLastFeedback({ isCorrect, selected: choice });

    setTimeout(() => {
      if (roundCount >= totalRounds) {
        setIsGameOver(true);
      } else {
        setRoundCount(r => r + 1);
        pickNewQuestion(currentQuestion.id);
      }
    }, 1800);
  };

  const staffLine1Y = 130;
  const stepY = 7;
  const noteY = staffLine1Y - currentQuestion.lineOffset * stepY;
  const noteX = 260;

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-6">
      {/* 1. Game Header & Controls (미래엔 교과서 상단 바 스타일) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-sm shadow-xs">
              <Trophy className="w-4 h-4" />
            </span>
            <h3 className="font-black text-lg sm:text-xl text-slate-900 font-jua">
              오선지 음표 맞추기 게임
            </h3>
            <span className="text-xs bg-amber-100 text-amber-950 font-black px-2.5 py-0.5 rounded-full border border-amber-300">
              다장조(C) · 사장조(G) · 라장조(D)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            오선지에 그려진 음표를 보고 올바른 계이름이나 음이름을 맞혀 점수를 쑥쑥 올려보세요!
          </p>
        </div>

        {/* Score & Streak Stats (도톰한 교실 스티커 스타일) */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-amber-50 border-2 border-amber-300 px-3.5 py-1.5 rounded-2xl shadow-2xs">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="text-xs text-amber-900 font-bold">점수:</span>
            <span className="text-base font-black text-amber-950 tabular-nums font-jua">{score}점</span>
          </div>

          <div className="flex items-center gap-1.5 bg-rose-50 border-2 border-rose-300 px-3.5 py-1.5 rounded-2xl shadow-2xs">
            <Flame className="w-4 h-4 text-rose-500 fill-rose-400" />
            <span className="text-xs text-rose-900 font-bold">연속:</span>
            <span className="text-base font-black text-rose-950 tabular-nums font-jua">{streak}회</span>
          </div>

          <button
            type="button"
            onClick={handleRestart}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200"
            title="게임 다시 시작"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Target Scale & Answer Mode Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-[#F8F9FA] p-3.5 rounded-2xl border border-slate-200">
        {/* Scale Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-700 font-extrabold">도전할 조(Key):</span>
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setSelectedScale('all')}
              className={`px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer ${
                selectedScale === 'all' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              모든 조 (C, G, D 믹스)
            </button>
            <button
              type="button"
              onClick={() => setSelectedScale('c-major')}
              className={`px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer ${
                selectedScale === 'c-major' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ☀️ 다장조 (C)
            </button>
            <button
              type="button"
              onClick={() => setSelectedScale('g-major')}
              className={`px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer ${
                selectedScale === 'g-major' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🍀 사장조 (G)
            </button>
            <button
              type="button"
              onClick={() => setSelectedScale('d-major')}
              className={`px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer ${
                selectedScale === 'd-major' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🎺 라장조 (D)
            </button>
          </div>
        </div>

        {/* Answer Mode Switch */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-700 font-extrabold">정답 모드:</span>
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setAnswerMode('solfege')}
              className={`px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer ${
                answerMode === 'solfege' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              계이름 (도레미)
            </button>
            <button
              type="button"
              onClick={() => setAnswerMode('korean')}
              className={`px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer ${
                answerMode === 'korean' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              우리말 음이름
            </button>
            <button
              type="button"
              onClick={() => setAnswerMode('english')}
              className={`px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer ${
                answerMode === 'english' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              영문 (CDE)
            </button>
          </div>
        </div>
      </div>

      {!isGameOver ? (
        <div className="space-y-6">
          {/* Question Meta Info */}
          <div className="flex items-center justify-between text-xs px-1">
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-800 text-sm font-jua">
                문제 {roundCount} / {totalRounds}
              </span>
              <span className="px-3 py-0.5 rounded-full bg-amber-100 text-amber-950 font-black border border-amber-300">
                악보의 조: {currentQuestion.scaleName}
              </span>
            </div>

            <button
              type="button"
              onClick={handleReplayNote}
              className="flex items-center gap-1.5 text-xs text-amber-900 bg-amber-50 hover:bg-amber-100 px-3.5 py-1.5 rounded-xl border border-amber-300 font-extrabold transition-colors cursor-pointer shadow-2xs"
            >
              <Volume2 className="w-4 h-4 text-amber-600" />
              <span>소리 다시듣기</span>
            </button>
          </div>

          {/* 3. SVG Musical Staff Canvas (미래엔 교과서 악보 인쇄 스타일 - 깨끗한 백색과 선명한 라인) */}
          <div className="relative bg-white rounded-3xl border-2 border-slate-300 p-6 shadow-sm flex flex-col items-center justify-center min-h-[220px]">
            <svg
              viewBox="0 0 460 170"
              className="w-full max-w-[500px] h-44 select-none"
            >
              {/* 5 Staff Lines (또렷하고 단정한 교과서 블랙 라인) */}
              {[74, 88, 102, 116, 130].map((y, idx) => (
                <line
                  key={idx}
                  x1="25"
                  y1={y}
                  x2="435"
                  y2={y}
                  stroke="#1E293B"
                  strokeWidth="2"
                />
              ))}

              {/* Bar Lines at start and end */}
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

              {/* Key Signatures (조표) */}
              {currentQuestion.scaleId === 'g-major' && (
                <text
                  x="90"
                  y="81"
                  fontFamily="sans-serif"
                  fontWeight="900"
                  fontSize="26"
                  fill="#0F172A"
                >
                  ♯
                </text>
              )}

              {currentQuestion.scaleId === 'd-major' && (
                <g>
                  <text
                    x="85"
                    y="81"
                    fontFamily="sans-serif"
                    fontWeight="900"
                    fontSize="26"
                    fill="#0F172A"
                  >
                    ♯
                  </text>
                  <text
                    x="100"
                    y="102"
                    fontFamily="sans-serif"
                    fontWeight="900"
                    fontSize="26"
                    fill="#0F172A"
                  >
                    ♯
                  </text>
                </g>
              )}

              {/* Bottom Ledger Line for C4 (lineOffset -2, y=144) */}
              {currentQuestion.needsLedgerLineBottom && (
                <line
                  x1={noteX - 18}
                  y1={144}
                  x2={noteX + 18}
                  y2={144}
                  stroke="#1E293B"
                  strokeWidth="2.5"
                />
              )}

              {/* Top Ledger Line for A5 (lineOffset 10, y=60) */}
              {currentQuestion.needsLedgerLineTop && (
                <line
                  x1={noteX - 18}
                  y1={60}
                  x2={noteX + 18}
                  y2={60}
                  stroke="#1E293B"
                  strokeWidth="2.5"
                />
              )}

              {/* Target Musical Note (선명한 교과서 음표) */}
              <g className="transition-all duration-200">
                <ellipse
                  cx={noteX}
                  cy={noteY}
                  rx="10"
                  ry="7.5"
                  transform={`rotate(-25 ${noteX} ${noteY})`}
                  fill={lastFeedback ? (lastFeedback.isCorrect ? '#16A34A' : '#DC2626') : '#D97706'}
                  stroke="#78350F"
                  strokeWidth="2"
                />

                {/* Note Stem (기둥) */}
                <line
                  x1={currentQuestion.lineOffset >= 4 ? noteX - 9 : noteX + 9}
                  y1={noteY}
                  x2={currentQuestion.lineOffset >= 4 ? noteX - 9 : noteX + 9}
                  y2={currentQuestion.lineOffset >= 4 ? noteY + 38 : noteY - 38}
                  stroke={lastFeedback ? (lastFeedback.isCorrect ? '#16A34A' : '#DC2626') : '#78350F'}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>

              {/* Helper Line Tooltip Guides (교과서 가이드) */}
              <text x="375" y="78" fontSize="11" fontWeight="bold" fill="#64748B" fontFamily="sans-serif">5줄(파)</text>
              <text x="375" y="106" fontSize="11" fontWeight="bold" fill="#64748B" fontFamily="sans-serif">3줄(시)</text>
              <text x="375" y="134" fontSize="11" fontWeight="bold" fill="#64748B" fontFamily="sans-serif">1줄(미)</text>
            </svg>

            {/* In-staff Question Prompt */}
            <div className="text-center mt-3">
              <span className="text-base sm:text-lg font-black text-slate-900 font-jua">
                위 음표의 {answerMode === 'solfege' ? '계이름(도레미...)' : answerMode === 'korean' ? '우리말 음이름' : '영문 음이름'}은 무엇일까요?
              </span>
            </div>
          </div>

          {/* 4. Instant Feedback Banner (교과서 정답 확인 박스) */}
          {lastFeedback && (
            <div
              className={`p-4 rounded-2xl border-2 flex items-start gap-3 transition-all ${
                lastFeedback.isCorrect
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                  : 'bg-rose-50 border-rose-400 text-rose-950'
              }`}
            >
              {lastFeedback.isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-black text-base font-jua">
                    {lastFeedback.isCorrect ? '정답입니다! (+10점)' : '아쉬워요! 다시 기억해봐요.'}
                  </span>
                  <span className="text-xs bg-white px-2.5 py-0.5 rounded-md border font-black">
                    정답: {getCorrectAnswer(currentQuestion)}
                  </span>
                </div>
                <p className="leading-relaxed font-semibold">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          )}

          {/* 5. Multiple Choice Answer Buttons (도톰하고 터치하기 시원시원한 버튼) */}
          <div className="space-y-2.5">
            <span className="text-xs font-black text-slate-700 px-1 font-jua text-sm">
              정답을 콕! 눌러보세요:
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-2.5">
              {getChoices().map((choice) => {
                const isSelected = lastFeedback?.selected === choice;
                const isCorrect = choice === getCorrectAnswer(currentQuestion);
                const solColor = answerMode === 'solfege' ? SOLFEGE_COLORS[choice] : null;

                let btnStyle = 'bg-white border-2 border-slate-300 hover:border-amber-400 hover:bg-amber-50/50 text-slate-900 shadow-2xs';
                if (lastFeedback) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-600 text-white border-2 border-emerald-700 shadow-md scale-105';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-600 text-white border-2 border-rose-700';
                  } else {
                    btnStyle = 'bg-slate-100 text-slate-400 border-2 border-slate-200 opacity-60';
                  }
                }

                return (
                  <button
                    key={choice}
                    type="button"
                    disabled={!!lastFeedback}
                    onClick={() => handleAnswer(choice)}
                    className={`h-14 sm:h-16 rounded-2xl flex flex-col items-center justify-center font-black text-lg sm:text-xl transition-all cursor-pointer active:scale-95 disabled:cursor-not-allowed font-jua ${btnStyle}`}
                  >
                    <span className="leading-none">{choice}</span>
                    {solColor && !lastFeedback && (
                      <span className={`w-2.5 h-2.5 rounded-full ${solColor.bg} mt-1`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* 6. Game Over / Victory Summary Card (교실 칭찬 상장 스타일) */
        <div className="bg-gradient-to-br from-amber-50 via-white to-amber-100/70 rounded-3xl border-2 border-amber-300 p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
            <Award className="w-9 h-9" />
          </div>

          <div>
            <h4 className="text-2xl font-black text-slate-900 font-jua">
              10문제 도전 완료! 참 잘했어요!
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              다장조, 사장조, 라장조 오선지 음표 읽기 실력이 쑥쑥 늘었어요!
            </p>
          </div>

          <div className="inline-flex items-center gap-6 bg-white px-8 py-4 rounded-3xl border-2 border-amber-200 shadow-xs text-sm">
            <div>
              <span className="text-xs text-slate-500 font-bold block">최종 점수</span>
              <span className="text-3xl font-black text-amber-600 tabular-nums font-jua">{score}점</span>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div>
              <span className="text-xs text-slate-500 font-bold block">최대 연속 정답</span>
              <span className="text-3xl font-black text-rose-600 tabular-nums font-jua">{streak}회</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-sm transition-all active:scale-95 cursor-pointer font-jua"
            >
              <RotateCcw className="w-4 h-4" />
              <span>한 번 더 도전하기</span>
            </button>
          </div>
        </div>
      )}

      {/* 7. Elementary Textbook Staff Reading Cheat Sheet (교과서 요약 정리 코너) */}
      <div className="bg-[#FFF9EE] border-2 border-amber-200 rounded-3xl p-5 text-xs text-slate-700 space-y-2.5">
        <div className="flex items-center gap-1.5 font-black text-amber-950 text-sm font-jua">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>초등 교과서 오선지 줄과 칸 쉽게 외우는 꿀팁:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 leading-relaxed text-xs">
          <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-2xs">
            <strong className="text-slate-900 font-black block mb-1 font-jua text-sm">☀️ 다장조 (조표 없음):</strong>
            • 아래 첫째 덧줄 = <strong>도(C)</strong><br />
            • 제1줄 = <strong>미(E)</strong>, 제2줄 = <strong>솔(G)</strong><br />
            • 제3줄 = <strong>시(B)</strong>, 제3칸 = <strong>도(C)</strong>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-2xs">
            <strong className="text-amber-800 font-black block mb-1 font-jua text-sm">🍀 사장조 (# 1개: 파#):</strong>
            • 제2줄(G)이 으뜸음 = <strong>도(G)</strong>!<br />
            • 제4줄(D) = <strong>솔(D)</strong> (&lt;네잎클로버&gt; 첫음)<br />
            • 제5줄(F#) = 이끔음 <strong>시(F#)</strong>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-2xs">
            <strong className="text-indigo-800 font-black block mb-1 font-jua text-sm">🎺 라장조 (# 2개: 파#, 도#):</strong>
            • 아래 첫째 칸(D)이 으뜸음 = <strong>도(D)</strong>!<br />
            • 제2칸(A) = <strong>솔(A)</strong><br />
            • 제4줄(D) = 높은 <strong>도(D)</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
