import React, { useState, useEffect, useCallback } from 'react';
import { soundEngine } from '../utils/audioEngine';
import { MUSICAL_KEYS, MusicalKey } from '../data/musicTheoryData';
import {
  Crown,
  Trophy,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lightbulb,
  Sparkles,
  Award,
  Flame,
  Volume2
} from 'lucide-react';

interface TonicQuestion {
  id: string;
  keyId: string;
  name: string; // "사장조 (G Major)"
  shortName: string;
  mode: 'major' | 'minor';
  tonicPitchName: string; // "G"
  tonicKorean: string; // "사"
  tonicSolfege: string; // "도" (장조) or "라" (단조)
  sharps: string[]; // ["F#"]
  flats: string[]; // []
  hint: string;
  explanation: string;
}

const TONIC_QUESTIONS: TonicQuestion[] = [
  {
    id: 'c-major',
    keyId: 'c-major',
    name: '다장조 (C Major)',
    shortName: '다장조',
    mode: 'major',
    tonicPitchName: 'C',
    tonicKorean: '다',
    tonicSolfege: '도',
    sharps: [],
    flats: [],
    hint: '조표가 아무것도 붙지 않아요! 흰건반 다(C)가 그대로 으뜸음 "도"예요.',
    explanation: '정답! 조표가 없는 다장조의 으뜸음은 바로 흰건반 "다(C)" 음입니다!'
  },
  {
    id: 'g-major',
    keyId: 'g-major',
    name: '사장조 (G Major)',
    shortName: '사장조',
    mode: 'major',
    tonicPitchName: 'G',
    tonicKorean: '사',
    tonicSolfege: '도',
    sharps: ['F#'],
    flats: [],
    hint: '올림표(#)가 1개(파#) 붙었어요! #의 바로 윗음이 으뜸음 "도"가 돼요.',
    explanation: '정답! 파#의 바로 윗음인 "사(G)" 음이 사장조의 으뜸음 "도"입니다! (교과서 <네잎클로버>)'
  },
  {
    id: 'f-major',
    keyId: 'f-major',
    name: '바장조 (F Major)',
    shortName: '바장조',
    mode: 'major',
    tonicPitchName: 'F',
    tonicKorean: '바',
    tonicSolfege: '도',
    sharps: [],
    flats: ['Bb'],
    hint: '내림표(b)가 1개(시b) 붙었어요! 시b에서 4도 아래(또는 b 붙은 음 바로 앞)인 "바(F)"가 으뜸음 "도"예요.',
    explanation: '정답! 플랫 1개가 붙은 바장조의 으뜸음은 "바(F)" 음입니다!'
  },
  {
    id: 'd-major',
    keyId: 'd-major',
    name: '라장조 (D Major)',
    shortName: '라장조',
    mode: 'major',
    tonicPitchName: 'D',
    tonicKorean: '라',
    tonicSolfege: '도',
    sharps: ['F#', 'C#'],
    flats: [],
    hint: '올림표(#)가 2개(파#, 도#) 붙었어요! 마지막 #인 도#의 바로 윗음이 "도"예요.',
    explanation: '정답! 마지막 샵인 도# 바로 윗음 "라(D)" 음이 라장조의 으뜸음입니다!'
  },
  {
    id: 'bb-major',
    keyId: 'bb-major',
    name: '내림나장조 (Bb Major)',
    shortName: '내림나장조',
    mode: 'major',
    tonicPitchName: 'Bb',
    tonicKorean: '내림나',
    tonicSolfege: '도',
    sharps: [],
    flats: ['Bb', 'Eb'],
    hint: '내림표(b)가 2개(시b, 미b) 붙었어요! 끝에서 두 번째 플랫인 "내림나(Bb 흑건)"가 으뜸음 "도"예요.',
    explanation: '정답! 끝에서 두 번째 플랫 자리인 검은건반 "내림나(Bb)"가 으뜸음입니다!'
  },
  {
    id: 'a-minor',
    keyId: 'a-minor',
    name: '가단조 (A minor)',
    shortName: '가단조',
    mode: 'minor',
    tonicPitchName: 'A',
    tonicKorean: '가',
    tonicSolfege: '라',
    sharps: [],
    flats: [],
    hint: '다장조의 나란한 조예요! 조표가 없고 "가(A)" 음이 단조의 으뜸음 "라"가 돼요.',
    explanation: '정답! 조표가 없는 단조인 가단조의 으뜸음은 "가(A)" 음입니다!'
  },
  {
    id: 'd-minor',
    keyId: 'd-minor',
    name: '라단조 (D minor)',
    shortName: '라단조',
    mode: 'minor',
    tonicPitchName: 'D',
    tonicKorean: '라',
    tonicSolfege: '라',
    sharps: [],
    flats: ['Bb'],
    hint: '바장조의 나란한 조로 플랫(b)이 1개 붙어요! "라(D)" 음이 으뜸음 "라"가 돼요.',
    explanation: '정답! 교과서 <별 보며 달 보며>에 나오는 라단조의 으뜸음은 바로 "라(D)" 음입니다!'
  },
  {
    id: 'e-minor',
    keyId: 'e-minor',
    name: '마단조 (E minor)',
    shortName: '마단조',
    mode: 'minor',
    tonicPitchName: 'E',
    tonicKorean: '마',
    tonicSolfege: '라',
    sharps: ['F#'],
    flats: [],
    hint: '사장조의 나란한 조로 샵(#)이 1개 붙어요! "마(E)" 음이 으뜸음 "라"가 돼요.',
    explanation: '정답! 사장조와 나란한 조인 마단조의 으뜸음은 "마(E)" 음입니다!'
  }
];

