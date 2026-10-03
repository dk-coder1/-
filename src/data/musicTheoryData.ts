export interface ScaleNote {
  degree: number;
  solfege: string;
  pitch: string;
  koreanName: string;
  engName: string;
  isAccidental: boolean;
  accidentalType?: '#' | 'b';
  stepTypeAfter?: 'whole' | 'half';
}

export interface VoicingPosition {
  notes: string[];
  solfege: string[];
  koreanNames: string[];
  fingersRight: number[];
}

export interface ChordVoicing {
  id: string;
  symbol: string; // 'I', 'IV', 'V', 'i', 'iv'
  name: string; // '으뜸화음 (토닉)', '버금딸림화음', '딸림화음'
  rootName: string;
  function: string;
  rootPosition: VoicingPosition;
  textbookPosition: VoicingPosition;
}

export interface KeySignature {
  sharps: string[];
  flats: string[];
  textbookRule: string;
}

export interface MusicalKey {
  id: string;
  name: string;
  shortName: string;
  mode: 'major' | 'minor';
  icon: string;
  tonicPitch: string;
  tonicKorean: string;
  tonicSolfege: string;
  vibe: string;
  textbookReference?: string;
  keySignature: KeySignature;
  scaleNotes: ScaleNote[];
  primaryChords: ChordVoicing[];
}

export interface SongNote {
  note: string;
  solfege: string; // 이동도법 (조성 으뜸음 기준)
  fixedSolfege?: string; // 고정도법 (실제 건반음 기준)
  duration: number; // in beats
}

export interface SongMeasure {
  measureNum: number;
  lyrics: string;
  chords: string;
  melodyNotes: SongNote[];
  harmonyNotes?: SongNote[];
}

export interface TextbookSong {
  id: string;
  title: string;
  subtitle: string;
  composer: string;
  description: string;
  keyId: string;
  timeSignature: string;
  measures: SongMeasure[];
}

export interface TheoryQuestion {
  id: string;
  category: string;
  question: string;
  summary: string;
  analogy: string;
  details: string[];
}

