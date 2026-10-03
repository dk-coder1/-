import React, { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { PitchClass, ChordDefinition, NoteInfo } from '../types/music';
import {
  PITCH_CLASSES,
  CHORD_DEFINITIONS,
  buildChordNotes,
  SOLFEGE_MAP,
} from '../utils/musicTheory';
import { sound } from '../utils/audioEngine';
import { PianoKeyboard } from './PianoKeyboard';
import { StaffNotation } from './StaffNotation';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  Trophy,
  Flame,
  Music,
  Headphones,
  Sliders,
  Sparkles,
} from 'lucide-react';

type QuizMode = 'ear-training' | 'building';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export const ChordQuiz: React.FC = () => {
  const [mode, setMode] = useState<QuizMode>('ear-training');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [score, setScore] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);

  // Current Question State
  const [currentRoot, setCurrentRoot] = useState<PitchClass>('C');
  const [currentChordDef, setCurrentChordDef] = useState<ChordDefinition>(CHORD_DEFINITIONS[0]);
  const [options, setOptions] = useState<{ id: string; label: string; chordDef: ChordDefinition; root: PitchClass; isCorrect: boolean }[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // For Chord Building Mode
  const [userSelectedMidis, setUserSelectedMidis] = useState<number[]>([]);

  // Get allowed chords based on difficulty
  const allowedChords = useMemo(() => {
    if (difficulty === 'beginner') {
      return CHORD_DEFINITIONS.filter((c) => c.id === 'major' || c.id === 'minor');
    }
    if (difficulty === 'intermediate') {
      return CHORD_DEFINITIONS.filter((c) =>
        ['major', 'minor', 'augmented', 'diminished', 'sus4'].includes(c.id)
      );
    }
    // advanced
    return CHORD_DEFINITIONS.filter((c) =>
      ['major', 'minor', 'maj7', 'dom7', 'm7', 'm7b5', 'dim7', 'augmented', 'diminished'].includes(c.id)
    );
  }, [difficulty]);

  const targetNotes = useMemo(() => {
    return buildChordNotes(currentRoot, currentChordDef, 4, 0);
  }, [currentRoot, currentChordDef]);

  // Generate a new question
  const generateNewQuestion = useCallback(() => {
    // Reset state
    setSelectedAnswer(null);
    setHasAnswered(false);
    setIsCorrect(false);
    setUserSelectedMidis([]);

    // Pick random root (or keep C for beginner ear training to focus on quality)
    const randomRoot =
      difficulty === 'beginner' && Math.random() > 0.4
        ? 'C'
        : PITCH_CLASSES[Math.floor(Math.random() * PITCH_CLASSES.length)];

    const randomChord = allowedChords[Math.floor(Math.random() * allowedChords.length)];

    setCurrentRoot(randomRoot);
    setCurrentChordDef(randomChord);

    // Pick 3 distractors
    const otherChords = allowedChords.filter((c) => c.id !== randomChord.id);
    const shuffledOthers = [...otherChords].sort(() => Math.random() - 0.5);
    const chosenDistractors = shuffledOthers.slice(0, 3);

    const questionOptions = [
      {
        id: randomChord.id,
        label: `${randomRoot}${randomChord.symbol || ' Major'} (${randomChord.koreanName})`,
        chordDef: randomChord,
        root: randomRoot,
        isCorrect: true,
      },
      ...chosenDistractors.map((dist) => ({
        id: dist.id,
        label: `${randomRoot}${dist.symbol || ' Major'} (${dist.koreanName})`,
        chordDef: dist,
        root: randomRoot,
        isCorrect: false,
      })),
    ].sort(() => Math.random() - 0.5);

    setOptions(questionOptions);

    // Automatically play sound for ear training
    setTimeout(() => {
      const notes = buildChordNotes(randomRoot, randomChord, 4, 0);
      sound.playChord(notes, 'block');
    }, 200);
  }, [allowedChords, difficulty]);

  // Start question on mount or change
  useEffect(() => {
    generateNewQuestion();
  }, [generateNewQuestion]);

  const handlePlayBlock = () => {
    sound.playChord(targetNotes, 'block');
  };

  const handlePlayArpeggio = () => {
    sound.playChord(targetNotes, 'arpeggio', 200);
  };

  // Ear training answer handler
  const handleSelectOption = (option: typeof options[0]) => {
    if (hasAnswered) return;

    setHasAnswered(true);
    setSelectedAnswer(option.id);

    if (option.isCorrect) {
      setIsCorrect(true);
      setScore((s) => s + 10);
      setTotalQuestions((t) => t + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);

      // Confetti effect
      confetti({
        particleCount: 50 + newStreak * 10,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      setIsCorrect(false);
      setTotalQuestions((t) => t + 1);
      setStreak(0);
    }
  };

  // Chord Building key click handler
  const handleBuildingKeyClick = (note: NoteInfo) => {
    if (hasAnswered) return;

    setUserSelectedMidis((prev) => {
      if (prev.includes(note.midiNumber)) {
        return prev.filter((m) => m !== note.midiNumber);
      } else {
        return [...prev, note.midiNumber];
      }
    });
  };

  // Check chord building submit
  const handleCheckBuilding = () => {
    if (hasAnswered) return;

    setHasAnswered(true);

    // Check if the user pressed the exact pitch classes of the target chord
    const targetPitchClasses = new Set(targetNotes.map((n) => n.pitchClass));
    const userPitchClasses = new Set(
      userSelectedMidis.map((m) => PITCH_CLASSES[m % 12])
    );

    const isMatch =
      targetPitchClasses.size === userPitchClasses.size &&
      [...targetPitchClasses].every((pc) => userPitchClasses.has(pc));

    if (isMatch) {
      setIsCorrect(true);
      setScore((s) => s + 15);
      setTotalQuestions((t) => t + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      setIsCorrect(false);
      setTotalQuestions((t) => t + 1);
      setStreak(0);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header & Scoreboard */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
              <Headphones className="w-6 h-6 text-indigo-400" />
              화음 청음 & 만들기 퀴즈
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              소리를 듣고 화음의 성격을 구분하는 음악 귀(Ear Training)를 훈련하세요!
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400">점수:</span>
              <strong className="text-amber-300 font-mono text-sm">{score}점</strong>
              <span className="text-slate-500 text-[11px]">({totalQuestions}문제)</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-slate-400">연속:</span>
              <strong className="text-orange-400 font-mono text-sm">{streak}콤보</strong>
            </div>
          </div>
        </div>

        {/* Mode & Difficulty Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-700/60">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              모드:
            </span>
            <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-700/60">
              <button
                onClick={() => setMode('ear-training')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  mode === 'ear-training'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                청음 퀴즈 (듣고 맞히기)
              </button>
              <button
                onClick={() => setMode('building')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  mode === 'building'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                건반 만들기 (직접 누르기)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">난이도:</span>
            <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-700/60">
              <button
                onClick={() => setDifficulty('beginner')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                  difficulty === 'beginner'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                초급 (Major/Minor)
              </button>
              <button
                onClick={() => setDifficulty('intermediate')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                  difficulty === 'intermediate'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                중급 (4대 3화음)
              </button>
              <button
                onClick={() => setDifficulty('advanced')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                  difficulty === 'advanced'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                고급 (7화음)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950/60 border border-slate-700/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {mode === 'ear-training' ? (
          <div>
            {/* Ear Training Sound Player Deck */}
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-600/20 border-2 border-indigo-500/40 text-indigo-400 mb-4 shadow-xl shadow-indigo-600/20 animate-pulse">
                <Music className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                재생되는 화음 소리를 듣고 어떤 화음인지 골라보세요!
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-5">
                팁: 밝고 기쁜 느낌은 <strong>장3화음</strong>, 슬프고 감성적인 느낌은 <strong>단3화음</strong>, 붕 뜬 듯 신비로운 느낌은 <strong>증3화음</strong>, 어둡고 불안한 소리는 <strong>감3화음</strong>입니다.
              </p>

              {/* Sound replay buttons */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handlePlayBlock}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
                >
                  <Volume2 className="w-4 h-4" />
                  동시 화음 다시 듣기
                </button>
                <button
                  onClick={handlePlayArpeggio}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-200 border border-indigo-500/30 font-semibold text-sm transition"
                >
                  <Music className="w-4 h-4 text-sky-400" />
                  펼침음(도-미-솔)으로 듣기
                </button>
              </div>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              {options.map((opt) => {
                const isChosen = selectedAnswer === opt.id;
                let btnStyle =
                  'bg-slate-800/80 border-slate-700 hover:bg-slate-750 text-slate-200 hover:border-slate-500';

                if (hasAnswered) {
                  if (opt.isCorrect) {
                    btnStyle =
                      'bg-emerald-600/30 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/40 font-bold';
                  } else if (isChosen && !opt.isCorrect) {
                    btnStyle =
                      'bg-rose-600/30 border-rose-400 text-rose-200 ring-2 ring-rose-500/40';
                  } else {
                    btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    disabled={hasAnswered}
                    onClick={() => handleSelectOption(opt)}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${btnStyle}`}
                  >
                    <div>
                      <div className="text-base font-bold">{opt.label}</div>
                      <div className="text-xs opacity-75 mt-0.5">
                        도수: {opt.chordDef.formula} • {opt.chordDef.mood}
                      </div>
                    </div>
                    {hasAnswered && opt.isCorrect && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    )}
                    {hasAnswered && isChosen && !opt.isCorrect && (
                      <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Chord Building Mode */
          <div>
            <div className="text-center py-4 mb-3">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
                직접 화음 만들기 챌린지
              </span>
              <h3 className="text-2xl font-extrabold text-white">
                <span className="text-sky-400">{currentRoot}</span> {currentChordDef.koreanName} ({currentRoot}{currentChordDef.symbol || 'M'}) 화음의 구성음을 건반에서 모두 누르세요!
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                도수 공식: <strong className="text-amber-300">{currentChordDef.formula}</strong> (필요한 음 개수: {currentChordDef.intervals.length}개)
              </p>
            </div>

            {/* Piano keyboard for building */}
            <div className="my-4">
              <PianoKeyboard
                startOctave={4}
                endOctave={5}
                interactive={!hasAnswered}
                selectedMidis={userSelectedMidis}
                onKeyClick={handleBuildingKeyClick}
                activeNotes={hasAnswered ? targetNotes : []}
                rootNote={currentRoot}
              />
            </div>

            {/* Currently selected notes list & Submit */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-400">선택한 음:</span>
                {userSelectedMidis.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">건반의 음을 클릭하세요</span>
                ) : (
                  userSelectedMidis.map((midi) => {
                    const pc = PITCH_CLASSES[midi % 12];
                    return (
                      <span
                        key={midi}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-500/40"
                      >
                        {pc} ({SOLFEGE_MAP[pc]})
                      </span>
                    );
                  })
                )}
              </div>

              {!hasAnswered && (
                <button
                  onClick={handleCheckBuilding}
                  disabled={userSelectedMidis.length === 0}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition"
                >
                  화음 검사하기
                </button>
              )}
            </div>
          </div>
        )}

        {/* Feedback & Detailed Explanation upon answering */}
        {hasAnswered && (
          <div className="mt-6 pt-6 border-t border-slate-700/60 animate-in fade-in slide-in-from-top-3 duration-300">
            <div
              className={`p-4 rounded-xl border mb-5 ${
                isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-lg mb-1">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    정답입니다! 완벽해요! 🎉 (+{mode === 'building' ? 15 : 10}점)
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-rose-400" />
                    아쉽네요! 정답은 {currentRoot}{currentChordDef.symbol || ' Major'} ({currentChordDef.koreanName}) 입니다.
                  </>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
                {currentChordDef.description}
              </p>
              <div className="text-xs font-medium text-slate-400 mt-2 flex items-center gap-3">
                <span>구성음: <strong className="text-white">{targetNotes.map((n) => `${n.pitchClass}(${n.solfege})`).join(' - ')}</strong></span>
                <span>도수: <strong className="text-amber-300">{currentChordDef.formula}</strong></span>
              </div>
            </div>

            {/* Reveal Notation for Learning */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <StaffNotation notes={targetNotes} title="정답 화음 오선보" />
              <div className="flex flex-col justify-center items-center gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">정답 화음 다시 소리 듣기</span>
                <div className="flex gap-2">
                  <button
                    onClick={handlePlayBlock}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> 블록 화음
                  </button>
                  <button
                    onClick={handlePlayArpeggio}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Music className="w-3.5 h-3.5" /> 아르페지오
                  </button>
                </div>

                {/* Next Question Button */}
                <button
                  onClick={generateNewQuestion}
                  className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition transform hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4" /> 다음 문제 도전하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