// Interactive keyboard definition (C4 to B4 + high C5)
interface KeyButton {
  pitch: string; // e.g. "C4"
  basePitchName: string; // "C" or "C#" or "Bb"
  isBlack: boolean;
  koreanName: string;
}

const GAME_KEYS: KeyButton[] = [
  { pitch: 'C4', basePitchName: 'C', isBlack: false, koreanName: '다' },
  { pitch: 'C#4', basePitchName: 'C#', isBlack: true, koreanName: '올림다' },
  { pitch: 'D4', basePitchName: 'D', isBlack: false, koreanName: '라' },
  { pitch: 'D#4', basePitchName: 'D#', isBlack: true, koreanName: '올림라' },
  { pitch: 'E4', basePitchName: 'E', isBlack: false, koreanName: '마' },
  { pitch: 'F4', basePitchName: 'F', isBlack: false, koreanName: '바' },
  { pitch: 'F#4', basePitchName: 'F#', isBlack: true, koreanName: '올림바' },
  { pitch: 'G4', basePitchName: 'G', isBlack: false, koreanName: '사' },
  { pitch: 'G#4', basePitchName: 'G#', isBlack: true, koreanName: '올림사' },
  { pitch: 'A4', basePitchName: 'A', isBlack: false, koreanName: '가' },
  { pitch: 'A#4', basePitchName: 'Bb', isBlack: true, koreanName: '내림나' },
  { pitch: 'B4', basePitchName: 'B', isBlack: false, koreanName: '나' },
  { pitch: 'C5', basePitchName: 'C', isBlack: false, koreanName: '다' },
];