export const MUSICAL_KEYS: Record<string, MusicalKey> = {
  // 1. 다장조 (C Major)
  'c-major': {
    id: 'c-major',
    name: '다장조 (C Major)',
    shortName: '다장조',
    mode: 'major',
    icon: '☀️',
    tonicPitch: 'C',
    tonicKorean: '다',
    tonicSolfege: '도',
    vibe: '햇살처럼 밝고 씩씩하며 당당한 모든 음악의 기초',
    textbookReference: '초등 3~6 음악 교과서 공통 기본 조',
    keySignature: {
      sharps: [],
      flats: [],
      textbookRule: '조표가 아무것도 붙지 않아요! 흰건반 "다(C)"가 그대로 으뜸음 "도"가 됩니다.'
    },
    scaleNotes: [
      { degree: 1, solfege: '도', pitch: 'C4', koreanName: '다', engName: 'C', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 2, solfege: '레', pitch: 'D4', koreanName: '라', engName: 'D', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 3, solfege: '미', pitch: 'E4', koreanName: '마', engName: 'E', isAccidental: false, stepTypeAfter: 'half' },
      { degree: 4, solfege: '파', pitch: 'F4', koreanName: '바', engName: 'F', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 5, solfege: '솔', pitch: 'G4', koreanName: '사', engName: 'G', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 6, solfege: '라', pitch: 'A4', koreanName: '가', engName: 'A', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 7, solfege: '시', pitch: 'B4', koreanName: '나', engName: 'B', isAccidental: false, stepTypeAfter: 'half' },
      { degree: 8, solfege: '도', pitch: 'C5', koreanName: '다', engName: 'C', isAccidental: false }
    ],
    primaryChords: [
      {
        id: 'c-i',
        symbol: 'I',
        name: '으뜸화음 (C)',
        rootName: '다 (C)',
        function: '집과 같은 편안함과 안정감을 주는 중심 화음',
        rootPosition: {
          notes: ['C4', 'E4', 'G4'],
          solfege: ['도', '미', '솔'],
          koreanNames: ['다', '마', '사'],
          fingersRight: [1, 3, 5]
        },
        textbookPosition: {
          notes: ['C4', 'E4', 'G4'],
          solfege: ['도', '미', '솔'],
          koreanNames: ['다', '마', '사'],
          fingersRight: [1, 3, 5]
        }
      },
      {
        id: 'c-iv',
        symbol: 'IV',
        name: '버금딸림화음 (F)',
        rootName: '바 (F)',
        function: '집을 떠나 새로운 여행을 시작하는 열린 느낌',
        rootPosition: {
          notes: ['F4', 'A4', 'C5'],
          solfege: ['파', '라', '도'],
          koreanNames: ['바', '가', '다'],
          fingersRight: [1, 3, 5]
        },
        textbookPosition: {
          notes: ['C4', 'F4', 'A4'],
          solfege: ['도', '파', '라'],
          koreanNames: ['다', '바', '가'],
          fingersRight: [1, 2, 5]
        }
      },
      {
        id: 'c-v',
        symbol: 'V',
        name: '딸림화음 (G)',
        rootName: '사 (G)',
        function: '긴장감이 최고조에 달해 으뜸화음(I)으로 돌아가려는 힘',
        rootPosition: {
          notes: ['G4', 'B4', 'D5'],
          solfege: ['솔', '시', '레'],
          koreanNames: ['사', '나', '라'],
          fingersRight: [1, 3, 5]
        },
        textbookPosition: {
          notes: ['B3', 'D4', 'G4'],
          solfege: ['시', '레', '솔'],
          koreanNames: ['나', '라', '사'],
          fingersRight: [1, 2, 5]
        }
      }
    ]
  },

  // 2. 사장조 (G Major) - 교과서 14~15쪽 <네잎클로버>
  'g-major': {
    id: 'g-major',
    name: '사장조 (G Major)',
    shortName: '사장조',
    mode: 'major',
    icon: '🍀',
    tonicPitch: 'G',
    tonicKorean: '사',
    tonicSolfege: '도',
    vibe: '네잎클로버처럼 희망차고 푸른 새싹이 돋아나는 싱그러운 울림',
    textbookReference: '교과서 14~15쪽 <네잎클로버>',
    keySignature: {
      sharps: ['F#'],
      flats: [],
      textbookRule: '올림표(#)가 1개(파#) 붙어요! #의 바로 윗음인 "사(G)"가 으뜸음 "도"가 됩니다.'
    },
    scaleNotes: [
      { degree: 1, solfege: '도', pitch: 'G4', koreanName: '사', engName: 'G', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 2, solfege: '레', pitch: 'A4', koreanName: '가', engName: 'A', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 3, solfege: '미', pitch: 'B4', koreanName: '나', engName: 'B', isAccidental: false, stepTypeAfter: 'half' },
      { degree: 4, solfege: '파', pitch: 'C5', koreanName: '다', engName: 'C', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 5, solfege: '솔', pitch: 'D5', koreanName: '라', engName: 'D', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 6, solfege: '라', pitch: 'E5', koreanName: '마', engName: 'E', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 7, solfege: '시', pitch: 'F#5', koreanName: '올림바', engName: 'F#', isAccidental: true, accidentalType: '#', stepTypeAfter: 'half' },
      { degree: 8, solfege: '도', pitch: 'G5', koreanName: '사', engName: 'G', isAccidental: false }
    ],
    primaryChords: [
      {
        id: 'g-i',
        symbol: 'I',
        name: '으뜸화음 (G)',
        rootName: '사 (G)',
        function: '사장조의 가장 기본이 되는 밝고 안정된 중심 화음',
        rootPosition: {
          notes: ['G4', 'B4', 'D5'],
          solfege: ['도', '미', '솔'],
          koreanNames: ['사', '나', '라'],
          fingersRight: [1, 3, 5]
        },
        textbookPosition: {
          notes: ['D4', 'G4', 'B4'],
          solfege: ['솔', '도', '미'],
          koreanNames: ['라', '사', '나'],
          fingersRight: [1, 2, 5]
        }
      },
      {
        id: 'g-iv',
        symbol: 'IV',
        name: '버금딸림화음 (C)',
        rootName: '다 (C)',
        function: '경쾌하게 분위기를 활짝 열어주는 전개 화음',
        rootPosition: {
          notes: ['C4', 'E4', 'G4'],
          solfege: ['파', '라', '도'],
          koreanNames: ['다', '마', '사'],
          fingersRight: [1, 3, 5]
        },
        textbookPosition: {
          notes: ['C4', 'E4', 'G4'],
          solfege: ['파', '라', '도'],
          koreanNames: ['다', '마', '사'],
          fingersRight: [1, 3, 5]
        }
      },
      {
        id: 'g-v',
        symbol: 'V',
        name: '딸림화음 (D)',
        rootName: '라 (D)',
        function: '도(G)로 달려가고 싶어 하는 강한 이끌림의 긴장 화음',
        rootPosition: {
          notes: ['D4', 'F#4', 'A4'],
          solfege: ['솔', '시', '레'],
          koreanNames: ['라', '올림바', '가'],
          fingersRight: [1, 3, 5]
        },
        textbookPosition: {
          notes: ['D4', 'F#4', 'A4'],
          solfege: ['솔', '시', '레'],
          koreanNames: ['라', '올림바', '가'],
          fingersRight: [1, 2, 5]
        }
      }
    ]
  },

  // 3. 라단조 (D minor) - 교과서 50~51쪽 <별 보며 달 보며>
  'd-minor': {
    id: 'd-minor',
    name: '라단조 (D minor)',
    shortName: '라단조',
    mode: 'minor',
    icon: '🌙',
    tonicPitch: 'D',
    tonicKorean: '라',
    tonicSolfege: '라',
    vibe: '달빛 아래 별들이 속삭이듯 은은하고 차분하며 아련한 쓸쓸함',
    textbookReference: '교과서 50~51쪽 <별 보며 달 보며>',
    keySignature: {
      sharps: [],
      flats: ['Bb'],
      textbookRule: '내림표(b)가 1개(시b) 붙어요! 바장조의 나란한 조로서 으뜸음은 "라(D)"가 됩니다.'
    },
    scaleNotes: [
      { degree: 1, solfege: '라', pitch: 'D4', koreanName: '라', engName: 'D', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 2, solfege: '시', pitch: 'E4', koreanName: '마', engName: 'E', isAccidental: false, stepTypeAfter: 'half' },
      { degree: 3, solfege: '도', pitch: 'F4', koreanName: '바', engName: 'F', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 4, solfege: '레', pitch: 'G4', koreanName: '사', engName: 'G', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 5, solfege: '미', pitch: 'A4', koreanName: '가', engName: 'A', isAccidental: false, stepTypeAfter: 'half' },
      { degree: 6, solfege: '파', pitch: 'A#4', koreanName: '내림나', engName: 'Bb', isAccidental: true, accidentalType: 'b', stepTypeAfter: 'whole' },
      { degree: 7, solfege: '솔', pitch: 'C5', koreanName: '다', engName: 'C', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 8, solfege: '라', pitch: 'D5', koreanName: '라', engName: 'D', isAccidental: false }
    ],
    primaryChords: [
      {
        id: 'dm-i',
        symbol: 'i',
        name: '으뜸화음 (Dm)',
        rootName: '라 (D)',
        function: '달빛처럼 차분하고 서정적인 라단조의 중심 화음',
        rootPosition: {
          notes: ['D4', 'F4', 'A4'],
          solfege: ['라', '도', '미'],
          koreanNames: ['라', '바', '가'],
          fingersRight: [1, 3, 5]
        },
        textbookPosition: {
          notes: ['D4', 'F4', 'A4'],
          solfege: ['라', '도', '미'],
          koreanNames: ['라', '바', '가'],
          fingersRight: [1, 3, 5]
        }
      },
      {
        id: 'dm-iv',
        symbol: 'iv',
        name: '버금딸림화음 (Gm)',
        rootName: '사 (G)',
        function: '깊은 밤하늘처럼 감정이 더욱 애틋해지는 화음',
        rootPosition: {
          notes: ['G4', 'A#4', 'D5'],
          solfege: ['레', '파', '라'],
          koreanNames: ['사', '내림나', '라'],
          fingersRight: [1, 3, 5]
        },
        textbookPosition: {
          notes: ['D4', 'G4', 'A#4'],
          solfege: ['라', '레', '파'],
          koreanNames: ['라', '사', '내림나'],
          fingersRight: [1, 2, 5]
        }
      },
      {
        id: 'dm-v',
        symbol: 'V',
        name: '딸림화음 (A)',
        rootName: '가 (A)',
        function: '단조의 쓸쓸함을 이겨내고 으뜸화음으로 돌아가는 화성적 긴장',
        rootPosition: {
          notes: ['A4', 'C#5', 'E5'],
          solfege: ['미', '솔#', '시'],
          koreanNames: ['가', '올림다', '마'],
          fingersRight: [1, 3, 5]
        },
        textbookPosition: {
          notes: ['C#4', 'E4', 'A4'],
          solfege: ['솔#', '시', '미'],
          koreanNames: ['올림다', '마', '가'],
          fingersRight: [1, 2, 5]
        }
      }
    ]
  },

  // 4. 바장조 (F Major) - 교과서 수록곡
  'f-major': {
    id: 'f-major',
    name: '바장조 (F Major)',
    shortName: '바장조',
    mode: 'major',
    icon: '🌸',
    tonicPitch: 'F',
    tonicKorean: '바',
    tonicSolfege: '도',
    vibe: '따뜻한 봄바람과 푸른 들판처럼 온화하고 평화로운 울림',
    textbookReference: '초등 5학년 바장조 단원',
    keySignature: {
      sharps: [],
      flats: ['Bb'],
      textbookRule: '내림표(b)가 1개(시b) 붙어요! 시b에서 4도 아래인 "바(F)"가 으뜸음 "도"가 됩니다.'
    },
    scaleNotes: [
      { degree: 1, solfege: '도', pitch: 'F4', koreanName: '바', engName: 'F', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 2, solfege: '레', pitch: 'G4', koreanName: '사', engName: 'G', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 3, solfege: '미', pitch: 'A4', koreanName: '가', engName: 'A', isAccidental: false, stepTypeAfter: 'half' },
      { degree: 4, solfege: '파', pitch: 'A#4', koreanName: '내림나', engName: 'Bb', isAccidental: true, accidentalType: 'b', stepTypeAfter: 'whole' },
      { degree: 5, solfege: '솔', pitch: 'C5', koreanName: '다', engName: 'C', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 6, solfege: '라', pitch: 'D5', koreanName: '라', engName: 'D', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 7, solfege: '시', pitch: 'E5', koreanName: '마', engName: 'E', isAccidental: false, stepTypeAfter: 'half' },
      { degree: 8, solfege: '도', pitch: 'F5', koreanName: '바', engName: 'F', isAccidental: false }
    ],
    primaryChords: [
      {
        id: 'f-i',
        symbol: 'I',
        name: '으뜸화음 (F)',
        rootName: '바 (F)',
        function: '따뜻하고 부드러운 안식처',
        rootPosition: {
          notes: ['F4', 'A4', 'C5'],
          solfege: ['도', '미', '솔'],
          koreanNames: ['바', '가', '다'],
          fingersRight: [1, 3, 5]
        },
        textbookPosition: {
          notes: ['C4', 'F4', 'A4'],
          solfege: ['솔', '도', '미'],
          koreanNames: ['다', '바', '가'],
          fingersRight: [1, 2, 5]
        }
      },
      {
        id: 'f-iv',
        symbol: 'IV',
        name: '버금딸림화음 (Bb)',
        rootName: '내림나 (Bb)',
        function: '시원하게 펼쳐지는 포근함',
        rootPosition: {
          notes: ['A#4', 'D5', 'F5'],
          solfege: ['파', '라', '도'],
          koreanNames: ['내림나', '라', '바'],
          fingersRight: [1, 3, 5]
        },
        textbookPosition: {
          notes: ['D4', 'F4', 'A#4'],
          solfege: ['라', '도', '파'],
          koreanNames: ['라', '바', '내림나'],
          fingersRight: [1, 2, 5]
        }
      },
      {
        id: 'f-v',
        symbol: 'V',
        name: '딸림화음 (C)',
        rootName: '다 (C)',
        function: '도(F)로 상쾌하게 귀결하는 화음',
        rootPosition: {
          notes: ['C4', 'E4', 'G4'],
          solfege: ['솔', '시', '레'],
          koreanNames: ['다', '마', '사'],
          fingersRight: [1, 3, 5]
        },
        textbookPosition: {
          notes: ['C4', 'E4', 'G4'],
          solfege: ['솔', '시', '레'],
          koreanNames: ['다', '마', '사'],
          fingersRight: [1, 3, 5]
        }
      }
    ]
  },

  // 5. 가단조 (A minor) - 다장조의 나란한 단조
  'a-minor': {
    id: 'a-minor',
    name: '가단조 (A minor)',
    shortName: '가단조',
    mode: 'minor',
    icon: '🍂',
    tonicPitch: 'A',
    tonicKorean: '가',
    tonicSolfege: '라',
    vibe: '낙엽이 지는 가을 저녁처럼 차분하고 고즈넉한 단조의 시작',
    textbookReference: '초등 5·6학년 단조 기초',
    keySignature: {
      sharps: [],
      flats: [],
      textbookRule: '다장조와 조표가 완전히 같아요(조표 없음)! 으뜸음은 "가(A)"이며 계이름 "라"로 시작합니다.'
    },
    scaleNotes: [
      { degree: 1, solfege: '라', pitch: 'A3', koreanName: '가', engName: 'A', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 2, solfege: '시', pitch: 'B3', koreanName: '나', engName: 'B', isAccidental: false, stepTypeAfter: 'half' },
      { degree: 3, solfege: '도', pitch: 'C4', koreanName: '다', engName: 'C', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 4, solfege: '레', pitch: 'D4', koreanName: '라', engName: 'D', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 5, solfege: '미', pitch: 'E4', koreanName: '마', engName: 'E', isAccidental: false, stepTypeAfter: 'half' },
      { degree: 6, solfege: '파', pitch: 'F4', koreanName: '바', engName: 'F', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 7, solfege: '솔', pitch: 'G4', koreanName: '사', engName: 'G', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 8, solfege: '라', pitch: 'A4', koreanName: '가', engName: 'A', isAccidental: false }
    ],
    primaryChords: [
      {
        id: 'am-i',
        symbol: 'i',
        name: '으뜸화음 (Am)',
        rootName: '가 (A)',
        function: '가단조의 차분하고 쓸쓸한 기준점',
        rootPosition: {
          notes: ['A3', 'C4', 'E4'],
          solfege: ['라', '도', '미'],
          koreanNames: ['가', '다', '마'],
          fingersRight: [1, 3, 5]
        },
        textbookPosition: {
          notes: ['A3', 'C4', 'E4'],
          solfege: ['라', '도', '미'],
          koreanNames: ['가', '다', '마'],
          fingersRight: [1, 3, 5]
        }
      },
      {
        id: 'am-iv',
        symbol: 'iv',
        name: '버금딸림화음 (Dm)',
        rootName: '라 (D)',
        function: '깊은 서정미를 더해주는 화음',
        rootPosition: {
          notes: ['D4', 'F4', 'A4'],
          solfege: ['레', '파', '라'],
          koreanNames: ['라', '바', '가'],
          fingersRight: [1, 3, 5]
        },
        textbookPosition: {
          notes: ['A3', 'D4', 'F4'],
          solfege: ['라', '레', '파'],
          koreanNames: ['가', '라', '바'],
          fingersRight: [1, 2, 5]
        }
      },
      {
        id: 'am-v',
        symbol: 'V',
        name: '딸림화음 (E)',
        rootName: '마 (E)',
        function: '강렬하게 가단조로 귀결하는 화음',
        rootPosition: {
          notes: ['E4', 'G#4', 'B4'],
          solfege: ['미', '솔#', '시'],
          koreanNames: ['마', '올림사', '나'],
          fingersRight: [1, 3, 5]
        },
        textbookPosition: {
          notes: ['G#3', 'B3', 'E4'],
          solfege: ['솔#', '시', '미'],
          koreanNames: ['올림사', '나', '마'],
          fingersRight: [1, 2, 5]
        }
      }
    ]
  },

  // 6. 라장조 (D Major) - # 2개
  'd-major': {
    id: 'd-major',
    name: '라장조 (D Major)',
    shortName: '라장조',
    mode: 'major',
    icon: '🎺',
    tonicPitch: 'D',
    tonicKorean: '라',
    tonicSolfege: '도',
    vibe: '황금빛 나팔 소리처럼 위풍당당하고 화려한 개선 행진곡의 울림',
    textbookReference: '초등 6학년 라장조 음계 단원',
    keySignature: {
      sharps: ['F#', 'C#'],
      flats: [],
      textbookRule: '올림표(#)가 2개(파#, 도#) 붙어요! 마지막 샵인 도# 바로 윗음인 "라(D)"가 으뜸음 "도"가 됩니다.'
    },
    scaleNotes: [
      { degree: 1, solfege: '도', pitch: 'D4', koreanName: '라', engName: 'D', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 2, solfege: '레', pitch: 'E4', koreanName: '마', engName: 'E', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 3, solfege: '미', pitch: 'F#4', koreanName: '올림바', engName: 'F#', isAccidental: true, accidentalType: '#', stepTypeAfter: 'half' },
      { degree: 4, solfege: '파', pitch: 'G4', koreanName: '사', engName: 'G', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 5, solfege: '솔', pitch: 'A4', koreanName: '가', engName: 'A', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 6, solfege: '라', pitch: 'B4', koreanName: '나', engName: 'B', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 7, solfege: '시', pitch: 'C#5', koreanName: '올림다', engName: 'C#', isAccidental: true, accidentalType: '#', stepTypeAfter: 'half' },
      { degree: 8, solfege: '도', pitch: 'D5', koreanName: '라', engName: 'D', isAccidental: false }
    ],
    primaryChords: [
      {
        id: 'd-i',
        symbol: 'I',
        name: '으뜸화음 (D)',
        rootName: '라 (D)',
        function: '찬란하고 당당한 시작과 끝',
        rootPosition: {
          notes: ['D4', 'F#4', 'A4'],
          solfege: ['도', '미', '솔'],
          koreanNames: ['라', '올림바', '가'],
          fingersRight: [1, 3, 5]
        },
        textbookPosition: {
          notes: ['D4', 'F#4', 'A4'],
          solfege: ['도', '미', '솔'],
          koreanNames: ['라', '올림바', '가'],
          fingersRight: [1, 3, 5]
        }
      },
      {
        id: 'd-iv',
        symbol: 'IV',
        name: '버금딸림화음 (G)',
        rootName: '사 (G)',
        function: '넓게 울려 퍼지는 행진의 전개',
        rootPosition: {
          notes: ['G4', 'B4', 'D5'],
          solfege: ['파', '라', '도'],
          koreanNames: ['사', '나', '라'],
          fingersRight: [1, 3, 5]
        },
        textbookPosition: {
          notes: ['D4', 'G4', 'B4'],
          solfege: ['도', '파', '라'],
          koreanNames: ['라', '사', '나'],
          fingersRight: [1, 2, 5]
        }
      },
      {
        id: 'd-v',
        symbol: 'V',
        name: '딸림화음 (A)',
        rootName: '가 (A)',
        function: '강렬하게 긴장을 고조시키는 종지 화음',
        rootPosition: {
          notes: ['A4', 'C#5', 'E5'],
          solfege: ['솔', '시', '레'],
          koreanNames: ['가', '올림다', '마'],
          fingersRight: [1, 3, 5]
        },
        textbookPosition: {
          notes: ['C#4', 'E4', 'A4'],
          solfege: ['시', '레', '솔'],
          koreanNames: ['올림다', '마', '가'],
          fingersRight: [1, 2, 5]
        }
      }
    ]
  },

  // 7. 마단조 (E minor) - 사장조의 나란한 단조 (# 1개)
  'e-minor': {
    id: 'e-minor',
    name: '마단조 (E minor)',
    shortName: '마단조',
    mode: 'minor',
    icon: '🌲',
    tonicPitch: 'E',
    tonicKorean: '마',
    tonicSolfege: '라',
    vibe: '깊은 숲속의 바람처럼 아련하고 사색적인 울림',
    textbookReference: '사장조와 나란한 조',
    keySignature: {
      sharps: ['F#'],
      flats: [],
      textbookRule: '사장조와 조표(# 1개)가 완전히 같아요! 으뜸음은 "마(E)" 음입니다.'
    },
    scaleNotes: [
      { degree: 1, solfege: '라', pitch: 'E4', koreanName: '마', engName: 'E', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 2, solfege: '시', pitch: 'F#4', koreanName: '올림바', engName: 'F#', isAccidental: true, accidentalType: '#', stepTypeAfter: 'half' },
      { degree: 3, solfege: '도', pitch: 'G4', koreanName: '사', engName: 'G', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 4, solfege: '레', pitch: 'A4', koreanName: '가', engName: 'A', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 5, solfege: '미', pitch: 'B4', koreanName: '나', engName: 'B', isAccidental: false, stepTypeAfter: 'half' },
      { degree: 6, solfege: '파', pitch: 'C5', koreanName: '다', engName: 'C', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 7, solfege: '솔', pitch: 'D5', koreanName: '라', engName: 'D', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 8, solfege: '라', pitch: 'E5', koreanName: '마', engName: 'E', isAccidental: false }
    ],
    primaryChords: [
      {
        id: 'em-i',
        symbol: 'i',
        name: '으뜸화음 (Em)',
        rootName: '마 (E)',
        function: '차분하고 깊은 울림의 중심',
        rootPosition: {
          notes: ['E4', 'G4', 'B4'],
          solfege: ['라', '도', '미'],
          koreanNames: ['마', '사', '나'],
          fingersRight: [1, 3, 5]
        },
        textbookPosition: {
          notes: ['E4', 'G4', 'B4'],
          solfege: ['라', '도', '미'],
          koreanNames: ['마', '사', '나'],
          fingersRight: [1, 3, 5]
        }
      },
      {
        id: 'em-iv',
        symbol: 'iv',
        name: '버금딸림화음 (Am)',
        rootName: '가 (A)',
        function: '애상적인 분위기의 고조',
        rootPosition: {
          notes: ['A4', 'C5', 'E5'],
          solfege: ['레', '파', '라'],
          koreanNames: ['가', '다', '마'],
          fingersRight: [1, 3, 5]
        },
        textbookPosition: {
          notes: ['E4', 'A4', 'C5'],
          solfege: ['라', '레', '파'],
          koreanNames: ['마', '가', '다'],
          fingersRight: [1, 2, 5]
        }
      },
      {
        id: 'em-v',
        symbol: 'V',
        name: '딸림화음 (B)',
        rootName: '나 (B)',
        function: '으뜸화음(Em)으로 안착시키는 종지력',
        rootPosition: {
          notes: ['B4', 'D#5', 'F#5'],
          solfege: ['미', '솔#', '시'],
          koreanNames: ['나', '올림라', '올림바'],
          fingersRight: [1, 3, 5]
        },
        textbookPosition: {
          notes: ['D#4', 'F#4', 'B4'],
          solfege: ['솔#', '시', '미'],
          koreanNames: ['올림라', '올림바', '나'],
          fingersRight: [1, 2, 5]
        }
      }
    ]
  },

  // 8. 내림나장조 (Bb Major) - b 2개
  'bb-major': {
    id: 'bb-major',
    name: '내림나장조 (Bb Major)',
    shortName: '내림나장조',
    mode: 'major',
    icon: '🎺',
    tonicPitch: 'Bb',
    tonicKorean: '내림나',
    tonicSolfege: '도',
    vibe: '금관악기와 재즈 밴드처럼 부드럽고 둥글며 풍성한 울림',
    textbookReference: '초등 6학년 플랫 확장 조',
    keySignature: {
      sharps: [],
      flats: ['Bb', 'Eb'],
      textbookRule: '플랫(b)이 2개(시b, 미b) 붙어요! 끝에서 두 번째 플랫인 "내림나(Bb)"가 으뜸음 "도"가 됩니다.'
    },
    scaleNotes: [
      { degree: 1, solfege: '도', pitch: 'A#3', koreanName: '내림나', engName: 'Bb', isAccidental: true, accidentalType: 'b', stepTypeAfter: 'whole' },
      { degree: 2, solfege: '레', pitch: 'C4', koreanName: '다', engName: 'C', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 3, solfege: '미', pitch: 'D4', koreanName: '라', engName: 'D', isAccidental: false, stepTypeAfter: 'half' },
      { degree: 4, solfege: '파', pitch: 'D#4', koreanName: '내림마', engName: 'Eb', isAccidental: true, accidentalType: 'b', stepTypeAfter: 'whole' },
      { degree: 5, solfege: '솔', pitch: 'F4', koreanName: '바', engName: 'F', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 6, solfege: '라', pitch: 'G4', koreanName: '사', engName: 'G', isAccidental: false, stepTypeAfter: 'whole' },
      { degree: 7, solfege: '시', pitch: 'A4', koreanName: '가', engName: 'A', isAccidental: false, stepTypeAfter: 'half' },
      { degree: 8, solfege: '도', pitch: 'A#4', koreanName: '내림나', engName: 'Bb', isAccidental: true, accidentalType: 'b' }
    ],
    primaryChords: [
      {
        id: 'bb-i',
        symbol: 'I',
        name: '으뜸화음 (Bb)',
        rootName: '내림나 (Bb)',
        function: '풍부하고 부드러운 중심 화음',
        rootPosition: {
          notes: ['A#3', 'D4', 'F4'],
          solfege: ['도', '미', '솔'],
          koreanNames: ['내림나', '라', '바'],
          fingersRight: [1, 3, 5]
        },
        textbookPosition: {
          notes: ['F3', 'A#3', 'D4'],
          solfege: ['솔', '도', '미'],
          koreanNames: ['바', '내림나', '라'],
          fingersRight: [1, 2, 5]
        }
      },
      {
        id: 'bb-iv',
        symbol: 'IV',
        name: '버금딸림화음 (Eb)',
        rootName: '내림마 (Eb)',
        function: '화려하고 넓게 펼쳐지는 화음',
        rootPosition: {
          notes: ['D#4', 'G4', 'A#4'],
          solfege: ['파', '라', '도'],
          koreanNames: ['내림마', '사', '내림나'],
          fingersRight: [1, 3, 5]
        },
        textbookPosition: {
          notes: ['D#4', 'G4', 'A#4'],
          solfege: ['파', '라', '도'],
          koreanNames: ['내림마', '사', '내림나'],
          fingersRight: [1, 2, 5]
        }
      },
      {
        id: 'bb-v',
        symbol: 'V',
        name: '딸림화음 (F)',
        rootName: '바 (F)',
        function: '으뜸화음(Bb)으로 인도하는 강력한 추진력',
        rootPosition: {
          notes: ['F4', 'A4', 'C5'],
          solfege: ['솔', '시', '레'],
          koreanNames: ['바', '가', '다'],
          fingersRight: [1, 3, 5]
        },
        textbookPosition: {
          notes: ['F4', 'A4', 'C5'],
          solfege: ['솔', '시', '레'],
          koreanNames: ['바', '가', '다'],
          fingersRight: [1, 3, 5]
        }
      }
    ]
  }
};

