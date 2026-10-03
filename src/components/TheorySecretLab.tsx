import React, { useState } from 'react';
import { THEORY_QUESTIONS, TheoryQuestion, MUSICAL_KEYS } from '../data/musicTheoryData';
import { soundEngine } from '../utils/audioEngine';
import { StaffNoteGame } from './StaffNoteGame';
import { TonicQuizGame } from './TonicQuizGame';
import { RelativeScaleGraph } from './RelativeScaleGraph';
import { ChordMoodGame } from './ChordMoodGame';
import { Lightbulb, Sparkles, Play, CheckCircle2, Compass, Music, Trophy, ArrowRight, Volume2 } from 'lucide-react';

interface TheorySecretLabProps {
  initialSubTab?: 'concepts' | 'relative-graph' | 'chord-mood' | 'tonic-quiz' | 'game';
}

export const TheorySecretLab: React.FC<TheorySecretLabProps> = ({ initialSubTab = 'concepts' }) => {
  const [activeSubTab, setActiveSubTab] = useState<'concepts' | 'relative-graph' | 'chord-mood' | 'tonic-quiz' | 'game'>(initialSubTab);

  React.useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(THEORY_QUESTIONS[0].id);

  // Demo 1 State (음이름 vs 계이름)
  const [demo1Key, setDemo1Key] = useState<'C' | 'G' | 'F'>('G');
  const [demo1Lens, setDemo1Lens] = useState<'both' | 'name' | 'solfege'>('both');

  // Demo 2 State (온음/반음 계단)
  const [demo2WithSharp, setDemo2WithSharp] = useState<boolean>(true);

  // Demo 3 State (장조 vs 단조 3도 비교)
  const [demo3ChordType, setDemo3ChordType] = useState<'major' | 'minor'>('major');

  const question = THEORY_QUESTIONS.find(q => q.id === selectedQuestionId) || THEORY_QUESTIONS[0];

  const playDemo1Tonic = () => {
    if (demo1Key === 'G') soundEngine.playNote('G4', 1.0, 0, 0.35);
    else if (demo1Key === 'F') soundEngine.playNote('F4', 1.0, 0, 0.35);
    else soundEngine.playNote('C4', 1.0, 0, 0.35);
  };

  const playDemo2Scale = (withSharp: boolean) => {
    const notes = withSharp
      ? ['G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F#5', 'G5']
      : ['G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5'];

    notes.forEach((note, index) => {
      soundEngine.playNote(note, 0.6, index * 0.35, 0.3);
    });
  };

  const playDemo3Chord = (type: 'major' | 'minor') => {
    if (type === 'major') {
      soundEngine.playChord(['C4', 'E4', 'G4'], 1.6, 0.03, 0.3);
    } else {
      soundEngine.playChord(['C4', 'D#4', 'G4'], 1.6, 0.03, 0.3);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Teacher / Student Empathy & Subtab Switcher */}
      <div className="bg-white border-2 border-amber-300/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-xs shrink-0">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-jua">
                💡 "선생님, 이게 왜 이래요?" 음계와 화음 비밀 해결소
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed font-medium">
                음이름과 계이름의 차이, 샵과 플랫의 비밀, 화음과 소리의 어울림을 풀고 <strong>오선지 음표 맞추기 게임</strong>도 즐겨보세요!
              </p>
            </div>
          </div>

          {/* Subtab Segmented Switcher */}
          <div className="flex items-center gap-1.5 bg-[#F8F9FA] p-1.5 rounded-2xl border border-slate-200 self-start sm:self-center shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveSubTab('concepts')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer font-jua ${
                activeSubTab === 'concepts'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>음계와 화음 비밀 도감</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('relative-graph')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer font-jua ${
                activeSubTab === 'relative-graph'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>🌀 나란한 조와 으뜸음 이동</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('chord-mood')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer font-jua ${
                activeSubTab === 'chord-mood'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>👂 밝은 화음 vs 쓸쓸한 화음 맞추기</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('tonic-quiz')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer font-jua ${
                activeSubTab === 'tonic-quiz'
                  ? 'bg-orange-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>🎹 조표 보고 으뜸음 건반 찾기</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('game')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer font-jua ${
                activeSubTab === 'game'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>🎯 오선지 음표 맞추기 (C·G·D)</span>
            </button>
          </div>
        </div>

        {/* Question Selector Tabs (3x2 그리드) */}
        {activeSubTab === 'concepts' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2 border-t border-amber-100">
            {THEORY_QUESTIONS.map(q => {
              const isSelected = q.id === selectedQuestionId;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setSelectedQuestionId(q.id)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50 border-amber-500 shadow-2xs text-slate-900 translate-y-[-2px]'
                      : 'bg-[#F8F9FA] border-slate-200 hover:bg-white text-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">
                    {q.category}
                  </span>
                  <h3 className="font-black text-xs sm:text-sm text-slate-900 mt-1.5 line-clamp-2 font-jua">
                    {q.question}
                  </h3>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Render Active Subtab Content */}
      {activeSubTab === 'relative-graph' ? (
        <RelativeScaleGraph />
      ) : activeSubTab === 'chord-mood' ? (
        <ChordMoodGame />
      ) : activeSubTab === 'tonic-quiz' ? (
        <TonicQuizGame />
      ) : activeSubTab === 'game' ? (
        <StaffNoteGame />
      ) : (
        /* 2. Interactive Explanation Stage */
        <div className="bg-white rounded-3xl border-2 border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
              {question.category} 명쾌한 해답
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 font-jua">
              {question.question}
            </h3>
            <div className="mt-2.5 p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl text-slate-900 text-sm font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
              <span>{question.summary}</span>
            </div>
            <div className="mt-2.5 text-xs sm:text-sm text-slate-700 bg-[#F8F9FA] p-3 rounded-xl border border-slate-200 leading-relaxed">
              <strong className="text-amber-900">어린이 눈높이 비유: </strong> {question.analogy}
            </div>
          </div>

          {/* 3. Dynamic Interactive Sandbox */}
          {question.id === 'name-vs-solfege' && (
            <div className="bg-[#FFFDF9] rounded-2xl p-5 border-2 border-amber-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-black text-base text-slate-900 flex items-center gap-2 font-jua">
                    <Compass className="w-5 h-5 text-amber-600" />
                    직접 해보는 [음이름 vs 계이름] 렌즈 실험기
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    나라(조)를 바꾸면 건반의 역할(계이름)이 어떻게 변하는지 눈으로 확인해보세요.
                  </p>
                </div>

                {/* Lens Mode Toggle */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setDemo1Lens('both')}
                    className={`px-3 py-1 rounded-lg font-black cursor-pointer transition-all ${
                      demo1Lens === 'both' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    둘 다 보기
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemo1Lens('name')}
                    className={`px-3 py-1 rounded-lg font-black cursor-pointer transition-all ${
                      demo1Lens === 'name' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    음이름만 (불변 주소)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemo1Lens('solfege')}
                    className={`px-3 py-1 rounded-lg font-black cursor-pointer transition-all ${
                      demo1Lens === 'solfege' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    계이름만 (이동도법)
                  </button>
                </div>
              </div>

              {/* Key Selector */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-slate-700">나라(조) 선택:</span>
                <button
                  type="button"
                  onClick={() => setDemo1Key('C')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all font-jua ${
                    demo1Key === 'C' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  ☀️ 다장조 나라 (다/C가 대장)
                </button>
                <button
                  type="button"
                  onClick={() => setDemo1Key('G')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all font-jua ${
                    demo1Key === 'G' ? 'bg-amber-500 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  🍀 사장조 나라 (사/G가 대장 - 네잎클로버)
                </button>
                <button
                  type="button"
                  onClick={() => setDemo1Key('F')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all font-jua ${
                    demo1Key === 'F' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  🌸 바장조 나라 (바/F가 대장)
                </button>
              </div>

              {/* Visual Transformation Box */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200 space-y-3.5">
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  현재 <strong className="text-amber-800 font-black">{demo1Key === 'G' ? '사장조' : demo1Key === 'F' ? '바장조' : '다장조'} 나라</strong>에서는
                  흰건반 <strong className="text-blue-700 font-black">{demo1Key === 'G' ? '사(G)' : demo1Key === 'F' ? '바(F)' : '다(C)'}</strong> 음이
                  새로운 가족의 첫째 대장인 <strong className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded font-black font-jua text-sm">"도"</strong>가 됩니다!
                </div>

                {/* Note comparison cards */}
                <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                  {[
                    { baseName: 'C', korean: '다', gSolfege: '파', fSolfege: '솔', cSolfege: '도' },
                    { baseName: 'D', korean: '라', gSolfege: '솔', fSolfege: '라', cSolfege: '레' },
                    { baseName: 'E', korean: '마', gSolfege: '라', fSolfege: '시', cSolfege: '미' },
                    { baseName: 'F', korean: '바', gSolfege: '시(F#)', fSolfege: '도', cSolfege: '파' },
                    { baseName: 'G', korean: '사', gSolfege: '도👑', fSolfege: '레', cSolfege: '솔' },
                    { baseName: 'A', korean: '가', gSolfege: '레', fSolfege: '미', cSolfege: '라' },
                    { baseName: 'B', korean: '나', gSolfege: '미', fSolfege: '파(Bb)', cSolfege: '시' },
                  ].map(item => {
                    const solfege = demo1Key === 'G' ? item.gSolfege : demo1Key === 'F' ? item.fSolfege : item.cSolfege;
                    const isTonic = (demo1Key === 'G' && item.baseName === 'G') ||
                                    (demo1Key === 'F' && item.baseName === 'F') ||
                                    (demo1Key === 'C' && item.baseName === 'C');

                    return (
                      <div
                        key={item.baseName}
                        onClick={() => soundEngine.playNote(`${item.baseName}4`, 0.8, 0, 0.3)}
                        className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                          isTonic
                            ? 'bg-amber-100 border-amber-400 shadow-xs'
                            : 'bg-white border-slate-200 hover:bg-amber-50/50'
                        }`}
                      >
                        {(demo1Lens === 'both' || demo1Lens === 'name') && (
                          <div className="text-[11px] text-slate-500 font-bold">
                            음이름: <span className="font-black text-slate-900">{item.korean}({item.baseName})</span>
                          </div>
                        )}
                        {(demo1Lens === 'both' || demo1Lens === 'solfege') && (
                          <div className="text-lg font-black text-amber-900 mt-1 font-jua">
                            {solfege}
                          </div>
                        )}
                        {isTonic && (
                          <span className="text-[10px] font-black text-white bg-amber-600 px-1.5 py-0.2 rounded-md mt-1 inline-block">
                            으뜸음 대장!
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs sm:text-sm text-blue-950 space-y-1">
                  <strong className="text-blue-900 font-black font-jua text-sm">📌 "그럼 악보에서 레로 되어 있으면 솔로 부르는 건가요?" 완벽 정리:</strong>
                  <p className="leading-relaxed font-medium">
                    <strong>노래 부를 때(계이름):</strong> 사장조 노래를 부를 때는 G음 위치를 보고 "도~", D음 위치를 보고 "솔~"이라고 불러요 (이동도법)!<br />
                    <strong>악기 연주할 때(음이름):</strong> 멜로디언이나 리코더, 건반을 칠 때는 피아노의 원래 G건반(사), D건반(라)을 찾아서 손가락으로 누르는 거예요!
                  </p>
                </div>
              </div>
            </div>
          )}

          {question.id === 'step-stairs' && (
            <div className="bg-[#FFFDF9] rounded-2xl p-5 border-2 border-amber-200 space-y-4">
              <div>
                <h4 className="font-black text-base text-slate-900 flex items-center gap-2 font-jua">
                  <Music className="w-5 h-5 text-amber-600" />
                  귀로 직접 듣는 [온음/반음 황금 계단] 비교 실험실
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  왜 사장조에서는 F#이 꼭 필요할까요? 샵이 없을 때의 어색한 소리와 샵이 있을 때의 완벽한 소리를 비교해보세요!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bad Sound Card */}
                <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-black text-rose-900 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200">
                      ❌ F#(올림표) 없이 그냥 쳤을 때
                    </span>
                    <h5 className="font-black text-base text-slate-900 mt-2 font-jua">어딘가 이상하고 처진 소리!</h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                      솔-라-시-도-레-미-<strong>파(F제자리)</strong>-솔을 치면 미와 파가 반음이 되고 파와 솔이 온음이 되어 끄트머리가 축 처져요.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => playDemo2Scale(false)}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs cursor-pointer shadow-2xs active:scale-95 font-jua"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>이상한 소리 들어보기 (F# 없음)</span>
                  </button>
                </div>

                {/* Good Sound Card */}
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      ✅ F#(올림표)를 붙여서 쳤을 때
                    </span>
                    <h5 className="font-black text-base text-slate-900 mt-2 font-jua">우리가 아는 밝고 완벽한 도레미파!</h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                      7번째 음인 파를 반음 올려 <strong>F#(파#)</strong>으로 만들어주면 7-8음이 딱 예쁜 반음이 되며 상쾌하게 완성돼요!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => playDemo2Scale(true)}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs cursor-pointer shadow-2xs active:scale-95 font-jua"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>바른 사장조 음계 들어보기 (F# 포함)</span>
                  </button>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-200 text-xs sm:text-sm text-slate-700 space-y-1">
                <strong className="text-slate-900 font-black block font-jua text-sm">
                  🔑 장음계의 황금 공식: [온 - 온 - 반(3-4) - 온 - 온 - 온 - 반(7-8)]
                </strong>
                <p className="leading-relaxed font-medium">
                  시작점(으뜸음)을 솔(사장조)이나 레(라장조)로 바꾸면, 피아노의 흰건반 위치만으로는 3-4번과 7-8번 반음 자리가 어긋나게 돼요.
                  그 자리를 원래 장음계의 황금 반음으로 맞춰주기 위해 <strong>샵(#)이나 플랫(b)</strong>이 탄생한 것이랍니다!
                </p>
              </div>
            </div>
          )}

          {question.id === 'major-vs-minor' && (
            <div className="bg-[#FFFDF9] rounded-2xl p-5 border-2 border-amber-200 space-y-4">
              <div>
                <h4 className="font-black text-base text-slate-900 flex items-center gap-2 font-jua">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  장조(햇살 ☀️) vs 단조(달빛 🌙) 3도 울림 비교기
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  장조와 단조는 단 1개 건반(반음)의 차이로 완전히 다른 분위기를 만들어냅니다!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setDemo3ChordType('major');
                    playDemo3Chord('major');
                  }}
                  className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    demo3ChordType === 'major'
                      ? 'bg-amber-100/90 border-amber-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">☀️</span>
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950">
                      장3화음 (Major)
                    </span>
                  </div>
                  <h5 className="text-base sm:text-lg font-black text-slate-900 mt-2 font-jua">다장조 으뜸화음: 도-미-솔</h5>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed font-medium">
                    도와 미 사이가 <strong>4반음(넓은 장3도)</strong>! 햇살이 활짝 비치는 맑고 씩씩한 울림입니다.
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs sm:text-sm font-black text-amber-900 font-jua">
                    <Play className="w-4 h-4 fill-amber-700" />
                    <span>장조 소리 듣기</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDemo3ChordType('minor');
                    playDemo3Chord('minor');
                  }}
                  className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    demo3ChordType === 'minor'
                      ? 'bg-indigo-100/90 border-indigo-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">🌙</span>
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-indigo-200 text-indigo-950">
                      단3화음 (minor)
                    </span>
                  </div>
                  <h5 className="text-base sm:text-lg font-black text-slate-900 mt-2 font-jua">다단조 으뜸화음: 도-미b-솔</h5>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed font-medium">
                    가운데 '미' 음이 반음 낮아져 <strong>3반음(좁은 단3도)</strong>이 됨! 밤하늘처럼 은은하고 아련해집니다.
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs sm:text-sm font-black text-indigo-900 font-jua">
                    <Play className="w-4 h-4 fill-indigo-700" />
                    <span>단조 소리 듣기</span>
                  </div>
                </button>
              </div>

              <div className="p-3.5 bg-white border border-amber-200 rounded-2xl text-xs sm:text-sm text-slate-700 space-y-1">
                <strong className="text-slate-900 font-black font-jua text-sm">📖 교과서 곡과의 연결:</strong>
                <p className="leading-relaxed font-medium">
                  교과서 <span className="font-black text-amber-800">&lt;네잎클로버&gt;</span>는 장조라서 활기차고,
                  교과서 <span className="font-black text-indigo-800">&lt;별 보며 달 보며&gt;</span>는 라단조(D minor)라서
                  레-파-라의 차분하고 서정적인 별빛 느낌이 나는 것이에요!
                </p>
              </div>

              {/* Call-to-Action to D3 Relative Scale Graph */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                <div>
                  <h5 className="font-black text-base sm:text-lg font-jua flex items-center gap-1.5">
                    <span>🌀 나란한 조와 으뜸음 이동 시각화 보기</span>
                  </h5>
                  <p className="text-xs text-indigo-100 font-medium mt-0.5">
                    바장조에서 3반음 아래 라단조로 이동하는 으뜸음의 원리를 그래픽과 소리로 체험해보세요!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('relative-graph')}
                  className="px-4 py-2.5 bg-white hover:bg-indigo-50 text-indigo-950 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer font-jua shadow-sm shrink-0 flex items-center gap-1.5"
                >
                  <span>으뜸음 이동 그래프 보기</span>
                  <ArrowRight className="w-4 h-4 text-indigo-700" />
                </button>
              </div>

              {/* Call-to-Action to Chord Mood Sound Match Game */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                <div>
                  <h5 className="font-black text-base sm:text-lg font-jua flex items-center gap-1.5">
                    <span>👂 밝은 화음(장화음) vs 쓸쓸한 화음(단화음) 소리 맞추기 도전!</span>
                  </h5>
                  <p className="text-xs text-amber-100 font-medium mt-0.5">
                    화음 소리를 귀 기울여 듣고 밝고 신나는지, 차분하고 쓸쓸한지 바로 맞춰보세요!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('chord-mood')}
                  className="px-4 py-2.5 bg-white hover:bg-amber-50 text-amber-950 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer font-jua shadow-sm shrink-0 flex items-center gap-1.5"
                >
                  <span>소리 맞추기 퀴즈 풀기</span>
                  <ArrowRight className="w-4 h-4 text-amber-700" />
                </button>
              </div>
            </div>
          )}

          {question.id === 'key-signature-rule' && (
            <div className="bg-[#FFFDF9] rounded-2xl p-5 border-2 border-amber-200 space-y-4">
              <div>
                <h4 className="font-black text-base text-slate-900 flex items-center gap-2 font-jua">
                  <Compass className="w-5 h-5 text-amber-600" />
                  조표 보고 으뜸음 1초 만에 찾는 마법 공식
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  악보 앞머리에 샵이나 플랫이 잔뜩 붙어있어도 이 공식만 알면 누구나 바로 "도"를 찾습니다!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-200 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-amber-500 text-white font-black text-base flex items-center justify-center font-jua shadow-2xs">
                      #
                    </span>
                    <h5 className="font-black text-base text-slate-900 font-jua">올림표(#)의 마법 공식</h5>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
                    <p className="p-2.5 bg-amber-50 rounded-xl text-amber-950 font-black font-jua">
                      👉 "맨 마지막에 붙은 샵(#)의 바로 윗음이 '도'!"
                    </p>
                    <ul className="list-disc pl-5 space-y-1 font-medium">
                      <li>#이 1개(파#): 파# 바로 윗음은 <strong>솔(사)</strong>! ➔ <strong>사장조!</strong></li>
                      <li>#이 2개(파#, 도#): 마지막 도# 바로 윗음은 <strong>레(라)</strong>! ➔ <strong>라장조!</strong></li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-200 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-base flex items-center justify-center font-jua shadow-2xs">
                      b
                    </span>
                    <h5 className="font-black text-base text-slate-900 font-jua">내림표(b)의 마법 공식</h5>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
                    <p className="p-2.5 bg-blue-50 rounded-xl text-blue-950 font-black font-jua">
                      👉 "끝에서 두 번째 플랫(b)이 '도'! (1개일 땐 4도 아래 파가 '도')"
                    </p>
                    <ul className="list-disc pl-5 space-y-1 font-medium">
                      <li>b이 1개(시b): 4도 아래인 <strong>파(바)</strong>가 도! ➔ <strong>바장조!</strong></li>
                      <li>b이 2개(시b, 미b): 끝에서 두 번째인 <strong>시b(내림나)</strong>가 도! ➔ <strong>내림나장조!</strong></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4 sm:p-5 space-y-2">
                <span className="text-xs font-black text-indigo-950 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-300 font-jua">
                  🌙 단조(나란한 조)를 찾는 비밀:
                </span>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  조표가 같은 장조의 으뜸음 "도"에서 <strong>3반음(단3도) 아래로 쏙 내려가면</strong> 그 자리가 바로 단조의 으뜸음 "라"가 돼요!<br />
                  • 다장조(도) ➔ 3반음 아래: <strong>가(A)</strong> ➔ <strong>가단조!</strong><br />
                  • 바장조(파) ➔ 3반음 아래: <strong>라(D)</strong> ➔ <strong>라단조!</strong>
                </p>
              </div>

              {/* Call-to-Action to try Tonic Quiz */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                <div>
                  <h5 className="font-black text-base sm:text-lg font-jua flex items-center gap-1.5">
                    <span>🎹 방금 배운 마법 공식을 가상 건반으로 연습해볼까요?</span>
                  </h5>
                  <p className="text-xs text-amber-100 font-medium mt-0.5">
                    무작위 조표를 보고 으뜸음(도/라)을 건반에서 직접 짚어보는 신나는 퀴즈 훈련소가 준비되어 있어요!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('tonic-quiz')}
                  className="px-4 py-2.5 bg-white hover:bg-amber-50 text-amber-950 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer font-jua shadow-sm shrink-0 flex items-center gap-1.5"
                >
                  <span>으뜸음 건반 퀴즈 시작</span>
                  <ArrowRight className="w-4 h-4 text-amber-700" />
                </button>
              </div>
            </div>
          )}

          {/* 4. Detailed explanation bullet points */}
          <div className="space-y-2.5 pt-2">
            <h4 className="font-black text-sm text-slate-900 font-jua">자세히 알아보기:</h4>
            <div className="space-y-2">
              {question.details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
