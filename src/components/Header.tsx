import React, { useState } from 'react';
import { soundEngine } from '../utils/audioEngine';
import {
  Compass,
  BookOpen,
  Wand2,
  Lightbulb,
  Volume2,
  VolumeX,
  Music
} from 'lucide-react';

export type MainTab = 'explorer' | 'songs' | 'creative' | 'secrets';

interface HeaderProps {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [isMuted, setIsMuted] = useState(soundEngine.isSoundMuted());
  const [volume, setVolume] = useState(soundEngine.getVolume());

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundEngine.setVolume(val);
    if (isMuted && val > 0) {
      soundEngine.toggleMute();
      setIsMuted(false);
    }
  };

  const navItems = [
    { id: 'explorer' as const, label: '음계 & 화음 탐험', icon: Compass, badge: '기본' },
    { id: 'songs' as const, label: '교과서 노래 합주', icon: BookOpen, badge: '네잎클로버/별달' },
    { id: 'creative' as const, label: '화성 창작 놀이터', icon: Wand2, badge: '즉흥작곡' },
    { id: 'secrets' as const, label: '호기심 & 탐구게임', icon: Lightbulb, badge: '비밀해결' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Brand Logo & Title */}
          <div className="flex items-center justify-between">
            <div
              onClick={() => setActiveTab('explorer')}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center shadow-sm text-white group-hover:scale-105 transition-transform">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black tracking-tight text-slate-900 font-jua">
                    도레미 화성 탐험대
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                    초등 음악 교실
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                  다장조부터 사장조·라단조까지! 계이름·음이름·건반 운지와 소리의 어울림
                </p>
              </div>
            </div>

            {/* Mobile Sound Control */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={handleToggleMute}
                className="p-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200"
                aria-label="음소거 토글"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
              </button>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer font-jua ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-xs border-2 border-amber-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-2 border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold hidden sm:inline-block ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Sound Volume Control */}
          <div className="hidden md:flex items-center gap-2.5 pl-3 border-l-2 border-slate-100">
            <button
              onClick={handleToggleMute}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition cursor-pointer"
              title={isMuted ? '음소거 해제' : '음소거'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-500" />
              ) : (
                <Volume2 className="w-4 h-4 text-amber-600" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 accent-amber-500 cursor-pointer"
              title="볼륨 조절"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