export const TEXTBOOK_SONGS: TextbookSong[] = [
  // 교과서 14~15쪽 <네잎클로버> (사장조, 박영신 작사/작곡, 경쾌하게 104 BPM)
  {
    id: 'four-leaf-clover',
    title: '네잎클로버',
    subtitle: '교과서 14~15쪽 사장조 2부 합창 대표곡',
    composer: '박영신 작사 / 박영신 작곡 (1996 MBC 창작동요제 대상)',
    description: '깊고 작은 산골짜기 사이로 맑은 물 흐르는 작은 샘터에~ 사장조(F# 1개)의 대표곡으로 으뜸화음(I), 버금딸림화음(IV), 딸림화음(V)과 2부 합창 어울림 가락을 원곡 멜로디 그대로 느껴보세요.',
    keyId: 'g-major',
    timeSignature: '4/4',
    measures: [
      {
        measureNum: 1,
        lyrics: '깊고 작은 산골짜기',
        chords: 'I',
        melodyNotes: [
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'B4', solfege: '미', fixedSolfege: '시', duration: 1.0 },
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 0.5 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'B3', solfege: '미', fixedSolfege: '시', duration: 0.5 },
          { note: 'B3', solfege: '미', fixedSolfege: '시', duration: 0.5 },
          { note: 'C4', solfege: '파', fixedSolfege: '도', duration: 0.5 }
        ],
        harmonyNotes: [
          { note: 'B3', solfege: '미', fixedSolfege: '시', duration: 0.5 },
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 1.0 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'B3', solfege: '미', fixedSolfege: '시', duration: 0.5 },
          { note: 'G3', solfege: '도', fixedSolfege: '솔', duration: 0.5 },
          { note: 'G3', solfege: '도', fixedSolfege: '솔', duration: 0.5 },
          { note: 'A3', solfege: '레', fixedSolfege: '라', duration: 0.5 }
        ]
      },
      {
        measureNum: 2,
        lyrics: '사 이 로 - (맑)',
        chords: 'V',
        melodyNotes: [
          { note: 'C4', solfege: '파', fixedSolfege: '도', duration: 0.5 },
          { note: 'A4', solfege: '레', fixedSolfege: '라', duration: 1.5 },
          { note: 'A4', solfege: '레', fixedSolfege: '라', duration: 1.5 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 }
        ],
        harmonyNotes: [
          { note: 'A3', solfege: '레', fixedSolfege: '라', duration: 0.5 },
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 1.5 },
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 1.5 },
          { note: 'C4', solfege: '파', fixedSolfege: '도', duration: 0.5 }
        ]
      },
      {
        measureNum: 3,
        lyrics: '맑은 물 흐르는 작은',
        chords: 'V',
        melodyNotes: [
          { note: 'C4', solfege: '파', fixedSolfege: '도', duration: 1.0 },
          { note: 'C4', solfege: '파', fixedSolfege: '도', duration: 0.5 },
          { note: 'A4', solfege: '레', fixedSolfege: '라', duration: 0.5 },
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 0.5 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'C4', solfege: '파', fixedSolfege: '도', duration: 0.5 },
          { note: 'B3', solfege: '미', fixedSolfege: '시', duration: 0.5 }
        ],
        harmonyNotes: [
          { note: 'A3', solfege: '레', fixedSolfege: '라', duration: 1.0 },
          { note: 'A3', solfege: '레', fixedSolfege: '라', duration: 0.5 },
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 0.5 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'B3', solfege: '미', fixedSolfege: '시', duration: 0.5 },
          { note: 'A3', solfege: '레', fixedSolfege: '라', duration: 0.5 },
          { note: 'G3', solfege: '도', fixedSolfege: '솔', duration: 0.5 }
        ]
      },
      {
        measureNum: 4,
        lyrics: '샘 터 에 - (예)',
        chords: 'I',
        melodyNotes: [
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 1.5 },
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 2.0 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 }
        ],
        harmonyNotes: [
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 1.5 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 2.0 },
          { note: 'B3', solfege: '미', fixedSolfege: '시', duration: 0.5 }
        ]
      },
      {
        measureNum: 5,
        lyrics: '예쁜 꽃들 사이에',
        chords: 'I',
        melodyNotes: [
          { note: 'B4', solfege: '미', fixedSolfege: '시', duration: 1.0 },
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 0.5 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'B3', solfege: '미', fixedSolfege: '시', duration: 0.5 },
          { note: 'C4', solfege: '파', fixedSolfege: '도', duration: 0.5 },
          { note: 'C4', solfege: '파', fixedSolfege: '도', duration: 1.0 }
        ],
        harmonyNotes: [
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 1.0 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'B3', solfege: '미', fixedSolfege: '시', duration: 0.5 },
          { note: 'G3', solfege: '도', fixedSolfege: '솔', duration: 0.5 },
          { note: 'A3', solfege: '레', fixedSolfege: '라', duration: 0.5 },
          { note: 'A3', solfege: '레', fixedSolfege: '라', duration: 1.0 }
        ]
      },
      {
        measureNum: 6,
        lyrics: '살짝 숨 겨 진 (이)',
        chords: 'V',
        melodyNotes: [
          { note: 'A4', solfege: '레', fixedSolfege: '라', duration: 1.5 },
          { note: 'A4', solfege: '레', fixedSolfege: '라', duration: 1.0 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 }
        ],
        harmonyNotes: [
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 1.5 },
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 1.0 },
          { note: 'C4', solfege: '파', fixedSolfege: '도', duration: 0.5 },
          { note: 'C4', solfege: '파', fixedSolfege: '도', duration: 0.5 },
          { note: 'B3', solfege: '미', fixedSolfege: '시', duration: 0.5 }
        ]
      },
      {
        measureNum: 7,
        lyrics: '이슬 먹고 피어난 네',
        chords: 'V',
        melodyNotes: [
          { note: 'C4', solfege: '파', fixedSolfege: '도', duration: 1.0 },
          { note: 'A4', solfege: '레', fixedSolfege: '라', duration: 0.5 },
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 0.5 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'C4', solfege: '파', fixedSolfege: '도', duration: 0.5 },
          { note: 'B3', solfege: '미', fixedSolfege: '시', duration: 0.5 },
          { note: 'B3', solfege: '미', fixedSolfege: '시', duration: 0.5 }
        ],
        harmonyNotes: [
          { note: 'A3', solfege: '레', fixedSolfege: '라', duration: 1.0 },
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 0.5 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'B3', solfege: '미', fixedSolfege: '시', duration: 0.5 },
          { note: 'A3', solfege: '레', fixedSolfege: '라', duration: 0.5 },
          { note: 'G3', solfege: '도', fixedSolfege: '솔', duration: 0.5 },
          { note: 'G3', solfege: '도', fixedSolfege: '솔', duration: 0.5 }
        ]
      },
      {
        measureNum: 8,
        lyrics: '잎 클로버 랄랄라',
        chords: 'I',
        melodyNotes: [
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 1.0 },
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 1.0 },
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 0.5 },
          { note: 'A4', solfege: '레', fixedSolfege: '라', duration: 0.5 },
          { note: 'B4', solfege: '미', fixedSolfege: '시', duration: 1.0 }
        ],
        harmonyNotes: [
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 1.0 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 1.0 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 0.5 },
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 1.0 }
        ]
      },
      {
        measureNum: 9,
        lyrics: '랄랄라 한 잎',
        chords: 'IV',
        melodyNotes: [
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 0.5 },
          { note: 'C5', solfege: '파', fixedSolfege: '도', duration: 0.5 },
          { note: 'C5', solfege: '파', fixedSolfege: '도', duration: 1.0 },
          { note: 'B4', solfege: '미', fixedSolfege: '시', duration: 1.0 },
          { note: 'A4', solfege: '레', fixedSolfege: '라', duration: 1.0 }
        ],
        harmonyNotes: [
          { note: 'E4', solfege: '라', fixedSolfege: '미', duration: 0.5 },
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 0.5 },
          { note: 'A4', solfege: '레', fixedSolfege: '라', duration: 1.0 },
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 1.0 },
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 1.0 }
        ]
      },
      {
        measureNum: 10,
        lyrics: '랄랄라 두 잎',
        chords: 'I',
        melodyNotes: [
          { note: 'B4', solfege: '미', fixedSolfege: '시', duration: 0.5 },
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 0.5 },
          { note: 'B4', solfege: '미', fixedSolfege: '시', duration: 1.0 },
          { note: 'B4', solfege: '미', fixedSolfege: '시', duration: 1.0 },
          { note: 'A4', solfege: '레', fixedSolfege: '라', duration: 0.5 },
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 0.5 }
        ],
        harmonyNotes: [
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 0.5 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 1.0 },
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 1.0 },
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 0.5 },
          { note: 'E4', 'solfege': '라', 'fixedSolfege': '미', 'duration': 0.5 }
        ]
      },
      {
        measureNum: 11,
        lyrics: '랄랄라 세 잎',
        chords: 'V',
        melodyNotes: [
          { note: 'A4', solfege: '레', fixedSolfege: '라', duration: 0.5 },
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 0.5 },
          { note: 'A4', solfege: '레', fixedSolfege: '라', duration: 1.0 },
          { note: 'A4', solfege: '레', fixedSolfege: '라', duration: 1.0 },
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 0.5 },
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 0.5 }
        ],
        harmonyNotes: [
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 0.5 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 1.0 },
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 1.0 },
          { note: 'E4', solfege: '라', fixedSolfege: '미', duration: 0.5 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 }
        ]
      },
      {
        measureNum: 12,
        lyrics: '랄랄라 네 잎',
        chords: 'I',
        melodyNotes: [
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 0.5 },
          { note: 'A4', solfege: '레', fixedSolfege: '라', duration: 0.5 },
          { note: 'B4', solfege: '미', fixedSolfege: '시', duration: 2.0 },
          { note: 'B4', solfege: '미', fixedSolfege: '시', duration: 1.0 }
        ],
        harmonyNotes: [
          { note: 'E4', solfege: '라', fixedSolfege: '미', duration: 0.5 },
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 0.5 },
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 2.0 },
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 1.0 }
        ]
      },
      {
        measureNum: 13,
        lyrics: '행운을 가져다',
        chords: 'IV',
        melodyNotes: [
          { note: 'E4', solfege: '라', fixedSolfege: '미', duration: 0.5 },
          { note: 'E4', solfege: '라', fixedSolfege: '미', duration: 0.5 },
          { note: 'E4', solfege: '라', fixedSolfege: '미', duration: 0.5 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'C4', solfege: '파', fixedSolfege: '도', duration: 1.0 },
          { note: 'C4', solfege: '파', fixedSolfege: '도', duration: 1.0 }
        ],
        harmonyNotes: [
          { note: 'C4', solfege: '파', fixedSolfege: '도', duration: 0.5 },
          { note: 'C4', solfege: '파', fixedSolfege: '도', duration: 0.5 },
          { note: 'C4', solfege: '파', fixedSolfege: '도', duration: 0.5 },
          { note: 'B3', solfege: '미', fixedSolfege: '시', duration: 0.5 },
          { note: 'A3', solfege: '레', fixedSolfege: '라', duration: 1.0 },
          { note: 'A3', solfege: '레', fixedSolfege: '라', duration: 1.0 }
        ]
      },
      {
        measureNum: 14,
        lyrics: '준다는 수줍은',
        chords: 'I',
        melodyNotes: [
          { note: 'B3', solfege: '미', fixedSolfege: '시', duration: 0.5 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 1.0 },
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 0.5 },
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 0.5 },
          { note: 'E4', solfege: '라', fixedSolfege: '미', duration: 1.0 }
        ],
        harmonyNotes: [
          { note: 'G3', solfege: '도', fixedSolfege: '솔', duration: 0.5 },
          { note: 'B3', solfege: '미', fixedSolfege: '시', duration: 0.5 },
          { note: 'B3', solfege: '미', fixedSolfege: '시', duration: 1.0 },
          { note: 'E4', solfege: '라', fixedSolfege: '미', duration: 0.5 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'C4', solfege: '파', fixedSolfege: '도', duration: 1.0 }
        ]
      },
      {
        measureNum: 15,
        lyrics: '얼굴의 미소 -',
        chords: 'V',
        melodyNotes: [
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 0.5 },
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 0.5 },
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 0.5 },
          { note: 'E4', solfege: '라', fixedSolfege: '미', duration: 0.5 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 2.0 }
        ],
        harmonyNotes: [
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'C4', solfege: '파', fixedSolfege: '도', duration: 0.5 },
          { note: 'B3', solfege: '미', fixedSolfege: '시', duration: 2.0 }
        ]
      },
      {
        measureNum: 16,
        lyrics: '소 - - -',
        chords: 'V',
        melodyNotes: [
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 3.0 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 1.0 }
        ],
        harmonyNotes: [
          { note: 'C4', solfege: '파', fixedSolfege: '도', duration: 3.0 },
          { note: 'C4', solfege: '파', fixedSolfege: '도', duration: 1.0 }
        ]
      },
      {
        measureNum: 17,
        lyrics: '한 줄기의 따스한',
        chords: 'IV',
        melodyNotes: [
          { note: 'C5', solfege: '파', fixedSolfege: '도', duration: 0.5 },
          { note: 'C5', solfege: '파', fixedSolfege: '도', duration: 0.5 },
          { note: 'C5', solfege: '파', fixedSolfege: '도', duration: 0.5 },
          { note: 'D5', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'E5', solfege: '라', fixedSolfege: '미', duration: 1.0 },
          { note: 'E5', solfege: '라', fixedSolfege: '미', duration: 1.0 }
        ],
        harmonyNotes: [
          { note: 'E4', solfege: '라', fixedSolfege: '미', duration: 0.5 },
          { note: 'E4', solfege: '라', fixedSolfege: '미', duration: 0.5 },
          { note: 'E4', solfege: '라', fixedSolfege: '미', duration: 0.5 },
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 0.5 },
          { note: 'C5', solfege: '파', fixedSolfege: '도', duration: 1.0 },
          { note: 'C5', solfege: '파', fixedSolfege: '도', duration: 1.0 }
        ]
      },
      {
        measureNum: 18,
        lyrics: '햇살 받으며 -',
        chords: 'I',
        melodyNotes: [
          { note: 'D5', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'D5', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'B4', solfege: '미', fixedSolfege: '시', duration: 1.0 },
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 2.0 }
        ],
        harmonyNotes: [
          { note: 'B4', solfege: '미', fixedSolfege: '시', duration: 0.5 },
          { note: 'B4', solfege: '미', fixedSolfege: '시', duration: 0.5 },
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 1.0 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 2.0 }
        ]
      },
      {
        measureNum: 19,
        lyrics: '희망으로 가득한',
        chords: 'IV',
        melodyNotes: [
          { note: 'C5', solfege: '파', fixedSolfege: '도', duration: 0.5 },
          { note: 'C5', solfege: '파', fixedSolfege: '도', duration: 0.5 },
          { note: 'C5', solfege: '파', fixedSolfege: '도', duration: 0.5 },
          { note: 'D5', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'E5', solfege: '라', fixedSolfege: '미', duration: 1.0 },
          { note: 'D5', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'C5', solfege: '파', fixedSolfege: '도', duration: 0.5 }
        ],
        harmonyNotes: [
          { note: 'E4', solfege: '라', fixedSolfege: '미', duration: 0.5 },
          { note: 'E4', solfege: '라', fixedSolfege: '미', duration: 0.5 },
          { note: 'E4', solfege: '라', fixedSolfege: '미', duration: 0.5 },
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 0.5 },
          { note: 'C5', solfege: '파', fixedSolfege: '도', duration: 1.0 },
          { note: 'B4', solfege: '미', fixedSolfege: '시', duration: 0.5 },
          { note: 'A4', solfege: '레', fixedSolfege: '라', duration: 0.5 }
        ]
      },
      {
        measureNum: 20,
        lyrics: '나의 친구야 -',
        chords: 'V',
        melodyNotes: [
          { note: 'D5', solfege: '솔', fixedSolfege: '레', duration: 2.0 },
          { note: 'D5', solfege: '솔', fixedSolfege: '레', duration: 1.0 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 1.0 }
        ],
        harmonyNotes: [
          { note: 'B4', solfege: '미', fixedSolfege: '시', duration: 2.0 },
          { note: 'A4', solfege: '레', fixedSolfege: '라', duration: 1.0 },
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 1.0 }
        ]
      },
      {
        measureNum: 21,
        lyrics: '빛처럼 밝은 마음으로',
        chords: 'I',
        melodyNotes: [
          { note: 'B4', solfege: '미', fixedSolfege: '시', duration: 0.5 },
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 0.5 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'B3', solfege: '미', fixedSolfege: '시', duration: 0.5 },
          { note: 'C4', solfege: '파', fixedSolfege: '도', duration: 1.0 },
          { note: 'C4', solfege: '파', fixedSolfege: '도', duration: 1.0 }
        ],
        harmonyNotes: [
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 0.5 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'B3', solfege: '미', fixedSolfege: '시', duration: 0.5 },
          { note: 'G3', solfege: '도', fixedSolfege: '솔', duration: 0.5 },
          { note: 'A3', solfege: '레', fixedSolfege: '라', duration: 1.0 },
          { note: 'A3', solfege: '레', fixedSolfege: '라', duration: 1.0 }
        ]
      },
      {
        measureNum: 22,
        lyrics: '너를 - - -',
        chords: 'IV',
        melodyNotes: [
          { note: 'C4', solfege: '파', fixedSolfege: '도', duration: 0.5 },
          { note: 'A4', solfege: '레', fixedSolfege: '라', duration: 1.5 },
          { note: 'A4', solfege: '레', fixedSolfege: '라', duration: 2.0 }
        ],
        harmonyNotes: [
          { note: 'A3', solfege: '레', fixedSolfege: '라', duration: 0.5 },
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 1.5 },
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 2.0 }
        ]
      },
      {
        measureNum: 23,
        lyrics: '닮고 싶어 - -',
        chords: 'V',
        melodyNotes: [
          { note: 'C4', solfege: '파', fixedSolfege: '도', duration: 0.5 },
          { note: 'A4', solfege: '레', fixedSolfege: '라', duration: 0.5 },
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 0.5 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'C4', solfege: '파', fixedSolfege: '도', duration: 1.0 },
          { note: 'B3', solfege: '미', fixedSolfege: '시', duration: 1.0 }
        ],
        harmonyNotes: [
          { note: 'A3', solfege: '레', fixedSolfege: '라', duration: 0.5 },
          { note: 'F#4', solfege: '시', fixedSolfege: '파#', duration: 0.5 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 0.5 },
          { note: 'B3', solfege: '미', fixedSolfege: '시', duration: 0.5 },
          { note: 'A3', solfege: '레', fixedSolfege: '라', duration: 1.0 },
          { note: 'G3', solfege: '도', fixedSolfege: '솔', duration: 1.0 }
        ]
      },
      {
        measureNum: 24,
        lyrics: '너를 닮고 싶어 🍀',
        chords: 'I',
        melodyNotes: [
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 1.5 },
          { note: 'G4', solfege: '도', fixedSolfege: '솔', duration: 2.5 }
        ],
        harmonyNotes: [
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 1.5 },
          { note: 'D4', solfege: '솔', fixedSolfege: '레', duration: 2.5 }
        ]
      }
    ]
  },

  // 교과서 50~51쪽 <별 보며 달 보며> (라단조, 유성윤 작사 / 유병무 작곡, 조금 느리게 58 BPM)
  {
    id: 'stars-and-moon',
    title: '별 보며 달 보며',
    subtitle: '교과서 50~51쪽 라단조 2중창 대표곡',
    composer: '유성윤 작사 / 유병무 작곡',
    description: '멀리서 반짝이는 별님과 같이~ 단조 특유의 애틋하고 서정적인 가락과 학생 2의 어울림 가락(2중창)을 함께 감상해보세요.',
    keyId: 'd-minor',
    timeSignature: '6/8',
    measures: [
      {
        measureNum: 1,
        lyrics: '멀리서 반짝',
        chords: 'i',
        melodyNotes: [
          { note: 'D4', solfege: '라', duration: 1.0 },
          { note: 'D4', solfege: '라', duration: 0.5 },
          { note: 'F4', solfege: '도', duration: 1.0 },
          { note: 'G4', solfege: '레', duration: 0.5 }
        ],
        harmonyNotes: [
          { note: 'A3', solfege: '미', duration: 1.0 },
          { note: 'A3', solfege: '미', duration: 0.5 },
          { note: 'D4', solfege: '라', duration: 1.0 },
          { note: 'D4', solfege: '라', duration: 0.5 }
        ]
      },
      {
        measureNum: 2,
        lyrics: '이 는 - -',
        chords: 'i',
        melodyNotes: [
          { note: 'A4', solfege: '미', duration: 1.0 },
          { note: 'A4', solfege: '미', duration: 0.5 },
          { note: 'A4', solfege: '미', duration: 1.5 }
        ],
        harmonyNotes: [
          { note: 'F4', solfege: '도', duration: 1.0 },
          { note: 'F4', solfege: '도', duration: 0.5 },
          { note: 'D4', solfege: '라', duration: 1.5 }
        ]
      },
      {
        measureNum: 3,
        lyrics: '별 님 과 같',
        chords: 'iv',
        melodyNotes: [
          { note: 'D5', solfege: '라', duration: 1.0 },
          { note: 'D5', solfege: '라', duration: 0.5 },
          { note: 'C5', solfege: '솔', duration: 1.0 },
          { note: 'A4', solfege: '미', duration: 0.5 }
        ],
        harmonyNotes: [
          { note: 'A#4', solfege: '파', duration: 1.0 },
          { note: 'A#4', solfege: '파', duration: 0.5 },
          { note: 'A4', solfege: '미', duration: 1.0 },
          { note: 'F4', solfege: '도', duration: 0.5 }
        ]
      },
      {
        measureNum: 4,
        lyrics: '이 - - -',
        chords: 'V',
        melodyNotes: [
          { note: 'F4', solfege: '도', duration: 1.5 },
          { note: 'E4', solfege: '시', duration: 1.5 }
        ],
        harmonyNotes: [
          { note: 'D4', solfege: '라', duration: 1.5 },
          { note: 'C#4', solfege: '솔#', duration: 1.5 }
        ]
      },
      {
        measureNum: 5,
        lyrics: '의 좋 게 사',
        chords: 'i',
        melodyNotes: [
          { note: 'A4', solfege: '미', duration: 1.0 },
          { note: 'A4', solfege: '미', duration: 0.5 },
          { note: 'G4', solfege: '레', duration: 1.0 },
          { note: 'F4', solfege: '도', duration: 0.5 }
        ],
        harmonyNotes: [
          { note: 'F4', solfege: '도', duration: 1.0 },
          { note: 'F4', solfege: '도', duration: 0.5 },
          { note: 'E4', solfege: '시', duration: 1.0 },
          { note: 'D4', solfege: '라', duration: 0.5 }
        ]
      },
      {
        measureNum: 6,
        lyrics: '귀 고 서 -',
        chords: 'iv',
        melodyNotes: [
          { note: 'G4', solfege: '레', duration: 1.0 },
          { note: 'G4', solfege: '레', duration: 0.5 },
          { note: 'E4', solfege: '시', duration: 1.5 }
        ],
        harmonyNotes: [
          { note: 'D4', solfege: '라', duration: 1.0 },
          { note: 'D4', solfege: '라', duration: 0.5 },
          { note: 'C#4', solfege: '솔#', duration: 1.5 }
        ]
      },
      {
        measureNum: 7,
        lyrics: '놀 았 으 면',
        chords: 'V',
        melodyNotes: [
          { note: 'F4', solfege: '도', duration: 1.0 },
          { note: 'G4', solfege: '레', duration: 0.5 },
          { note: 'A4', solfege: '미', duration: 1.0 },
          { note: 'E4', solfege: '시', duration: 0.5 }
        ],
        harmonyNotes: [
          { note: 'D4', solfege: '라', duration: 1.0 },
          { note: 'E4', solfege: '시', duration: 0.5 },
          { note: 'F4', solfege: '도', duration: 1.0 },
          { note: 'C#4', solfege: '솔#', duration: 0.5 }
        ]
      },
      {
        measureNum: 8,
        lyrics: '으 면 - - (끝)',
        chords: 'i',
        melodyNotes: [
          { note: 'D4', solfege: '라', duration: 3.0 }
        ],
        harmonyNotes: [
          { note: 'D4', solfege: '라', duration: 3.0 }
        ]
      }
    ]
  },

  // 3. 다장조 대표 어린이 동요 (다장조)
  {
    id: 'do-re-mi-classic',
    title: '동요 마을의 아침',
    subtitle: '다장조 주요 3화음 기초 연습곡',
    composer: '전통 동요',
    description: '도미솔, 파라도, 솔시레의 3대 화음만 알면 세상의 모든 동요를 반주할 수 있어요!',
    keyId: 'c-major',
    timeSignature: '4/4',
    measures: [
      {
        measureNum: 1,
        lyrics: '햇 살 이',
        chords: 'I',
        melodyNotes: [
          { note: 'C4', solfege: '도', duration: 1 },
          { note: 'E4', solfege: '미', duration: 1 },
          { note: 'G4', solfege: '솔', duration: 2 }
        ]
      },
      {
        measureNum: 2,
        lyrics: '비 치 는',
        chords: 'IV',
        melodyNotes: [
          { note: 'F4', solfege: '파', duration: 1 },
          { note: 'A4', solfege: '라', duration: 1 },
          { note: 'C5', solfege: '높은도', duration: 2 }
        ]
      },
      {
        measureNum: 3,
        lyrics: '아 침 에',
        chords: 'V',
        melodyNotes: [
          { note: 'G4', solfege: '솔', duration: 1 },
          { note: 'B4', solfege: '시', duration: 1 },
          { note: 'D5', solfege: '레', duration: 2 }
        ]
      },
      {
        measureNum: 4,
        lyrics: '노 래 해',
        chords: 'I',
        melodyNotes: [
          { note: 'E4', solfege: '미', duration: 1 },
          { note: 'D4', solfege: '레', duration: 1 },
          { note: 'C4', solfege: '도', duration: 2 }
        ]
      }
    ]
  }
];

