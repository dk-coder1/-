import React, { useState } from 'react';
import { MUSICAL_KEYS, MusicalKey } from './data/musicTheoryData';
import { KeyExplorer } from './components/KeyExplorer';
import { SongAccompaniment } from './components/SongAccompaniment';
import { TheorySecretLab } from './components/TheorySecretLab';
import { CreativeLab } from './components/CreativeLab';
import { soundEngine } from './utils/audioEngine';
import {
  Volume2,
  VolumeX,
  BookOpen,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'explorer' | 'songs' | 'secrets' | 'creative'>('explorer');
  const [secretsSubTab, setSecretsSubTab] = useState<'concepts' | 'relative-graph' | 'chord-mood' | 'tonic-quiz' | 'game'>('concepts');
  const [selectedKeyId, setSelectedKeyId] = useState<string>('g-major'); // 사장조 default (교과서 네잎클로버)
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showTeacherGuide, setShowTeacherGuide] = useState<boolean>(false);

  const currentKey: MusicalKey = MUSICAL_KEYS[selectedKeyId] || MUSICAL_KEYS['g-major'];

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
  };

  const handleQuickKeyChange = (keyId: string) => {
    setSelectedKeyId(keyId);
    setCurrentTab('explorer');
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-slate-800 flex flex-col font-sans">
      {/* 1. Header (미래엔 교과서 플랫폼 스타일 - 깔끔한 화이트 바 & 또렷한 탭) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-slate-200/90 px-4 sm:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-xl shadow-xs">
              🎹
            </span>
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => setCurrentTab('explorer')}
                className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight hover:opacity-90 text-left cursor-pointer font-jua"
              >
                어울림 화음 탐험대
              </button>
            </div>
          </div>

          {/* Zone 2: Navigation Links (도톰하고 터치하기 편한 교과서 탭) */}
          <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-black font-jua">
            <button
              type="button"
              onClick={() => setCurrentTab('explorer')}
              className={`px-3.5 py-2 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
                currentTab === 'explorer'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              조 & 화음 운지
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab('songs')}
              className={`px-3.5 py-2 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
                currentTab === 'songs'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              교과서 곡 합주
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab('secrets')}
              className={`px-3.5 py-2 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
                currentTab === 'secrets'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              소리의 어울림 & 게임
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab('creative')}
              className={`px-3.5 py-2 rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
                currentTab === 'creative'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              꼬마 창작 놀이터
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTeacherGuide(true)}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border-2 border-amber-300 bg-amber-50 text-amber-950 font-black text-xs hover:bg-amber-100 transition-colors cursor-pointer font-jua shadow-2xs"
            >
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>교과서 지도 팁</span>
            </button>
            <button
              type="button"
              onClick={handleToggleMute}
              className={`p-2.5 rounded-2xl border transition-colors cursor-pointer ${
                isMuted
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title={isMuted ? '음소거 해제' : '소리 끄기'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Textbook Quick Badge Ribbon (미래엔 교과서 단원 바로가기 리본) */}
      <section className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-black text-amber-950 flex items-center gap-1 font-jua text-sm">
              <BookOpen className="w-4 h-4 text-amber-700" />
              교과서 단원 바로가기:
            </span>
            <button
              type="button"
              onClick={() => handleQuickKeyChange('g-major')}
              className="text-amber-950 font-bold hover:bg-amber-100 bg-white px-3 py-1 rounded-full border border-amber-300 shadow-2xs cursor-pointer transition-all"
            >
              🍀 사장조 &lt;네잎클로버&gt;
            </button>
            <button
              type="button"
              onClick={() => handleQuickKeyChange('d-minor')}
              className="text-indigo-950 font-bold hover:bg-indigo-50 bg-white px-3 py-1 rounded-full border border-indigo-200 shadow-2xs cursor-pointer transition-all"
            >
              🌙 라단조 &lt;별 보며 달 보며&gt;
            </button>
            <button
              type="button"
              onClick={() => handleQuickKeyChange('c-major')}
              className="text-slate-800 font-bold hover:bg-slate-100 bg-white px-3 py-1 rounded-full border border-slate-300 shadow-2xs cursor-pointer transition-all"
            >
              ☀️ 다장조
            </button>
            <button
              type="button"
              onClick={() => {
                setSecretsSubTab('relative-graph');
                setCurrentTab('secrets');
              }}
              className="text-indigo-950 font-black hover:bg-indigo-100 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-300 shadow-2xs cursor-pointer transition-all font-jua"
            >
              🌀 나란한 조와 으뜸음 이동
            </button>
            <button
              type="button"
              onClick={() => {
                setSecretsSubTab('chord-mood');
                setCurrentTab('secrets');
              }}
              className="text-amber-950 font-black hover:bg-amber-100 bg-amber-50 px-3 py-1 rounded-full border border-amber-300 shadow-2xs cursor-pointer transition-all font-jua"
            >
              👂 밝은 화음 vs 쓸쓸한 화음
            </button>
            <button
              type="button"
              onClick={() => {
                setSecretsSubTab('tonic-quiz');
                setCurrentTab('secrets');
              }}
              className="text-amber-950 font-black hover:bg-amber-100 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300 shadow-2xs cursor-pointer transition-all font-jua"
            >
              🎹 조표 보고 으뜸음 찾기
            </button>
            <button
              type="button"
              onClick={() => {
                setSecretsSubTab('game');
                setCurrentTab('secrets');
              }}
              className="text-purple-950 font-black hover:bg-purple-100 bg-purple-50 px-3 py-1 rounded-full border border-purple-300 shadow-2xs cursor-pointer transition-all font-jua"
            >
              🎯 오선지 음표 맞추기
            </button>
          </div>

          <div className="text-xs text-slate-600 font-bold">
            현재 으뜸음: <strong className="text-amber-900">{currentKey.tonicKorean}({currentKey.tonicPitch})</strong> · 조표: <strong className="text-slate-800">{currentKey.keySignature.sharps.length > 0 ? `# 샵 ${currentKey.keySignature.sharps.join(',')}` : currentKey.keySignature.flats.length > 0 ? `b 플랫 ${currentKey.keySignature.flats.join(',')}` : '없음'}</strong>
          </div>
        </div>
      </section>

      {/* 3. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        {currentTab === 'explorer' && (
          <KeyExplorer
            currentKey={currentKey}
            onSelectKey={(id) => setSelectedKeyId(id)}
            onOpenQnADemo={() => {
              setSecretsSubTab('concepts');
              setCurrentTab('secrets');
            }}
          />
        )}

        {currentTab === 'songs' && (
          <SongAccompaniment
            initialSongId={selectedKeyId === 'd-minor' ? 'stars-and-moon' : 'four-leaf-clover'}
          />
        )}

        {currentTab === 'secrets' && (
          <TheorySecretLab initialSubTab={secretsSubTab} />
        )}

        {currentTab === 'creative' && (
          <CreativeLab />
        )}
      </main>

      {/* 4. Teacher's Guide Modal (교사용 지도서 스타일) */}
      {showTeacherGuide && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border-2 border-amber-300 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  <BookOpen className="w-4 h-4" />
                </span>
                <h3 className="font-black text-lg text-slate-900 font-jua">
                  초등 음악 수업 지도 가이드 (선생님 & 학생용)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTeacherGuide(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-200">
                <h4 className="font-black text-amber-950 text-sm sm:text-base mb-1 font-jua">
                  1. "음악 감각이 전혀 없거나 건반도 모르는 아이"를 위한 수업 전략
                </h4>
                <p>
                  • [조 & 화음 운지] 탭에서 건반의 <strong>무지개 색상 뱃지(도: 빨강, 레: 주황, 미: 노랑...)</strong>와 <strong>손가락 번호(1번 엄지, 3번 중지, 5번 새끼)</strong>를 켜주세요.
                  아이들이 악보를 못 읽어도 색깔과 번호만 보고 직관적으로 손을 올릴 수 있습니다.
                  <br />
                  • 특히 <strong>교과서 자리바꿈 운지</strong>를 적용하여 손을 멀리 벌리지 않고 같은 자리 주변에서 I, IV, V 화음을 치도록 지도하세요.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-200">
                <h4 className="font-black text-blue-950 text-sm sm:text-base mb-1 font-jua">
                  2. "음이름과 계이름이 헷갈리는 아이"를 위한 수업 전략
                </h4>
                <p>
                  • 피아노 건반의 다(C), 사(G)는 평생 변하지 않는 <strong>"주민등록번호(음이름)"</strong>임을 먼저 알려줍니다.
                  <br />
                  • 사장조 나라에 가면 대장(사/G)이 "도"라는 <strong>"역할(계이름)"</strong>을 맡게 된다는 비유를 들려주세요.
                  [음계와 화음 비밀 해결소]의 [음이름 vs 계이름] 렌즈 실험기를 통해 두 이름표가 어떻게 매칭되는지 눈으로 비교하면 100% 이해합니다.
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-2xl border-2 border-purple-200">
                <h4 className="font-black text-purple-950 text-sm sm:text-base mb-1 font-jua">
                  3. 교과서 수록 악곡 지도 방법
                </h4>
                <p>
                  • <strong>사장조 &lt;네잎클로버&gt; (음악 14~15쪽):</strong>
                  I (G), IV (C), V (D) 화음의 경쾌한 변화를 [교과서 곡 합주]에서 한 마디씩 직접 반주하며 체험합니다.
                  <br />
                  • <strong>라단조 &lt;별 보며 달 보며&gt; (음악 50~51쪽):</strong>
                  단조의 차분한 분위기와 함께, 51쪽에 나오는 <strong>학생 2의 어울림 화음 가락(2중창)</strong> 체크박스를 켜서 소리의 풍성한 조화를 귀로 직접 느끼게 해주세요.
                </p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowTeacherGuide(false)}
                className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm cursor-pointer shadow-sm font-jua"
              >
                확인하고 수업 시작하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Minimal Editorial Footer */}
      <footer className="mt-auto border-t-2 border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-medium">
          <span>도레미 화성 탐험대 · 초등학교 음악과 음계·화음 및 소리의 어울림 교육용 인터랙티브 웹</span>
          <span>초등 5·6학년 음악 교과서(미래엔 등 주요 검인정 교과서 단원) 연계</span>
        </div>
      </footer>
    </div>
  );
}