export const TonicFinderGame: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<TonicQuestion>(TONIC_QUESTIONS[1]); // 사장조 default
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [roundCount, setRoundCount] = useState<number>(1);
  const [totalRounds, setTotalRounds] = useState<number>(10);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [lastFeedback, setLastFeedback] = useState<{ isCorrect: boolean; pressedKey: KeyButton } | null>(null);

  // Pick a random question
  const pickNewQuestion = useCallback((excludeId?: string) => {
    const available = TONIC_QUESTIONS.filter(q => q.id !== excludeId);
    const chosen = available[Math.floor(Math.random() * available.length)] || TONIC_QUESTIONS[0];
    setCurrentQuestion(chosen);
    setLastFeedback(null);
    setShowHint(false);
  }, []);

  const handleRestart = useCallback(() => {
    setScore(0);
    setStreak(0);
    setRoundCount(1);
    setIsGameOver(false);
    setLastFeedback(null);
    setShowHint(false);
    pickNewQuestion();
  }, [pickNewQuestion]);

  useEffect(() => {
    pickNewQuestion();
  }, [pickNewQuestion]);

  // Handle student clicking on a key
  const handleKeyClick = (keyBtn: KeyButton) => {
    if (lastFeedback) return;

    soundEngine.playNote(keyBtn.pitch, 0.9, 0, 0.35);

    // Normalize comparison: target pitch name vs clicked pitch name
    const targetPitch = currentQuestion.tonicPitchName;
    const isCorrect = keyBtn.basePitchName === targetPitch ||
      (targetPitch === 'Bb' && keyBtn.basePitchName === 'Bb') ||
      (targetPitch === 'A#' && keyBtn.basePitchName === 'Bb');

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

    setLastFeedback({ isCorrect, pressedKey: keyBtn });

    setTimeout(() => {
      if (roundCount >= totalRounds) {
        setIsGameOver(true);
      } else {
        setRoundCount(r => r + 1);
        pickNewQuestion(currentQuestion.id);
      }
    }, 2000);
  };

  const whiteKeys = GAME_KEYS.filter(k => !k.isBlack);

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-6">
      {/* 1. Header & Scoreboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-sm shadow-xs">
              <Crown className="w-4 h-4" />
            </span>
            <h3 className="font-black text-lg sm:text-xl text-slate-900 font-jua">
              조표 보고 으뜸음 건반 찾기 게임 (Find the Tonic)
            </h3>
            <span className="text-xs bg-amber-100 text-amber-950 font-black px-2.5 py-0.5 rounded-full border border-amber-300">
              초등 3~6 음악 교과서 8대 조
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            악보에 붙은 조표를 보고, 이 조의 주인공인 <strong>으뜸음 건반을 직접 눌러보세요!</strong>
          </p>
        </div>

        {/* Score & Streak Stats */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-amber-50 border-2 border-amber-300 px-3.5 py-1.5 rounded-2xl shadow-2xs">
            <Trophy className="w-4 h-4 text-amber-600" />
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

      {!isGameOver ? (
        <div className="space-y-6">
          {/* Question Title & Meta Info */}
          <div className="flex items-center justify-between text-xs px-1">
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-800 text-sm font-jua">
                문제 {roundCount} / {totalRounds}
              </span>
              <span className="px-3 py-0.5 rounded-full bg-amber-100 text-amber-950 font-black border border-amber-300">
                도전 조(Key): {currentQuestion.name}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowHint(prev => !prev)}
              className="flex items-center gap-1.5 text-xs text-amber-900 bg-amber-50 hover:bg-amber-100 px-3.5 py-1.5 rounded-xl border border-amber-300 font-extrabold transition-colors cursor-pointer shadow-2xs"
            >
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>{showHint ? '힌트 닫기' : '힌트 보기 💡'}</span>
            </button>
          </div>

          {/* 2. Key Signature Staff Canvas (선명한 악보 조표 표시) */}
          <div className="relative bg-white rounded-3xl border-2 border-slate-300 p-5 shadow-sm flex flex-col items-center justify-center min-h-[170px]">
            <svg
              viewBox="0 0 460 140"
              className="w-full max-w-[480px] h-36 select-none"
            >
              {/* 5 Staff Lines */}
              {[45, 59, 73, 87, 101].map((y, idx) => (
                <line
                  key={idx}
                  x1="30"
                  y1={y}
                  x2="430"
                  y2={y}
                  stroke="#1E293B"
                  strokeWidth="2"
                />
              ))}

              {/* Bar Line */}
              <line x1="30" y1="45" x2="30" y2="101" stroke="#1E293B" strokeWidth="3" />
              <line x1="430" y1="45" x2="430" y2="101" stroke="#1E293B" strokeWidth="3" />

              {/* Treble Clef */}
              <text
                x="40"
                y="97"
                fontFamily="serif"
                fontSize="64"
                fill="#0F172A"
                className="select-none"
              >
                𝄞
              </text>

              {/* Key Signatures Display */}
              {/* Sharps */}
              {currentQuestion.sharps.includes('F#') && (
                <text x="95" y="52" fontFamily="sans-serif" fontWeight="900" fontSize="24" fill="#0F172A">
                  ♯
                </text>
              )}
              {currentQuestion.sharps.includes('C#') && (
                <text x="110" y="73" fontFamily="sans-serif" fontWeight="900" fontSize="24" fill="#0F172A">
                  ♯
                </text>
              )}

              {/* Flats */}
              {currentQuestion.flats.includes('Bb') && (
                <text x="95" y="77" fontFamily="sans-serif" fontWeight="900" fontSize="24" fill="#0F172A">
                  ♭
                </text>
              )}
              {currentQuestion.flats.includes('Eb') && (
                <text x="110" y="56" fontFamily="sans-serif" fontWeight="900" fontSize="24" fill="#0F172A">
                  ♭
                </text>
              )}

              {/* Question Text in Staff */}
              <text
                x="260"
                y="76"
                textAnchor="middle"
                fontSize="15"
                fontWeight="900"
                fontFamily="'Jua', sans-serif"
                fill="#334155"
              >
                {currentQuestion.shortName}의 으뜸음({currentQuestion.tonicSolfege})은 어디일까요?
              </text>
            </svg>

            {/* Prompt */}
            <div className="text-center mt-2">
              <span className="text-base sm:text-lg font-black text-amber-950 font-jua">
                👉 아래 피아노 건반에서 <strong>{currentQuestion.shortName}의 으뜸음 "{currentQuestion.tonicSolfege}"</strong> 건반을 콕 눌러보세요!
              </span>
            </div>
          </div>

          {/* Hint Callout */}
          {showHint && (
            <div className="p-3.5 bg-amber-50 border-2 border-amber-300 rounded-2xl text-xs sm:text-sm text-amber-950 flex items-start gap-2.5 font-medium animate-fade-in">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-black text-amber-900 font-jua block mb-0.5">💡 으뜸음 찾는 힌트:</strong>
                {currentQuestion.hint}
              </div>
            </div>
          )}

          {/* 3. Feedback Banner */}
          {lastFeedback && (
            <div
              className={`p-4 rounded-2xl border-2 flex items-start gap-3 transition-all animate-fade-in ${
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
                    {lastFeedback.isCorrect ? '정답입니다! 으뜸음을 완벽하게 찾았어요! (+10점)' : '아쉬워요! 누른 음은 다른 음이에요.'}
                  </span>
                  <span className="text-xs bg-white px-2.5 py-0.5 rounded-md border font-black">
                    정답: {currentQuestion.tonicKorean}({currentQuestion.tonicPitchName})
                  </span>
                </div>
                <p className="leading-relaxed font-semibold">
                  {lastFeedback.isCorrect ? currentQuestion.explanation : `${lastFeedback.pressedKey.koreanName}(${lastFeedback.pressedKey.basePitchName}) 건반을 눌렀어요. 힌트: ${currentQuestion.hint}`}
                </p>
              </div>
            </div>
          )}

          {/* 4. Interactive Virtual Piano for Selecting the Tonic (초등 교구 스타일) */}
          <div className="bg-[#F4EFE6] border-2 border-[#E2D8C3] p-4 pt-4 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-600 font-extrabold mb-2.5 px-1">
              <span>피아노 건반에서 으뜸음이라고 생각되는 건반을 직접 클릭/터치하세요:</span>
              <span className="text-amber-800 font-bold">흰건반과 검은건반 모두 누를 수 있어요!</span>
            </div>

            {/* Red Felt */}
            <div className="h-2 w-full bg-rose-500/80 rounded-t-md mb-1.5 shadow-2xs" />

            {/* Piano bed */}
            <div className="relative flex h-48 sm:h-52 bg-[#EAE2D2] rounded-2xl p-1.5 border border-[#D5C9B3] shadow-inner select-none overflow-x-auto">
              {whiteKeys.map((wKey, index) => {
                const isSelected = lastFeedback?.pressedKey.pitch === wKey.pitch;
                const isTarget = wKey.basePitchName === currentQuestion.tonicPitchName;

                let keyColor = 'bg-white hover:bg-amber-50/50 shadow-[0_4px_0_#CBD5E1]';
                if (lastFeedback) {
                  if (isSelected && lastFeedback.isCorrect) {
                    keyColor = 'bg-emerald-100 ring-4 ring-emerald-400 shadow-[0_4px_0_#10B981]';
                  } else if (isSelected && !lastFeedback.isCorrect) {
                    keyColor = 'bg-rose-100 ring-4 ring-rose-400 shadow-[0_4px_0_#EF4444]';
                  } else if (isTarget) {
                    keyColor = 'bg-amber-100 ring-4 ring-amber-400 shadow-[0_4px_0_#F59E0B]';
                  }
                }

                return (
                  <button
                    key={wKey.pitch}
                    type="button"
                    disabled={!!lastFeedback}
                    onClick={() => handleKeyClick(wKey)}
                    className={`relative flex-1 h-full rounded-b-xl border border-slate-200/90 transition-all flex flex-col justify-end items-center pb-3 cursor-pointer active:translate-y-1 active:shadow-none disabled:cursor-not-allowed ${keyColor}`}
                    style={{
                      marginRight: index === whiteKeys.length - 1 ? 0 : '3px',
                    }}
                  >
                    {/* Crown badge when correct */}
                    {lastFeedback && isTarget && (
                      <div className="absolute top-3 flex flex-col items-center animate-bounce">
                        <Crown className="w-5 h-5 text-amber-500 fill-amber-400" />
                        <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-1 rounded border border-amber-300">으뜸음</span>
                      </div>
                    )}

                    <span className="text-base sm:text-lg font-black text-slate-900 font-jua">
                      {wKey.koreanName}
                    </span>
                    <span className="text-[11px] text-slate-500 font-bold mt-0.5">
                      {wKey.basePitchName}
                    </span>
                  </button>
                );
              })}

              {/* Black Keys */}
              {GAME_KEYS.map((keyDef) => {
                if (!keyDef.isBlack) return null;

                const prevWhiteIndex = whiteKeys.findIndex(w => {
                  if (keyDef.basePitchName === 'C#') return w.basePitchName === 'C';
                  if (keyDef.basePitchName === 'D#') return w.basePitchName === 'D';
                  if (keyDef.basePitchName === 'F#') return w.basePitchName === 'F';
                  if (keyDef.basePitchName === 'G#') return w.basePitchName === 'G';
                  if (keyDef.basePitchName === 'Bb') return w.basePitchName === 'A';
                  return false;
                });

                if (prevWhiteIndex === -1) return null;

                const totalWhite = whiteKeys.length;
                const leftPercent = ((prevWhiteIndex + 0.68) / totalWhite) * 100;
                const keyWidthPercent = (0.65 / totalWhite) * 100;

                const isSelected = lastFeedback?.pressedKey.pitch === keyDef.pitch;
                const isTarget = keyDef.basePitchName === currentQuestion.tonicPitchName;

                let bColor = 'bg-[#2A303A] hover:bg-[#3A4250] shadow-[0_4px_0_#15191F]';
                if (lastFeedback) {
                  if (isSelected && lastFeedback.isCorrect) {
                    bColor = 'bg-emerald-600 ring-3 ring-emerald-300 shadow-[0_3px_0_#047857]';
                  } else if (isSelected && !lastFeedback.isCorrect) {
                    bColor = 'bg-rose-600 ring-3 ring-rose-300 shadow-[0_3px_0_#991B1B]';
                  } else if (isTarget) {
                    bColor = 'bg-amber-600 ring-3 ring-amber-300 shadow-[0_3px_0_#B45309]';
                  }
                }

                return (
                  <button
                    key={keyDef.pitch}
                    type="button"
                    disabled={!!lastFeedback}
                    onClick={() => handleKeyClick(keyDef)}
                    className={`absolute top-1.5 h-28 sm:h-32 rounded-b-xl z-30 flex flex-col justify-end items-center pb-2.5 cursor-pointer transition-all active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed ${bColor}`}
                    style={{
                      left: `${leftPercent}%`,
                      width: `${keyWidthPercent}%`,
                    }}
                  >
                    {lastFeedback && isTarget && (
                      <div className="absolute top-3 flex flex-col items-center animate-bounce">
                        <Crown className="w-4 h-4 text-amber-400 fill-amber-300" />
                      </div>
                    )}
                    <span className="text-white text-xs font-black font-jua">
                      {keyDef.koreanName}
                    </span>
                    <span className="text-[9px] text-slate-300 font-bold mt-0.5">
                      {keyDef.basePitchName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Game Over Card */
        <div className="bg-gradient-to-br from-amber-50 via-white to-amber-100/70 rounded-3xl border-2 border-amber-300 p-8 text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
            <Crown className="w-9 h-9" />
          </div>

          <div>
            <h4 className="text-2xl font-black text-slate-900 font-jua">
              으뜸음 찾기 10문제 도전 완료!
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              조표를 보고 으뜸음을 1초 만에 찾아내는 진짜 화음 박사가 되었어요!
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

      {/* 5. Textbook Key Signature Rule Summary */}
      <div className="bg-[#FFF9EE] border-2 border-amber-200 rounded-3xl p-5 text-xs text-slate-700 space-y-2">
        <div className="flex items-center gap-1.5 font-black text-amber-950 text-sm font-jua">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>초등 교과서 조표와 으뜸음 찾는 공식 총정리:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 leading-relaxed text-xs">
          <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-2xs space-y-1">
            <strong className="text-amber-950 font-black font-jua text-sm block"># 샵의 마법: 마지막 #의 바로 윗음이 '도'!</strong>
            • # 1개(파#): 파# 바로 윗음 <strong>사(G)</strong>가 으뜸음 ➔ <strong>사장조</strong> (나란한 단조는 <strong>마단조</strong>)<br />
            • # 2개(파#, 도#): 마지막 도# 바로 윗음 <strong>라(D)</strong>가 으뜸음 ➔ <strong>라장조</strong>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-2xs space-y-1">
            <strong className="text-blue-950 font-black font-jua text-sm block">b 플랫의 마법: 끝에서 두 번째 b이 '도'!</strong>
            • b 1개(시b): 4도 아래인 <strong>바(F)</strong>가 으뜸음 ➔ <strong>바장조</strong> (나란한 단조는 <strong>라단조</strong>)<br />
            • b 2개(시b, 미b): 끝에서 두 번째인 <strong>내림나(Bb)</strong>가 으뜸음 ➔ <strong>내림나장조</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