export const THEORY_QUESTIONS: TheoryQuestion[] = [
  {
    id: 'name-vs-solfege',
    category: '음이름 vs 계이름',
    question: '음이름이랑 계이름은 왜 다르고, 왜 조에 따라 계이름이 바뀌나요?',
    summary: '음이름은 피아노 건반의 "주민등록번호(절대 주소)"이고, 계이름은 그 나라(조)에서 맡은 "가족 역할(첫째, 둘째...)"이에요!',
    analogy: '내가 집에서는 "엄마의 큰아들"이지만, 학교에 가면 "3학년 2반 반장"이 되는 것처럼! 건반의 원래 이름(음이름: 다, 라, 마...)은 그대로지만, 사장조 나라에 가면 사(G)음이 첫째 대장 "도"가 되는 것이랍니다.',
    details: [
      '피아노 건반의 위치와 소리 높이는 평생 변하지 않습니다. 이것을 "음이름(우리말: 다, 라, 마... / 영문: C, D, E...)"이라고 불러요.',
      '하지만 우리가 노래를 부를 때는 시작하는 음이 무엇이든 "도-레-미-파-솔-라-시-도"의 멜로디 계단을 똑같이 느끼고 싶어 합니다.',
      '그래서 "어떤 음을 대장(으뜸음)으로 삼든 그 대장을 \'도\'라고 부르자!"라고 약속한 것이 바로 계이름(이동도법)이에요.',
      '다장조에서는 다(C)가 \'도\'이고, 사장조에서는 사(G)가 \'도\', 라단조에서는 라(D)가 \'라\'가 됩니다.'
    ]
  },
  {
    id: 'score-singing',
    category: '악보 읽기와 연주',
    question: '악보에 D(레) 자리에 음표가 그려져 있다면, 사장조에서는 솔로 부르나요?',
    summary: '노래로 부를 때는 계이름인 "솔~"로 부르고, 건반을 누를 때는 피아노의 원래 "D(라)" 건반을 누릅니다!',
    analogy: '외국인 친구 "데이비드(D)"가 우리 연극에서 "솔 장군" 역할을 맡았어요! 대본을 부를 땐 "솔 장군님!"하고 부르지만, 실제 무대에 서 있는 사람은 여전히 데이비드인 것과 같아요.',
    details: [
      '교과서 <네잎클로버>를 보면 악보 첫마디에 넷째 줄(D음) 음표가 나옵니다.',
      '다장조 기준으로 보면 "레" 자리이지만, 사장조(G가 도)에서는 5번째 음이므로 계이름으로 노래할 때는 "솔~"이라고 흥얼거립니다.',
      '하지만 멜로디언이나 리코더, 피아노 건반으로 소리를 낼 때는 악보의 조표(# 1개)를 보고 원래의 D(라) 건반을 정확히 짚어야 맞는 소리가 납니다.',
      '이것이 바로 "계이름으로 노래 부르기"와 "음이름으로 건반 연주하기"의 완벽한 차이입니다.'
    ]
  },
  {
    id: 'step-stairs',
    category: '음계와 조표 (#, b)',
    question: '라장조나 사장조로 스케일 연습할 때 플랫이나 샵을 왜 붙이나요?',
    summary: '장조의 도레미파 소리를 만들려면 [3-4번(미-파)]과 [7-8번(시-도)]이 무조건 "반음(계단 반 칸)"이어야 하기 때문이에요!',
    analogy: '도레미파솔라시도 미끄럼틀은 3-4번 발판과 7-8번 발판만 좁은 반 칸짜리예요. 시작 계단을 솔(G)이나 레(D)로 옮기면 발판 간격이 삐뚤빼뚤해지는데, 샵(#)을 붙여 발판을 반 칸 올려주면 신기하게도 원래의 미끄럼틀이 완벽히 복원됩니다!',
    details: [
      '피아노 흰건반을 그냥 도부터 시까지 치면 미-파, 시-도 사이가 검은건반이 없는 반음(Half step)입니다.',
      '그런데 솔(G)부터 흰건반만 치면 6-7번(미-파)이 반음이 되고 7-8번(파-솔)이 온음이 되어 "도-레-미-파-솔-라-시-도"의 끝이 축 처지는 이상한 소리가 납니다.',
      '그래서 7번째 음인 파에 샵(#)을 붙여 반음 올려주면(F#), 7-8번이 딱 예쁜 반음이 되며 상쾌한 사장조가 완성됩니다.',
      '라장조(D)는 온음-반음 법칙을 맞추기 위해 파와 도 2곳에 샵(F#, C#)이 필요합니다.'
    ]
  },
  {
    id: 'major-vs-minor',
    category: '장조 vs 단조',
    question: '장조(다장조)와 단조(라단조, 가단조)는 왜 느낌이 다르고 3도 음이 왜 중요한가요?',
    summary: '으뜸음에서 3번째 음까지의 거리가 넓으면(장3도: 반음 4개) 활짝 웃는 햇살 ☀️, 좁으면(단3도: 반음 3개) 쓸쓸한 달빛 🌙이 됩니다!',
    analogy: '입꼬리를 양옆으로 활짝 벌리면 하하하 웃는 장조(Major)! 입꼬리를 살짝 오므리면 잔잔하고 차분해지는 단조(minor)! 단 1개의 반음 차이가 소리의 표정을 180도 바꿉니다.',
    details: [
      '다장조 으뜸화음: 도 - 미 - 솔 (도에서 미까지 반음 4개 = 장3도). 햇살처럼 씩씩하고 밝습니다.',
      '다단조 으뜸화음: 도 - 미b - 솔 (미를 반음 내림 = 단3도). 갑자기 쓸쓸하고 진지해집니다.',
      '교과서 <별 보며 달 보며>는 라단조(D minor) 곡이라 레 - 파 - 라 화음이 쓰이며, 레에서 파까지가 단3도라서 밤하늘의 은은한 달빛 정서를 풍깁니다.'
    ]
  },
  {
    id: 'relative-minor',
    category: '나란한 조 (으뜸음 이동)',
    question: '선생님이 장조에서 단조로 바꾸면 샵 전단계에서 뒤집은 거라고 하셨는데 나란한 조가 뭐예요?',
    summary: '조표(재료)가 똑같은 장조와 단조를 "나란한 조"라고 해요. 장조의 "도"에서 3반음 아래로 내려가면 단조의 "라"가 됩니다!',
    analogy: '같은 7개의 레고 블록(조표)을 가지고, "도"를 대장으로 쌓으면 환한 성(장조)이 되고, 3칸 아래 "라"를 대장으로 쌓으면 신비로운 동굴(단조)이 됩니다!',
    details: [
      '다장조(C Major)와 가단조(A minor): 둘 다 조표가 없습니다! C(도)에서 3반음 내려가면 A(라)가 으뜸음!',
      '바장조(F Major)와 라단조(D minor): 둘 다 플랫(b) 1개(시b)를 씁니다! F(도)에서 3반음 내려가면 D(라)가 으뜸음! (<별 보며 달 보며>)',
      '사장조(G Major)와 마단조(E minor): 둘 다 샵(#) 1개(파#)를 씁니다! G(도)에서 3반음 내려가면 E(라)가 으뜸음!',
      '선생님이 말씀하신 "뒤집었다"는 것은 같은 조표 안에서 으뜸음의 중심 축이 3반음 아래로 이동하여 밝음과 어두움이 반전되었다는 뜻입니다.'
    ]
  },
  {
    id: 'key-signature-rule',
    category: '조표 보고 으뜸음 찾기',
    question: '악보 맨 앞의 샵(#)이나 플랫(b)을 보고 으뜸음(도)을 1초 만에 어떻게 찾나요?',
    summary: '샵(#)은 마지막 샵의 바로 윗음이 "도"! 플랫(b)은 끝에서 두 번째 플랫이 "도"!(1개일 땐 4도 아래 파)',
    analogy: '엘리베이터 버튼 공식! #은 마지막 화살표 바로 윗층이 내릴 곳이고, b은 뒤에서 두 번째 버튼이 내릴 곳이에요!',
    details: [
      '올림표(#) 공식: #이 붙는 순서는 [파 - 도 - 솔 - 레 - 라 - 미 - 시]. 맨 마지막에 붙은 #의 바로 윗음(반음 위)이 무조건 "도"입니다!',
      '예: #이 1개(파#) ➔ 파# 바로 위인 "솔(사)"이 으뜸음 ➔ 사장조!',
      '예: #이 2개(파#, 도#) ➔ 마지막 도# 바로 위인 "레(라)"가 으뜸음 ➔ 라장조!',
      '내림표(b) 공식: b이 붙는 순서는 [시 - 미 - 라 - 레 - 솔 - 도 - 파]. 끝에서 두 번째 플랫 자리가 바로 "도"입니다!',
      '예: b이 1개(시b) ➔ 외워두기: 시b에서 4도 아래인 "파(바)"가 으뜸음 ➔ 바장조!',
      '예: b이 2개(시b, 미b) ➔ 끝에서 두 번째인 "시b(내림나)"가 으뜸음 ➔ 내림나장조!'
    ]
  }
];
