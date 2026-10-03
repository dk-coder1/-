import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ProgressionTemplate, NoteInfo } from '../types/music';
import {
  PROGRESSION_TEMPLATES,
  CHORD_DEFINITIONS,
  buildChordNotes,
} from '../utils/musicTheory';
import { sound } from '../utils/audioEngine';
import { StaffNotation } from './StaffNotation';
import { PianoKeyboard } from './PianoKeyboard';
import { Play, Square, FastForward, Clock, Layers, Sparkles } from 'lucide-react';

export const ChordProgressions: React.FC = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(PROGRESSION_TEMPLATES[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(90);
  const [playMode, setPlayMode] = useState<'block' | 'arpeggio'>('block');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeTemplate: ProgressionTemplate = useMemo(() => {
    return (
      PROGRESSION_TEMPLATES.find((t) => t.id === selectedTemplateId) ||
      PROGRESSION_TEMPLATES[0]
    );
  }, [selectedTemplateId]);

  // Current active step chord notes
  const activeStep = activeTemplate.steps[currentStepIndex] || activeTemplate.steps[0];

  const activeStepChordDef = useMemo(() => {
    return (
      CHORD_DEFINITIONS.find((c) => c.id === activeStep.chordId) ||
      CHORD_DEFINITIONS[0]
    );
  }, [activeStep]);

  const activeStepNotes: NoteInfo[] = useMemo(() => {
    return buildChordNotes(activeStep.root, activeStepChordDef, 4, 0);
  }, [activeStep.root, activeStepChordDef]);

  // Play chord for step
  const playStepChord = (stepIdx: number) => {
    const step = activeTemplate.steps[stepIdx];
    if (!step) return;
    const chordDef = CHORD_DEFINITIONS.find((c) => c.id === step.chordId) || CHORD_DEFINITIONS[0];
    const notes = buildChordNotes(step.root, chordDef, 4, 0);
    sound.playChord(notes, playMode, 180);
  };

  // Step change or playback sequence
  const stopPlayback = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startPlayback = () => {
    setIsPlaying(true);
    // Play current first
    playStepChord(currentStepIndex);

    // Calculate step interval based on BPM (quarter note beats)
    // Beat duration = (60 / bpm) seconds
    const intervalMs = (60 / bpm) * 2 * 1000; // 2 beats per chord step

    let nextIndex = currentStepIndex;

    timerRef.current = setInterval(() => {
      nextIndex = (nextIndex + 1) % activeTemplate.steps.length;
      setCurrentStepIndex(nextIndex);
      playStepChord(nextIndex);
    }, intervalMs);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleStepClick = (index: number) => {
    setCurrentStepIndex(index);
    playStepChord(index);
  };

  const handleTemplateChange = (templateId: string) => {
    stopPlayback();
    setSelectedTemplateId(templateId);
    setCurrentStepIndex(0);
    // Preview first chord
    setTimeout(() => {
      const template = PROGRESSION_TEMPLATES.find((t) => t.id === templateId);
      if (template && template.steps[0]) {
        const chordDef = CHORD_DEFINITIONS.find((c) => c.id === template.steps[0].chordId) || CHORD_DEFINITIONS[0];
        const notes = buildChordNotes(template.steps[0].root, chordDef, 4, 0);
        sound.playChord(notes, 'block');
      }
    }, 100);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Template Selector */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-indigo-400" />
              화음 진행 & 종지법 (Chord Progressions & Cadences)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              음악의 감동은 화음과 화음이 연결될 때 완성됩니다. 주요 명진행의 긴장과 해결을 들어보세요.
            </p>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-3 bg-slate-900/90 p-2.5 rounded-xl border border-slate-700/80">
            {isPlaying ? (
              <button
                onClick={stopPlayback}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition"
              >
                <Square className="w-3.5 h-3.5 fill-white" />
                정지
              </button>
            ) : (
              <button
                onClick={startPlayback}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                전체 진행 연속 재생
              </button>
            )}

            {/* BPM Slider */}
            <div className="flex items-center gap-2 px-2 border-l border-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="range"
                min="60"
                max="160"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-20 accent-indigo-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-indigo-300 w-12 text-right">
                {bpm} BPM
              </span>
            </div>

            {/* Block / Arpeggio toggle */}
            <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-[11px]">
              <button
                onClick={() => setPlayMode('block')}
                className={`px-2 py-1 rounded font-medium ${
                  playMode === 'block' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
              >
                블록
              </button>
              <button
                onClick={() => setPlayMode('arpeggio')}
                className={`px-2 py-1 rounded font-medium ${
                  playMode === 'arpeggio' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
              >
                아르페지오
              </button>
            </div>
          </div>
        </div>

        {/* Template Selectors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {PROGRESSION_TEMPLATES.map((tpl) => {
            const isSelected = selectedTemplateId === tpl.id;
            return (
              <button
                key={tpl.id}
                onClick={() => handleTemplateChange(tpl.id)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-indigo-600/30 border-indigo-400 ring-2 ring-indigo-500/30 shadow-md'
                    : 'bg-slate-900/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate max-w-[200px]">
                    {tpl.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300">
                    {tpl.category}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-1">
                  {tpl.steps.map((s) => `${s.numeral}`).join(' → ')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Progression Sequence Stage */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950/70 border border-slate-700/80 rounded-2xl p-6 shadow-2xl relative">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {activeTemplate.name}
            </h3>
            {activeTemplate.cadenceType && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {activeTemplate.cadenceType}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {activeTemplate.description}
          </p>
        </div>

        {/* Step Sequence Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2 my-5">
          {activeTemplate.steps.map((step, idx) => {
            const isCurrent = currentStepIndex === idx;
            const chordDef = CHORD_DEFINITIONS.find((c) => c.id === step.chordId) || CHORD_DEFINITIONS[0];
            const chordSymbol = `${step.root}${chordDef.symbol}`;

            return (
              <button
                key={idx}
                onClick={() => handleStepClick(idx)}
                className={`p-3 rounded-xl border text-center transition-all transform cursor-pointer ${
                  isCurrent
                    ? 'bg-gradient-to-b from-indigo-500 to-indigo-700 border-indigo-300 text-white ring-4 ring-indigo-500/40 scale-105 shadow-xl shadow-indigo-600/40 z-10'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-750 hover:border-slate-500'
                }`}
              >
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-80 mb-0.5">
                  Step {idx + 1}
                </div>
                <div className="text-xl font-extrabold tracking-tight">
                  {chordSymbol}
                </div>
                <div className="text-xs font-mono font-bold text-amber-300 mt-0.5">
                  {step.numeral}
                </div>
                <div className="text-[10px] text-slate-300 opacity-90 truncate mt-1">
                  {step.koreanRole}
                </div>
              </button>
            );
          })}
        </div>

        {/* Deep Dive for Current Step */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 items-center">
          <StaffNotation
            notes={activeStepNotes}
            title={`현재 화음 악보: ${activeStep.root}${activeStepChordDef.symbol} (${activeStep.numeral})`}
          />

          <div className="space-y-4">
            <div className="bg-slate-800/70 p-4 rounded-xl border border-slate-700/70">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">
                  현재 진행 위치 분석
                </span>
                <span className="text-xs text-amber-300 font-mono">
                  {activeStep.numeral} 화음 ({activeStep.root}{activeStepChordDef.symbol})
                </span>
              </div>
              <h4 className="text-lg font-bold text-white mb-1">
                {activeStep.koreanRole}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeStepChordDef.description}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => playStepChord(currentStepIndex)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  현재 화음 다시 듣기
                </button>
                <button
                  onClick={() => {
                    const next = (currentStepIndex + 1) % activeTemplate.steps.length;
                    handleStepClick(next);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  다음 화음으로 이동 <FastForward className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="bg-slate-800/70 p-3.5 rounded-xl border border-slate-700/70 text-xs text-slate-300">
              <span className="font-bold text-sky-400 block mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> 화음 기능(Function) 팁
              </span>
              <span>
                <strong>으뜸화음 (Tonic, I)</strong>: 집(Home)과 같은 최고의 안정감.<br />
                <strong>버금딸림화음 (Subdominant, IV)</strong>: 집을 떠나 여행을 시작하는 열린 느낌.<br />
                <strong>딸림화음 (Dominant, V)</strong>: 긴장감이 최고조에 달하여 다시 집(I)으로 돌아가려는 강한 인력.
              </span>
            </div>
          </div>
        </div>

        {/* Keyboard for current progression step */}
        <div className="mt-6">
          <PianoKeyboard
            activeNotes={activeStepNotes}
            rootNote={activeStep.root}
            startOctave={3}
            endOctave={5}
          />
        </div>
      </div>
    </div>
  );
};
