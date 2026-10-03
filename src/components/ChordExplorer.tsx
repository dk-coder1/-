import React, { useState, useMemo } from 'react';
import { PitchClass, InversionType } from '../types/music';
import {
  PITCH_CLASSES,
  CHORD_DEFINITIONS,
  buildChordNotes,
  SOLFEGE_MAP,
  KOREAN_NOTE_NAMES,
  getInversionName,
} from '../utils/musicTheory';
import { sound } from '../utils/audioEngine';
import { PianoKeyboard } from './PianoKeyboard';
import { StaffNotation } from './StaffNotation';
import { Volume2, Play, Music, Sparkles, Layers, HelpCircle, ArrowRight } from 'lucide-react';

export const ChordExplorer: React.FC = () => {
  const [selectedRoot, setSelectedRoot] = useState<PitchClass>('C');
  const [selectedChordId, setSelectedChordId] = useState<string>('major');
  const [selectedInversion, setSelectedInversion] = useState<InversionType>(0);
  const [activeCategory, setActiveCategory] = useState<'triad' | 'seventh' | 'other'>('triad');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const currentChordDef = useMemo(() => {
    return CHORD_DEFINITIONS.find((c) => c.id === selectedChordId) || CHORD_DEFINITIONS[0];
  }, [selectedChordId]);

  const isSeventhOrMore = currentChordDef.intervals.length >= 4;

  // If user switches to a chord with fewer notes, clamp inversion
  const safeInversion = useMemo(() => {
    const maxInv = (currentChordDef.intervals.length - 1) as InversionType;
    return (selectedInversion > maxInv ? 0 : selectedInversion) as InversionType;
  }, [selectedInversion, currentChordDef]);

  const chordNotes = useMemo(() => {
    return buildChordNotes(selectedRoot, currentChordDef, 4, safeInversion);
  }, [selectedRoot, currentChordDef, safeInversion]);

  const filteredChords = useMemo(() => {
    if (activeCategory === 'triad') {
      return CHORD_DEFINITIONS.filter((c) => c.category === 'triad');
    }
    if (activeCategory === 'seventh') {
      return CHORD_DEFINITIONS.filter((c) => c.category === 'seventh');
    }
    return CHORD_DEFINITIONS.filter((c) => c.category === 'suspended' || c.category === 'extended');
  }, [activeCategory]);

  const handlePlayBlock = () => {
    setIsPlaying(true);
    sound.playChord(chordNotes, 'block');
    setTimeout(() => setIsPlaying(false), 800);
  };

  const handlePlayArpeggio = () => {
    setIsPlaying(true);
    sound.playChord(chordNotes, 'arpeggio', 220);
    setTimeout(() => setIsPlaying(false), chordNotes.length * 220 + 700);
  };

  const handlePlayStrum = () => {
    setIsPlaying(true);
    sound.playChord(chordNotes, 'strum');
    setTimeout(() => setIsPlaying(false), 800);
  };

  const inversionInfo = getInversionName(safeInversion, isSeventhOrMore);

  // Form chord slash notation if inverted
  const bassNote = chordNotes[0]?.pitchClass;
  const chordSymbolWithSlash =
    safeInversion === 0
      ? `${selectedRoot}${currentChordDef.symbol}`
      : `${selectedRoot}${currentChordDef.symbol}/${bassNote}`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner & Control Deck */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        {/* Step 1: Root Note Selector */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/30 text-indigo-300 flex items-center justify-center text-[11px] font-bold">1</span>
              근음 (Root) 선택
            </label>
            <span className="text-xs text-slate-400">
              한국음이름: <strong className="text-sky-300">{KOREAN_NOTE_NAMES[selectedRoot]}</strong> ({SOLFEGE_MAP[selectedRoot]})
            </span>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
            {PITCH_CLASSES.map((pc) => {
              const isSelected = selectedRoot === pc;
              return (
                <button
                  key={pc}
                  onClick={() => setSelectedRoot(pc)}
                  className={`py-2 px-1 rounded-xl text-center font-bold text-sm transition-all duration-200 border ${
                    isSelected
                      ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/30 scale-105'
                      : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <div className="text-sm font-extrabold">{pc}</div>
                  <div className="text-[10px] opacity-70 font-normal">{SOLFEGE_MAP[pc]}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Chord Category Tabs */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/30 text-indigo-300 flex items-center justify-center text-[11px] font-bold">2</span>
              화음 종류 (Chord Type)
            </label>
            <div className="flex bg-slate-900/80 p-0.5 rounded-lg border border-slate-700/60">
              <button
                onClick={() => setActiveCategory('triad')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  activeCategory === 'triad'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                3화음 (Triads)
              </button>
              <button
                onClick={() => setActiveCategory('seventh')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  activeCategory === 'seventh'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                7화음 (7th Chords)
              </button>
              <button
                onClick={() => setActiveCategory('other')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  activeCategory === 'other'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                서스펜디드 & 텐션 (Sus/Add)
              </button>
            </div>
          </div>

          {/* Chord Type Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {filteredChords.map((chord) => {
              const isSelected = selectedChordId === chord.id;
              return (
                <button
                  key={chord.id}
                  onClick={() => setSelectedChordId(chord.id)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-indigo-600/25 border-indigo-400 ring-2 ring-indigo-500/30 shadow-md'
                      : 'bg-slate-900/40 border-slate-700/70 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-100">
                      {selectedRoot}{chord.symbol || ' (Major)'}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono">
                      {chord.formula}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1">{chord.koreanName}</div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">{chord.mood}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Inversion Selector */}
        <div className="pt-2 border-t border-slate-700/60">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/30 text-indigo-300 flex items-center justify-center text-[11px] font-bold">3</span>
              자리바꿈 (Inversion / 전위)
            </label>
            <span className="text-xs text-indigo-300 font-medium">
              {inversionInfo.bassRole}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[0, 1, 2, ...(isSeventhOrMore ? [3] : [])].map((inv) => {
              const isSelected = safeInversion === inv;
              const info = getInversionName(inv as InversionType, isSeventhOrMore);
              return (
                <button
                  key={inv}
                  onClick={() => setSelectedInversion(inv as InversionType)}
                  className={`p-2.5 rounded-xl border text-center font-medium text-xs transition ${
                    isSelected
                      ? 'bg-sky-500/25 border-sky-400 text-sky-200 ring-2 ring-sky-500/30'
                      : 'bg-slate-900/40 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-bold">{info.korean}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{info.english}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Primary Display & Sound Player Card */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950/70 border border-indigo-900/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-700/60">
          <div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {chordSymbolWithSlash}
              </h2>
              <span className="text-base sm:text-lg font-semibold text-indigo-300">
                {selectedRoot} {currentChordDef.koreanName}
              </span>
              {safeInversion > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {inversionInfo.korean}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              {currentChordDef.description}
            </p>
          </div>

          {/* Sound Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handlePlayBlock}
              disabled={isPlaying}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              <Volume2 className="w-4 h-4" />
              화음 연주 (블록)
            </button>
            <button
              onClick={handlePlayArpeggio}
              disabled={isPlaying}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-850 text-indigo-200 border border-indigo-500/30 font-semibold text-sm transition transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-indigo-300" />
              펼침 화음 (아르페지오)
            </button>
            <button
              onClick={handlePlayStrum}
              disabled={isPlaying}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium text-xs transition"
            >
              <Music className="w-3.5 h-3.5 text-sky-400" />
              스트럼
            </button>
          </div>
        </div>

        {/* Chord Structure Deep Dive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          {/* Note breakdown */}
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60">
            <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-400" />
              화음 구성음 (Notes)
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {chordNotes.map((n, i) => (
                <div
                  key={i}
                  className={`px-3 py-1.5 rounded-lg font-bold text-sm border flex items-center gap-1 ${
                    i === 0
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      : 'bg-indigo-500/20 text-indigo-200 border-indigo-500/40'
                  }`}
                >
                  <span>{n.pitchClass}</span>
                  <span className="text-xs font-normal opacity-70">({n.solfege})</span>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              가장 아래음(베이스): <strong className="text-sky-300">{bassNote}</strong>
            </div>
          </div>

          {/* Formula & Intervals */}
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60">
            <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              도수 공식 및 인터벌 (Formula)
            </div>
            <div className="text-lg font-bold text-amber-300 font-mono">
              {currentChordDef.formula}
            </div>
            <div className="flex items-center gap-1 flex-wrap mt-1 text-[11px] text-slate-300">
              {currentChordDef.intervalNames.map((name, i) => (
                <span key={i} className="inline-flex items-center gap-1">
                  <span>{name}</span>
                  {i < currentChordDef.intervalNames.length - 1 && (
                    <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Mood & Character */}
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60">
            <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              음악적 느낌과 캐릭터 (Mood)
            </div>
            <div className="text-sm font-semibold text-emerald-300">
              {currentChordDef.mood}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              자주 쓰이는 장르: {currentChordDef.category === 'triad' ? '발라드, 팝, 클래식' : currentChordDef.category === 'seventh' ? '재즈, R&B, 시티팝, 보사노바' : '모던 팝, 록'}
            </div>
          </div>
        </div>

        {/* Sheet Music Staff Notation */}
        <div className="mb-6">
          <StaffNotation
            notes={chordNotes}
            title={`${chordSymbolWithSlash} - 오선보 악보 표시`}
            showLabels={true}
          />
        </div>

        {/* Interactive Piano Keyboard */}
        <div>
          <PianoKeyboard
            activeNotes={chordNotes}
            rootNote={selectedRoot}
            startOctave={3}
            endOctave={5}
          />
        </div>
      </div>
    </div>
  );
};
