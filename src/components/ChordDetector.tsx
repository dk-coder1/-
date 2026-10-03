import React, { useState } from 'react';
import { NoteInfo } from '../types/music';
import { detectChord, midiToNoteInfo } from '../utils/musicTheory';
import { sound } from '../utils/audioEngine';
import { PianoKeyboard } from './PianoKeyboard';
import { StaffNotation } from './StaffNotation';
import { Wand2, Volume2, RotateCcw, Sparkles } from 'lucide-react';

export const ChordDetector: React.FC = () => {
  const [selectedMidis, setSelectedMidis] = useState<number[]>([]);

  const handleKeyClick = (note: NoteInfo) => {
    setSelectedMidis((prev) => {
      if (prev.includes(note.midiNumber)) {
        return prev.filter((m) => m !== note.midiNumber);
      } else {
        return [...prev, note.midiNumber].sort((a, b) => a - b);
      }
    });
  };

  const detected = detectChord(selectedMidis);
  const activeNotes = selectedMidis.map((m) => midiToNoteInfo(m));

  const handleClear = () => {
    setSelectedMidis([]);
  };

  const handlePlaySelected = () => {
    if (activeNotes.length > 0) {
      sound.playChord(activeNotes, 'block');
    }
  };

  const handlePlayArpeggio = () => {
    if (activeNotes.length > 0) {
      sound.playChord(activeNotes, 'arpeggio', 180);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Intro Header */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
              <Wand2 className="w-6 h-6 text-indigo-400" />
              자유 건반 & 화음 감지기 (Chord Identifier)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              건반에서 원하는 건반들을 자유롭게 눌러보세요. 어떤 화음(코드)인지 즉시 분석해 드립니다!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePlaySelected}
              disabled={selectedMidis.length === 0}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Volume2 className="w-3.5 h-3.5" />
              선택한 음 소리 듣기
            </button>
            <button
              onClick={handleClear}
              disabled={selectedMidis.length === 0}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 disabled:opacity-40 text-slate-400 hover:text-white font-medium text-xs flex items-center gap-1 border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* Detection Result Card */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950/70 border border-slate-700/80 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              실시간 분석 결과
            </div>
            {detected ? (
              <div>
                <h3 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-300">
                  {detected.chordName}
                </h3>
                <div className="text-sm font-semibold text-indigo-300 mt-0.5">
                  {detected.koreanName} ({detected.formula})
                </div>
              </div>
            ) : selectedMidis.length < 2 ? (
              <div className="text-xl font-bold text-slate-400 italic">
                건반에서 2개 이상의 음을 눌러보세요
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-bold text-slate-300">
                  복합 화음 또는 불협화음
                </h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  선택한 음: {activeNotes.map((n) => n.pitchClass).join(', ')}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePlayArpeggio}
              disabled={selectedMidis.length === 0}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-indigo-200 border border-indigo-500/30 font-semibold text-xs transition"
            >
              아르페지오로 듣기
            </button>
          </div>
        </div>

        {/* Staff & Keyboard */}
        <div className="my-6">
          <StaffNotation notes={activeNotes} title="현재 누른 음 오선보 악보" />
        </div>

        <div>
          <PianoKeyboard
            startOctave={3}
            endOctave={5}
            interactive={true}
            selectedMidis={selectedMidis}
            onKeyClick={handleKeyClick}
          />
        </div>
      </div>
    </div>
  );
};
