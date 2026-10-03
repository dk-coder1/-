import React, { useState } from 'react';
import { Header, MainTab } from './components/Header';
import { KeyExplorer } from './components/KeyExplorer';
import { SongAccompaniment } from './components/SongAccompaniment';
import { CreativeLab } from './components/CreativeLab';
import { TheorySecretLab } from './components/TheorySecretLab';
import { MUSICAL_KEYS } from './data/musicTheoryData';
import { Music } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('explorer');
  const [currentKeyId, setCurrentKeyId] = useState<string>('c-major');
  const [secretLabSubTab, setSecretLabSubTab] = useState<'concepts' | 'relative-graph' | 'chord-mood' | 'tonic-quiz' | 'game'>('concepts');

  const currentKey = MUSICAL_KEYS[currentKeyId] || MUSICAL_KEYS['c-major'];

  const handleSelectKey = (keyId: string) => {
    setCurrentKeyId(keyId);
  };

  const handleJumpToSong = (songKeyId: string) => {
    setCurrentKeyId(songKeyId);
    setActiveTab('songs');
  };

  const handleJumpToSecret = (subTab: 'concepts' | 'relative-graph' | 'chord-mood' | 'tonic-quiz' | 'game') => {
    setSecretLabSubTab(subTab);
    setActiveTab('secrets');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 flex flex-col antialiased selection:bg-amber-200">
      {/* Sticky Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-6">
        {/* Quick Classroom Shortcut Strip (미래엔 교과서 단원 빠른 이동 바) */}
        <div className="bg-white border-2 border-amber-200/90 rounded-3xl p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0 font-jua text-lg">
              🎒
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-200 font-jua">
                  오늘의 교실 학습 목표
                </span>
                <span className="text-xs text-slate-500 font-bold hidden sm:inline">
                  음표나 계이름을 몰라도 누구나 직관적으로 연주해요!
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 font-jua mt-0.5">
                건반 운지법(1·2·4·5번)과 조표, 밝은 장조와 아련한 단조의 어울림 익히기
              </h2>
            </div>
          </div>

          {/* Quick Jump Buttons */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              type="button"
              onClick={() => handleJumpToSong('g-major')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-black text-xs border border-amber-300 transition-colors cursor-pointer font-jua flex items-center gap-1 shadow-2xs"
            >
              <span>🍀 사장조 &lt;네잎클로버&gt;</span>
            </button>
            <button
              type="button"
              onClick={() => handleJumpToSong('d-minor')}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 font-black text-xs border border-indigo-300 transition-colors cursor-pointer font-jua flex items-center gap-1 shadow-2xs"
            >
              <span>🌙 라단조 &lt;별 보며 달 보며&gt;</span>
            </button>
            <button
              type="button"
              onClick={() => handleJumpToSecret('chord-mood')}
              className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-950 font-black text-xs border border-purple-300 transition-colors cursor-pointer font-jua flex items-center gap-1 shadow-2xs"
            >
              <span>👂 소리 느낌 맞추기</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Key & Chord Explorer */}
        {activeTab === 'explorer' && (
          <KeyExplorer
            currentKey={currentKey}
            onSelectKey={handleSelectKey}
          />
        )}

        {/* Tab 2: Song Accompaniment Studio */}
        {activeTab === 'songs' && (
          <SongAccompaniment
            initialSongId={currentKeyId === 'd-minor' ? 'stars-and-moon' : 'four-leaf-clover'}
          />
        )}

        {/* Tab 3: Creative Play & Improvisation Sandbox */}
        {activeTab === 'creative' && (
          <CreativeLab />
        )}

        {/* Tab 4: Theory Secrets & Learning Games */}
        {activeTab === 'secrets' && (
          <TheorySecretLab
            initialSubTab={secretLabSubTab}
          />
        )}
      </main>

      {/* Classroom Footer */}
      <footer className="mt-auto border-t-2 border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-amber-500" />
            <span className="font-black text-slate-700 font-jua">도레미 화성 탐험대</span>
            <span>•</span>
            <span className="font-medium text-slate-600">초등 음악 교과서 주요 3화음 & 나란한 조 인터랙티브 교육용 앱</span>
          </div>
          <div className="text-slate-500 font-medium">
            교과서 대표 악곡 &lt;네잎클로버&gt;(사장조), &lt;별 보며 달 보며&gt;(라단조) 수록
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
