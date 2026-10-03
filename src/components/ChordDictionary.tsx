import React, { useState, useMemo } from 'react';
import { CHORD_DEFINITIONS, buildChordNotes } from '../utils/musicTheory';
import { sound } from '../utils/audioEngine';
import { BookOpen, Search, Volume2 } from 'lucide-react';

export const ChordDictionary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredChords = useMemo(() => {
    return CHORD_DEFINITIONS.filter((chord) => {
      const matchesCategory =
        categoryFilter === 'all' || chord.category === categoryFilter;
      const matchesSearch =
        chord.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chord.koreanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chord.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chord.mood.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chord.formula.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, categoryFilter]);

  const handlePlayChord = (chordId: string) => {
    const chordDef = CHORD_DEFINITIONS.find((c) => c.id === chordId);
    if (!chordDef) return;
    const notes = buildChordNotes('C', chordDef, 4, 0);
    sound.playChord(notes, 'block');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Search */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-400" />
              화음 백과사전 (Chord Reference Library)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              모든 화음의 공식, 반음 간격, 감정 분위기와 사용 원리를 한눈에 비교하고 바로 들어보세요. (C 기준)
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="화음 이름, 기호, 느낌 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-700/60 overflow-x-auto pb-1">
          {[
            { id: 'all', label: '전체 보기' },
            { id: 'triad', label: '기본 3화음 (Triads)' },
            { id: 'seventh', label: '7화음 (7th Chords)' },
            { id: 'suspended', label: '서스펜디드 (Sus2 / Sus4)' },
            { id: 'extended', label: '확장화음 (Extended)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                categoryFilter === cat.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-700/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chords Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredChords.map((chord) => {
          return (
            <div
              key={chord.id}
              className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-5 shadow-lg hover:border-slate-600 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-xl font-black text-white">
                        C{chord.symbol}
                      </h3>
                      <span className="text-sm font-semibold text-indigo-300">
                        {chord.koreanName}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {chord.name} Chord
                    </div>
                  </div>

                  <button
                    onClick={() => handlePlayChord(chord.id)}
                    className="p-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 transition shrink-0"
                    title="소리 듣기"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                  {chord.description}
                </p>

                {/* Formula badge */}
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-700/60">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">도수 공식</span>
                    <span className="text-sm font-bold text-amber-300 font-mono">
                      {chord.formula}
                    </span>
                  </div>

                  <div className="flex flex-col pl-3 border-l border-slate-700">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">분위기 & 키워드</span>
                    <span className="text-xs font-medium text-emerald-300">
                      {chord.mood}
                    </span>
                  </div>
                </div>

                {/* Interval breakdown */}
                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  {chord.intervalNames.map((invName, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-900 text-indigo-200 border border-slate-700"
                    >
                      {invName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
