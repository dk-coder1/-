export interface KeyScaleNote {
  degree: number; // 1 to 8
  pitch: string; // e.g. "G4"
  solfege: string; // 계이름: "도", "레", "미"...
  koreanName: string; // 우리말 음이름: "사", "가", "나"...
  engName: string; // 영문 음이름: "G", "A", "B"...
  isAccidental?: boolean; // # or b
  accidentalType?: '#' | 'b';
  stepTypeAfter: 'whole' | 'half'; // 온음 or 반음
}

export interface ChordVoicing {
  id: string;
  symbol: string; // "I", "IV", "V", "i", "iv"
  name: string; // "으뜸화음", "버금딸림화음", "딸림화음"
  rootName: string; // "G", "C", "D7"
  function: string; // "시작과 마침을 안정되게 해주는 중심 화음"
  type: 'major' | 'minor' | 'dominant7';
  
  // 기본 위치 (Root position)
  rootPosition: {
    notes: string[]; // ["G3", "B3", "D4"]
    solfege: string[]; // ["도", "미", "솔"]
    koreanNames: string[];
    fingersRight: number[]; // [1, 3, 5]
    description: string;
  };
  
  // 초등 교과서 추천 쉬운 자리바꿈 (Inversion for easy accompaniment)
  textbookPosition: {
    notes: string[]; // e.g. ["D4", "G4", "B4"] or ["G3", "B3", "D4"]
    solfege: string[];
    koreanNames: string[];
    fingersRight: number[]; // [1, 2, 5] or [1, 3, 5]
    description: string;
  };
}

export interface SongMeasure {
  measureNum: number;
  lyrics: string;
  chords: string; // "I", "IV", "V", "i"
  melodyNotes: { note: string; solfege: string; duration: number }[];
  harmonyNotes?: { note: string; solfege: string; duration: number }[]; // 2중창 어울림 가락
}

export interface TextbookSong {
  id: string;
  title: string;
  subtitle: string;
  composer: string;
  keyId: string;
  timeSignature: string; // "4/4" or "6/8"
  description: string;
  measures: SongMeasure[];
}

export interface MusicalKey {
  id: string;
  name: string; // "사장조 (G Major)"
  shortName: string; // "사장조"
  mode: 'major' | 'minor';
  tonicPitch: string; // "G"
  tonicKorean: string; // "사"
  tonicSolfege: string; // 장조는 "도", 단조는 "라"
  keySignature: {
    sharps: string[]; // ["F#"]
    flats: string[]; // []
    textbookRule: string; // "마지막 샵(F#)의 바로 위 음(G)이 '도'가 돼요!"
  };
  vibe: string; // "경쾌하고 밝은 햇살 같은 느낌"
  icon: string;
  scaleNotes: KeyScaleNote[];
  primaryChords: ChordVoicing[];
  textbookReference?: string; // 교과서 출처
}

export const MUSICAL_KEYS: Record<string, MusicalKey> = {
  'c-major': {
    id: 'c-major',
    name: '다장조 (C Major)',
    shortName: '다장조',
    mode: 'major',
    tonicPitch: 'C',
    tonicKorean: '다',
    tonicSolfege: '도',
    keySignature: {
      sharps: [],
      flats: [],
      textbookRule: '조표가 아무것도 붙지 않아요. 피아노의 흰건반 다(C)가 그대로 으뜸음 "도"가 돼요!'
    },
    vibe: '맑고 단정한 기본 장조! 모든 화성학의 첫 걸음이에요.',
    icon: '☀️',
    scaleNotes: [
      { degree: 1, pitch: 'C4', solfege: '도', koreanName: '다', engName: 'C', stepTypeAfter: 'whole' },
      { degree: 2, pitch: 'D4', solfege: '레', koreanName: '라', engName: 'D', stepTypeAfter: 'whole' },
      { degree: 3, pitch: 'E4', solfege: '미', koreanName: '마', engName: 'E', stepTypeAfter: 'half' },
      { degree: 4, pitch: 'F4', solfege: '파', koreanName: '바', engName: 'F', stepTypeAfter: 'whole' },
      { degree: 5, pitch: 'G4', solfege: '솔', koreanName: '사', engName: 'G', stepTypeAfter: 'whole' },
      { degree: 6, pitch: 'A4', solfege: '라', koreanName: '가', engName: 'A', stepTypeAfter: 'whole' },
      { degree: 7, pitch: 'B4', solfege: '시', koreanName: '나', engName: 'B', stepTypeAfter: 'half' },
      { degree: 8, pitch: 'C5', solfege: '도', koreanName: '다', engName: 'C', stepTypeAfter: 'whole' },
    ],
    primaryChords: [
      {
        id: 'c-I',
        symbol: 'I',
        name: '으뜸화음',
        rootName: 'C 화음',
        function: '시작과 끝의 편안한 집! 곡의 중심이 되는 가장 안정된 화음이에요.',
        type: 'major',
        rootPosition: {
          notes: ['C4', 'E4', 'G4'],
          solfege: ['도', '미', '솔'],
          koreanNames: ['다', '마', '사'],
          fingersRight: [1, 3, 5],
          description: '기본자리: 엄지(1), 중지(3), 새끼(5)로 도-미-솔을 짚어요.'
        },
        textbookPosition: {
          notes: ['C4', 'E4', 'G4'],
          solfege: ['도', '미', '솔'],
          koreanNames: ['다', '마', '사'],
          fingersRight: [1, 3, 5],
          description: '교과서 운지: 엄지(1)-중지(3)-새끼(5) 도-미-솔'
        }
      },
      {
        id: 'c-IV',
        symbol: 'IV',
        name: '버금딸림화음',
        rootName: 'F 화음',
        function: '활짝 펼쳐지는 넓은 들판 같은 느낌! 으뜸화음에서 떠나 모험을 떠나요.',
        type: 'major',
        rootPosition: {
          notes: ['F3', 'A3', 'C4'],
          solfege: ['파', '라', '도'],
          koreanNames: ['바', '가', '다'],
          fingersRight: [1, 3, 5],
          description: '기본자리: 파-라-도'
        },
        textbookPosition: {
          notes: ['C4', 'F4', 'A4'],
          solfege: ['도', '파', '라'],
          koreanNames: ['다', '바', '가'],
          fingersRight: [1, 4, 5],
          description: '교과서 자리바꿈 운지: 손을 멀리 옮기지 않고 엄지(도)-약지(파)-새끼(라)로 부드럽게 연결해요!'
        }
      },
      {
        id: 'c-V',
        symbol: 'V',
        name: '딸림화음',
        rootName: 'G 화음',
        function: '긴장감 조성! 집(I)으로 당장 돌아가고 싶어 하는 가장 활동적인 화음이에요.',
        type: 'major',
        rootPosition: {
          notes: ['G3', 'B3', 'D4'],
          solfege: ['솔', '시', '레'],
          koreanNames: ['사', '나', '라'],
          fingersRight: [1, 3, 5],
          description: '기본자리: 솔-시-레'
        },
        textbookPosition: {
          notes: ['B3', 'D4', 'G4'],
          solfege: ['시', '레', '솔'],
          koreanNames: ['나', '라', '사'],
          fingersRight: [1, 2, 5],
          description: '교과서 자리바꿈 운지: 엄지(시)-검지(레)-새끼(솔)로 도-미-솔 바로 옆에서 편하게 쳐요!'
        }
      }
    ]
  },

  'g-major': {
    id: 'g-major',
    name: '사장조 (G Major)',
    shortName: '사장조',
    mode: 'major',
    tonicPitch: 'G',
    tonicKorean: '사',
    tonicSolfege: '도',
    keySignature: {
      sharps: ['F#'],
      flats: [],
      textbookRule: '올림표(#)가 "바(F)" 자리에 1개 붙어요! #의 바로 윗음인 "사(G)"가 으뜸음 "도"가 돼요.'
    },
    vibe: '초등 교과서 <네잎클로버> 수록! 싱그럽고 경쾌한 풀내음 같은 장조예요.',
    icon: '🍀',
    textbookReference: '초등학교 음악 5~6학년 교과서: [사장조 음계와 화음 - 네잎클로버]',
    scaleNotes: [
      { degree: 1, pitch: 'G3', solfege: '도', koreanName: '사', engName: 'G', stepTypeAfter: 'whole' },
      { degree: 2, pitch: 'A3', solfege: '레', koreanName: '가', engName: 'A', stepTypeAfter: 'whole' },
      { degree: 3, pitch: 'B3', solfege: '미', koreanName: '나', engName: 'B', stepTypeAfter: 'half' },
      { degree: 4, pitch: 'C4', solfege: '파', koreanName: '다', engName: 'C', stepTypeAfter: 'whole' },
      { degree: 5, pitch: 'D4', solfege: '솔', koreanName: '라', engName: 'D', stepTypeAfter: 'whole' },
      { degree: 6, pitch: 'E4', solfege: '라', koreanName: '마', engName: 'E', stepTypeAfter: 'whole' },
      { degree: 7, pitch: 'F#4', solfege: '시', koreanName: '올림바', engName: 'F#', isAccidental: true, accidentalType: '#', stepTypeAfter: 'half' },
      { degree: 8, pitch: 'G4', solfege: '도', koreanName: '사', engName: 'G', stepTypeAfter: 'whole' },
    ],
    primaryChords: [
      {
        id: 'g-I',
        symbol: 'I',
        name: '으뜸화음',
        rootName: 'G 화음 (사화음)',
        function: '사장조의 우리 집! 사(G) 음을 뿌리로 세워진 가장 든든한 화음이에요.',
        type: 'major',
        rootPosition: {
          notes: ['G3', 'B3', 'D4'],
          solfege: ['도', '미', '솔'],
          koreanNames: ['사', '나', '라'],
          fingersRight: [1, 3, 5],
          description: '교과서 15쪽 운지: 사(G)-나(B)-라(D)를 엄지(1)-중지(3)-새끼(5)로 연주해요.'
        },
        textbookPosition: {
          notes: ['G3', 'B3', 'D4'],
          solfege: ['도', '미', '솔'],
          koreanNames: ['사', '나', '라'],
          fingersRight: [1, 3, 5],
          description: '교과서 기본 운지: 엄지(1)-중지(3)-새끼(5)'
        }
      },
      {
        id: 'g-IV',
        symbol: 'IV',
        name: '버금딸림화음',
        rootName: 'C 화음 (다화음)',
        function: '네잎클로버 후렴구 "한 잎 랄랄라~"에서 시원하게 터지는 화음!',
        type: 'major',
        rootPosition: {
          notes: ['C4', 'E4', 'G4'],
          solfege: ['파', '라', '도'],
          koreanNames: ['다', '마', '사'],
          fingersRight: [1, 3, 5],
          description: '기본자리: 다(C)-마(E)-사(G)'
        },
        textbookPosition: {
          notes: ['G3', 'C4', 'E4'],
          solfege: ['도', '파', '라'],
          koreanNames: ['사', '다', '마'],
          fingersRight: [1, 4, 5],
          description: '교과서 15쪽 자리바꿈 운지: 사(G)-다(C)-마(E) 엄지(1)-약지(4)-새끼(5)'
        }
      },
      {
        id: 'g-V',
        symbol: 'V',
        name: '딸림화음',
        rootName: 'D 화음 (라화음)',
        function: '마침표 직전에 두근거리며 긴장을 주는 화음! 바로 I 화음으로 돌아가고 싶어져요.',
        type: 'major',
        rootPosition: {
          notes: ['D3', 'F#3', 'A3'],
          solfege: ['솔', '시', '레'],
          koreanNames: ['라', '올림바', '가'],
          fingersRight: [1, 3, 5],
          description: '기본자리: 라(D)-올림바(F#)-가(A)'
        },
        textbookPosition: {
          notes: ['F#3', 'A3', 'D4'],
          solfege: ['시', '레', '솔'],
          koreanNames: ['올림바', '가', '라'],
          fingersRight: [1, 2, 5],
          description: '교과서 15쪽 자리바꿈 운지: 올림바(F# 검은건반!)-가(A)-라(D)를 엄지(1)-검지(2)-새끼(5)로 쳐요.'
        }
      }
    ]
  },

  'd-minor': {
    id: 'd-minor',
    name: '라단조 (D minor)',
    shortName: '라단조',
    mode: 'minor',
    tonicPitch: 'D',
    tonicKorean: '라',
    tonicSolfege: '라',
    keySignature: {
      sharps: [],
      flats: ['Bb'],
      textbookRule: '내림표(b)가 "나(B)" 자리에 1개 붙어요! "라(D)" 음을 으뜸음 "라"로 노래해요.'
    },
    vibe: '초등 교과서 <별 보며 달 보며> 수록! 별빛처럼 은은하고 아련한 단조의 울림이에요.',
    icon: '🌙',
    textbookReference: '초등학교 음악 5~6학년 교과서: [라단조 노래의 어울림 - 별 보며 달 보며]',
    scaleNotes: [
      { degree: 1, pitch: 'D4', solfege: '라', koreanName: '라', engName: 'D', stepTypeAfter: 'whole' },
      { degree: 2, pitch: 'E4', solfege: '시', koreanName: '마', engName: 'E', stepTypeAfter: 'half' },
      { degree: 3, pitch: 'F4', solfege: '도', koreanName: '바', engName: 'F', stepTypeAfter: 'whole' },
      { degree: 4, pitch: 'G4', solfege: '레', koreanName: '사', engName: 'G', stepTypeAfter: 'whole' },
      { degree: 5, pitch: 'A4', solfege: '미', koreanName: '가', engName: 'A', stepTypeAfter: 'half' },
      { degree: 6, pitch: 'Bb4', solfege: '파', koreanName: '내림나', engName: 'Bb', isAccidental: true, accidentalType: 'b', stepTypeAfter: 'whole' },
      { degree: 7, pitch: 'C5', solfege: '솔', koreanName: '다', engName: 'C', stepTypeAfter: 'whole' },
      { degree: 8, pitch: 'D5', solfege: '라', koreanName: '라', engName: 'D', stepTypeAfter: 'whole' },
    ],
    primaryChords: [
      {
        id: 'dm-i',
        symbol: 'i',
        name: '으뜸화음 (단3화음)',
        rootName: 'Dm 화음',
        function: '단조의 으뜸집! 첫 3도가 "단3도(3반음)"라서 차분하고 촉촉한 감성이 흘러나와요.',
        type: 'minor',
        rootPosition: {
          notes: ['D4', 'F4', 'A4'],
          solfege: ['라', '도', '미'],
          koreanNames: ['라', '바', '가'],
          fingersRight: [1, 3, 5],
          description: '교과서 51쪽 으뜸화음: 라(D)-바(F)-가(A)를 엄지(1)-중지(3)-새끼(5)로 짚어요.'
        },
        textbookPosition: {
          notes: ['D4', 'F4', 'A4'],
          solfege: ['라', '도', '미'],
          koreanNames: ['라', '바', '가'],
          fingersRight: [1, 3, 5],
          description: '기본 운지: 엄지(1)-중지(3)-새끼(5)'
        }
      },
      {
        id: 'dm-iv',
        symbol: 'iv',
        name: '버금딸림화음',
        rootName: 'Gm 화음',
        function: '더 깊은 밤하늘로 떠나는 느낌! 단조의 신비로움을 깊게 해줘요.',
        type: 'minor',
        rootPosition: {
          notes: ['G3', 'Bb3', 'D4'],
          solfege: ['레', '파', '라'],
          koreanNames: ['사', '내림나', '라'],
          fingersRight: [1, 3, 5],
          description: '기본자리: 사(G)-내림나(Bb)-라(D)'
        },
        textbookPosition: {
          notes: ['D4', 'G4', 'Bb4'],
          solfege: ['라', '레', '파'],
          koreanNames: ['라', '사', '내림나'],
          fingersRight: [1, 3, 5],
          description: '자리바꿈 운지: D4를 유지하고 손을 가볍게 벌려 연주해요.'
        }
      },
      {
        id: 'dm-V',
        symbol: 'V (V7)',
        name: '딸림화음',
        rootName: 'A (A7) 화음',
        function: '단조에서도 딸림화음은 강하게 으뜸화음(i)으로 이끌어주기 위해 보통 C#을 써서 긴장감을 극대화해요!',
        type: 'major',
        rootPosition: {
          notes: ['A3', 'C#4', 'E4'],
          solfege: ['미', '솔#', '시'],
          koreanNames: ['가', '올림다', '마'],
          fingersRight: [1, 3, 5],
          description: '화성단음계 딸림화음: 가(A)-올림다(C#)-마(E)'
        },
        textbookPosition: {
          notes: ['C#4', 'E4', 'A4'],
          solfege: ['솔#', '시', '미'],
          koreanNames: ['올림다', '마', '가'],
          fingersRight: [1, 2, 5],
          description: '자리바꿈 운지: 올림다(C#)-마(E)-가(A)'
        }
      }
    ]
  },

  'f-major': {
    id: 'f-major',
    name: '바장조 (F Major)',
    shortName: '바장조',
    mode: 'major',
    tonicPitch: 'F',
    tonicKorean: '바',
    tonicSolfege: '도',
    keySignature: {
      sharps: [],
      flats: ['Bb'],
      textbookRule: '내림표(b)가 "나(B)" 자리에 1개 붙어요! b의 4도 아래 또는 그 앞음인 "바(F)"가 으뜸음 "도"가 돼요.'
    },
    vibe: '따뜻하고 부드러운 목관악기 소리 같은 편안한 장조예요.',
    icon: '🌸',
    scaleNotes: [
      { degree: 1, pitch: 'F3', solfege: '도', koreanName: '바', engName: 'F', stepTypeAfter: 'whole' },
      { degree: 2, pitch: 'G3', solfege: '레', koreanName: '사', engName: 'G', stepTypeAfter: 'whole' },
      { degree: 3, pitch: 'A3', solfege: '미', koreanName: '가', engName: 'A', stepTypeAfter: 'half' },
      { degree: 4, pitch: 'Bb3', solfege: '파', koreanName: '내림나', engName: 'Bb', isAccidental: true, accidentalType: 'b', stepTypeAfter: 'whole' },
      { degree: 5, pitch: 'C4', solfege: '솔', koreanName: '다', engName: 'C', stepTypeAfter: 'whole' },
      { degree: 6, pitch: 'D4', solfege: '라', koreanName: '라', engName: 'D', stepTypeAfter: 'whole' },
      { degree: 7, pitch: 'E4', solfege: '시', koreanName: '마', engName: 'E', stepTypeAfter: 'half' },
      { degree: 8, pitch: 'F4', solfege: '도', koreanName: '바', engName: 'F', stepTypeAfter: 'whole' },
    ],
    primaryChords: [
      {
        id: 'f-I',
        symbol: 'I',
        name: '으뜸화음',
        rootName: 'F 화음',
        function: '바장조의 으뜸! 바(F)-가(A)-다(C)',
        type: 'major',
        rootPosition: {
          notes: ['F3', 'A3', 'C4'],
          solfege: ['도', '미', '솔'],
          koreanNames: ['바', '가', '다'],
          fingersRight: [1, 3, 5],
          description: '기본자리: F-A-C'
        },
        textbookPosition: {
          notes: ['F3', 'A3', 'C4'],
          solfege: ['도', '미', '솔'],
          koreanNames: ['바', '가', '다'],
          fingersRight: [1, 3, 5],
          description: '교과서 기본 운지'
        }
      },
      {
        id: 'f-IV',
        symbol: 'IV',
        name: '버금딸림화음',
        rootName: 'Bb 화음',
        function: '시b(검은건반)-레-파',
        type: 'major',
        rootPosition: {
          notes: ['Bb3', 'D4', 'F4'],
          solfege: ['파', '라', '도'],
          koreanNames: ['내림나', '라', '바'],
          fingersRight: [1, 3, 5],
          description: '기본자리: Bb-D-F'
        },
        textbookPosition: {
          notes: ['F3', 'Bb3', 'D4'],
          solfege: ['도', '파', '라'],
          koreanNames: ['바', '내림나', '라'],
          fingersRight: [1, 4, 5],
          description: '자리바꿈 운지: 바(F)-내림나(Bb)-라(D)'
        }
      },
      {
        id: 'f-V',
        symbol: 'V',
        name: '딸림화음',
        rootName: 'C 화음',
        function: '다(C)-마(E)-사(G)',
        type: 'major',
        rootPosition: {
          notes: ['C4', 'E4', 'G4'],
          solfege: ['솔', '시', '레'],
          koreanNames: ['다', '마', '사'],
          fingersRight: [1, 3, 5],
          description: '기본자리: C-E-G'
        },
        textbookPosition: {
          notes: ['E3', 'G3', 'C4'],
          solfege: ['시', '레', '솔'],
          koreanNames: ['마', '사', '다'],
          fingersRight: [1, 2, 5],
          description: '자리바꿈 운지: 마(E)-사(G)-다(C)'
        }
      }
    ]
  },

  'd-major': {
    id: 'd-major',
    name: '라장조 (D Major)',
    shortName: '라장조',
    mode: 'major',
    tonicPitch: 'D',
    tonicKorean: '라',
    tonicSolfege: '도',
    keySignature: {
      sharps: ['F#', 'C#'],
      flats: [],
      textbookRule: '올림표(#)가 2개(F#, C#) 붙어요! 마지막 샵(C#)의 바로 위 음인 "라(D)"가 으뜸음 "도"예요.'
    },
    vibe: '당당하고 행진곡처럼 힘찬 에너지가 넘치는 장조예요.',
    icon: '🎺',
    scaleNotes: [
      { degree: 1, pitch: 'D4', solfege: '도', koreanName: '라', engName: 'D', stepTypeAfter: 'whole' },
      { degree: 2, pitch: 'E4', solfege: '레', koreanName: '마', engName: 'E', stepTypeAfter: 'whole' },
      { degree: 3, pitch: 'F#4', solfege: '미', koreanName: '올림바', engName: 'F#', isAccidental: true, accidentalType: '#', stepTypeAfter: 'half' },
      { degree: 4, pitch: 'G4', solfege: '파', koreanName: '사', engName: 'G', stepTypeAfter: 'whole' },
      { degree: 5, pitch: 'A4', solfege: '솔', koreanName: '가', engName: 'A', stepTypeAfter: 'whole' },
      { degree: 6, pitch: 'B4', solfege: '라', koreanName: '나', engName: 'B', stepTypeAfter: 'whole' },
      { degree: 7, pitch: 'C#5', solfege: '시', koreanName: '올림다', engName: 'C#', isAccidental: true, accidentalType: '#', stepTypeAfter: 'half' },
      { degree: 8, pitch: 'D5', solfege: '도', koreanName: '라', engName: 'D', stepTypeAfter: 'whole' },
    ],
    primaryChords: [
      {
        id: 'd-I',
        symbol: 'I',
        name: '으뜸화음',
        rootName: 'D 화음',
        function: '라(D)-올림바(F#)-가(A)',
        type: 'major',
        rootPosition: {
          notes: ['D4', 'F#4', 'A4'],
          solfege: ['도', '미', '솔'],
          koreanNames: ['라', '올림바', '가'],
          fingersRight: [1, 3, 5],
          description: '기본자리: D-F#-A'
        },
        textbookPosition: {
          notes: ['D4', 'F#4', 'A4'],
          solfege: ['도', '미', '솔'],
          koreanNames: ['라', '올림바', '가'],
          fingersRight: [1, 3, 5],
          description: '운지법: 엄지(1)-중지(3)-새끼(5)'
        }
      },
      {
        id: 'd-IV',
        symbol: 'IV',
        name: '버금딸림화음',
        rootName: 'G 화음',
        function: '사(G)-나(B)-라(D)',
        type: 'major',
        rootPosition: {
          notes: ['G3', 'B3', 'D4'],
          solfege: ['파', '라', '도'],
          koreanNames: ['사', '나', '라'],
          fingersRight: [1, 3, 5],
          description: '기본자리: G-B-D'
        },
        textbookPosition: {
          notes: ['D4', 'G4', 'B4'],
          solfege: ['도', '파', '라'],
          koreanNames: ['라', '사', '나'],
          fingersRight: [1, 4, 5],
          description: '자리바꿈 운지: 라(D)-사(G)-나(B)'
        }
      },
      {
        id: 'd-V',
        symbol: 'V',
        name: '딸림화음',
        rootName: 'A 화음',
        function: '가(A)-올림다(C#)-마(E)',
        type: 'major',
        rootPosition: {
          notes: ['A3', 'C#4', 'E4'],
          solfege: ['솔', '시', '레'],
          koreanNames: ['가', '올림다', '마'],
          fingersRight: [1, 3, 5],
          description: '기본자리: A-C#-E'
        },
        textbookPosition: {
          notes: ['C#4', 'E4', 'A4'],
          solfege: ['시', '레', '솔'],
          koreanNames: ['올림다', '마', '가'],
          fingersRight: [1, 2, 5],
          description: '자리바꿈 운지: 올림다(C#)-마(E)-가(A)'
        }
      }
    ]
  },

  'a-minor': {
    id: 'a-minor',
    name: '가단조 (A minor)',
    shortName: '가단조',
    mode: 'minor',
    tonicPitch: 'A',
    tonicKorean: '가',
    tonicSolfege: '라',
    keySignature: {
      sharps: [],
      flats: [],
      textbookRule: '다장조와 똑같이 조표가 없어요! 하지만 "가(A)" 음을 으뜸음 "라"로 노래해서 차분하고 슬픈 느낌이 들어요.'
    },
    vibe: '다장조의 단짝 쌍둥이(나란한 조)! 고즈넉한 가을바람 같은 느낌이에요.',
    icon: '🍂',
    scaleNotes: [
      { degree: 1, pitch: 'A3', solfege: '라', koreanName: '가', engName: 'A', stepTypeAfter: 'whole' },
      { degree: 2, pitch: 'B3', solfege: '시', koreanName: '나', engName: 'B', stepTypeAfter: 'half' },
      { degree: 3, pitch: 'C4', solfege: '도', koreanName: '다', engName: 'C', stepTypeAfter: 'whole' },
      { degree: 4, pitch: 'D4', solfege: '레', koreanName: '라', engName: 'D', stepTypeAfter: 'whole' },
      { degree: 5, pitch: 'E4', solfege: '미', koreanName: '마', engName: 'E', stepTypeAfter: 'half' },
      { degree: 6, pitch: 'F4', solfege: '파', koreanName: '바', engName: 'F', stepTypeAfter: 'whole' },
      { degree: 7, pitch: 'G4', solfege: '솔', koreanName: '사', engName: 'G', stepTypeAfter: 'whole' },
      { degree: 8, pitch: 'A4', solfege: '라', koreanName: '가', engName: 'A', stepTypeAfter: 'whole' },
    ],
    primaryChords: [
      {
        id: 'am-i',
        symbol: 'i',
        name: '으뜸화음',
        rootName: 'Am 화음',
        function: '가(A)-다(C)-마(E)의 단3화음',
        type: 'minor',
        rootPosition: {
          notes: ['A3', 'C4', 'E4'],
          solfege: ['라', '도', '미'],
          koreanNames: ['가', '다', '마'],
          fingersRight: [1, 3, 5],
          description: '기본자리 운지: A-C-E'
        },
        textbookPosition: {
          notes: ['A3', 'C4', 'E4'],
          solfege: ['라', '도', '미'],
          koreanNames: ['가', '다', '마'],
          fingersRight: [1, 3, 5],
          description: '엄지(1)-중지(3)-새끼(5)'
        }
      },
      {
        id: 'am-iv',
        symbol: 'iv',
        name: '버금딸림화음',
        rootName: 'Dm 화음',
        function: '라(D)-바(F)-가(A)',
        type: 'minor',
        rootPosition: {
          notes: ['D4', 'F4', 'A4'],
          solfege: ['레', '파', '라'],
          koreanNames: ['라', '바', '가'],
          fingersRight: [1, 3, 5],
          description: '기본자리: D-F-A'
        },
        textbookPosition: {
          notes: ['A3', 'D4', 'F4'],
          solfege: ['라', '레', '파'],
          koreanNames: ['가', '라', '바'],
          fingersRight: [1, 4, 5],
          description: '자리바꿈 운지: 가(A)-라(D)-바(F)'
        }
      },
      {
        id: 'am-V',
        symbol: 'V (E/E7)',
        name: '딸림화음',
        rootName: 'E (E7) 화음',
        function: '마(E)-올림사(G#)-나(B)',
        type: 'major',
        rootPosition: {
          notes: ['E3', 'G#3', 'B3'],
          solfege: ['미', '솔#', '시'],
          koreanNames: ['마', '올림사', '나'],
          fingersRight: [1, 3, 5],
          description: '기본자리: E-G#-B'
        },
        textbookPosition: {
          notes: ['G#3', 'B3', 'E4'],
          solfege: ['솔#', '시', '미'],
          koreanNames: ['올림사', '나', '마'],
          fingersRight: [1, 2, 5],
          description: '자리바꿈 운지: 올림사(G#)-나(B)-마(E)'
        }
      }
    ]
  },

  'e-minor': {
    id: 'e-minor',
    name: '마단조 (E minor)',
    shortName: '마단조',
    mode: 'minor',
    tonicPitch: 'E',
    tonicKorean: '마',
    tonicSolfege: '라',
    keySignature: {
      sharps: ['F#'],
      flats: [],
      textbookRule: '사장조와 똑같이 올림표(#)가 1개 붙어요! 사장조의 단짝 쌍둥이(나란한 조)이며 "마(E)" 음이 으뜸음 "라"가 돼요.'
    },
    vibe: '사장조의 나란한 조! 숲속의 신비롭고 서정적인 오솔길 같은 느낌이에요.',
    icon: '🌲',
    scaleNotes: [
      { degree: 1, pitch: 'E4', solfege: '라', koreanName: '마', engName: 'E', stepTypeAfter: 'whole' },
      { degree: 2, pitch: 'F#4', solfege: '시', koreanName: '올림바', engName: 'F#', isAccidental: true, accidentalType: '#', stepTypeAfter: 'half' },
      { degree: 3, pitch: 'G4', solfege: '도', koreanName: '사', engName: 'G', stepTypeAfter: 'whole' },
      { degree: 4, pitch: 'A4', solfege: '레', koreanName: '가', engName: 'A', stepTypeAfter: 'whole' },
      { degree: 5, pitch: 'B4', solfege: '미', koreanName: '나', engName: 'B', stepTypeAfter: 'half' },
      { degree: 6, pitch: 'C5', solfege: '파', koreanName: '다', engName: 'C', stepTypeAfter: 'whole' },
      { degree: 7, pitch: 'D5', solfege: '솔', koreanName: '라', engName: 'D', stepTypeAfter: 'whole' },
      { degree: 8, pitch: 'E5', solfege: '라', koreanName: '마', engName: 'E', stepTypeAfter: 'whole' },
    ],
    primaryChords: [
      {
        id: 'em-i',
        symbol: 'i',
        name: '으뜸화음',
        rootName: 'Em 화음',
        function: '마(E)-사(G)-나(B)의 차분한 단3화음',
        type: 'minor',
        rootPosition: {
          notes: ['E4', 'G4', 'B4'],
          solfege: ['라', '도', '미'],
          koreanNames: ['마', '사', '나'],
          fingersRight: [1, 3, 5],
          description: '기본자리: E-G-B'
        },
        textbookPosition: {
          notes: ['E4', 'G4', 'B4'],
          solfege: ['라', '도', '미'],
          koreanNames: ['마', '사', '나'],
          fingersRight: [1, 3, 5],
          description: '운지법: 엄지(1)-중지(3)-새끼(5)'
        }
      },
      {
        id: 'em-iv',
        symbol: 'iv',
        name: '버금딸림화음',
        rootName: 'Am 화음',
        function: '가(A)-다(C)-마(E)',
        type: 'minor',
        rootPosition: {
          notes: ['A3', 'C4', 'E4'],
          solfege: ['레', '파', '라'],
          koreanNames: ['가', '다', '마'],
          fingersRight: [1, 3, 5],
          description: '기본자리: A-C-E'
        },
        textbookPosition: {
          notes: ['E4', 'A4', 'C5'],
          solfege: ['라', '레', '파'],
          koreanNames: ['마', '가', '다'],
          fingersRight: [1, 4, 5],
          description: '자리바꿈 운지: 마(E)-가(A)-다(C)'
        }
      },
      {
        id: 'em-V',
        symbol: 'V (B7)',
        name: '딸림화음',
        rootName: 'B (B7) 화음',
        function: '나(B)-올림라(D#)-올림바(F#)',
        type: 'major',
        rootPosition: {
          notes: ['B3', 'D#4', 'F#4'],
          solfege: ['미', '솔#', '시'],
          koreanNames: ['나', '올림라', '올림바'],
          fingersRight: [1, 3, 5],
          description: '기본자리: B-D#-F#'
        },
        textbookPosition: {
          notes: ['D#4', 'F#4', 'B4'],
          solfege: ['솔#', '시', '미'],
          koreanNames: ['올림라', '올림바', '나'],
          fingersRight: [1, 2, 5],
          description: '자리바꿈 운지: 올림라(D#)-올림바(F#)-나(B)'
        }
      }
    ]
  },

  'bb-major': {
    id: 'bb-major',
    name: '내림나장조 (Bb Major)',
    shortName: '내림나장조',
    mode: 'major',
    tonicPitch: 'Bb',
    tonicKorean: '내림나',
    tonicSolfege: '도',
    keySignature: {
      sharps: [],
      flats: ['Bb', 'Eb'],
      textbookRule: '내림표(b)가 2개(시b, 미b) 붙어요! 끝에서 두 번째 플랫인 "내림나(Bb)"가 으뜸음 "도"가 돼요.'
    },
    vibe: '초등 6학년 관악 합주 및 감상곡 수록! 풍성하고 웅장한 금관악기 느낌이에요.',
    icon: '🎺',
    scaleNotes: [
      { degree: 1, pitch: 'A#3', solfege: '도', koreanName: '내림나', engName: 'Bb', isAccidental: true, accidentalType: 'b', stepTypeAfter: 'whole' },
      { degree: 2, pitch: 'C4', solfege: '레', koreanName: '다', engName: 'C', stepTypeAfter: 'whole' },
      { degree: 3, pitch: 'D4', solfege: '미', koreanName: '라', engName: 'D', stepTypeAfter: 'half' },
      { degree: 4, pitch: 'D#4', solfege: '파', koreanName: '내림마', engName: 'Eb', isAccidental: true, accidentalType: 'b', stepTypeAfter: 'whole' },
      { degree: 5, pitch: 'F4', solfege: '솔', koreanName: '바', engName: 'F', stepTypeAfter: 'whole' },
      { degree: 6, pitch: 'G4', solfege: '라', koreanName: '사', engName: 'G', stepTypeAfter: 'whole' },
      { degree: 7, pitch: 'A4', solfege: '시', koreanName: '가', engName: 'A', stepTypeAfter: 'half' },
      { degree: 8, pitch: 'A#4', solfege: '도', koreanName: '내림나', engName: 'Bb', isAccidental: true, accidentalType: 'b', stepTypeAfter: 'whole' },
    ],
    primaryChords: [
      {
        id: 'bb-I',
        symbol: 'I',
        name: '으뜸화음',
        rootName: 'Bb 화음',
        function: '내림나(Bb)-라(D)-바(F)',
        type: 'major',
        rootPosition: {
          notes: ['A#3', 'D4', 'F4'],
          solfege: ['도', '미', '솔'],
          koreanNames: ['내림나', '라', '바'],
          fingersRight: [1, 3, 5],
          description: '기본자리: Bb-D-F'
        },
        textbookPosition: {
          notes: ['A#3', 'D4', 'F4'],
          solfege: ['도', '미', '솔'],
          koreanNames: ['내림나', '라', '바'],
          fingersRight: [1, 3, 5],
          description: '운지법: 엄지(1)-중지(3)-새끼(5)'
        }
      },
      {
        id: 'bb-IV',
        symbol: 'IV',
        name: '버금딸림화음',
        rootName: 'Eb 화음',
        function: '내림마(Eb)-사(G)-내림나(Bb)',
        type: 'major',
        rootPosition: {
          notes: ['D#4', 'G4', 'A#4'],
          solfege: ['파', '라', '도'],
          koreanNames: ['내림마', '사', '내림나'],
          fingersRight: [1, 3, 5],
          description: '기본자리: Eb-G-Bb'
        },
        textbookPosition: {
          notes: ['A#3', 'D#4', 'G4'],
          solfege: ['도', '파', '라'],
          koreanNames: ['내림나', '내림마', '사'],
          fingersRight: [1, 4, 5],
          description: '자리바꿈 운지: 내림나(Bb)-내림마(Eb)-사(G)'
        }
      },
      {
        id: 'bb-V',
        symbol: 'V',
        name: '딸림화음',
        rootName: 'F 화음',
        function: '바(F)-가(A)-다(C)',
        type: 'major',
        rootPosition: {
          notes: ['F3', 'A3', 'C4'],
          solfege: ['솔', '시', '레'],
          koreanNames: ['바', '가', '다'],
          fingersRight: [1, 3, 5],
          description: '기본자리: F-A-C'
        },
        textbookPosition: {
          notes: ['A3', 'C4', 'F4'],
          solfege: ['시', '레', '솔'],
          koreanNames: ['가', '다', '바'],
          fingersRight: [1, 2, 5],
          description: '자리바꿈 운지: 가(A)-다(C)-바(F)'
        }
      }
    ]
  }
};

// 교과서 곡 수록 (사용자 요청 교과서 14-15쪽 '네잎클로버', 50-51쪽 '별 보며 달 보며')
export const TEXTBOOK_SONGS: TextbookSong[] = [
  {
    id: 'four-leaf-clover',
    title: '네잎클로버',
    subtitle: '사장조 음계와 화음 (교과서 14~15쪽)',
    composer: '박영신 작사 / 박영신 작곡',
    keyId: 'g-major',
    timeSignature: '4/4',
    description: '사장조의 대표 명곡! I (G), IV (C), V (D) 주요 3화음으로 노래의 분위기가 경쾌하게 바뀝니다.',
    measures: [
      {
        measureNum: 1,
        lyrics: '깊고 작은',
        chords: 'I',
        melodyNotes: [
          { note: 'D4', solfege: '솔', duration: 0.5 },
          { note: 'G4', solfege: '도', duration: 0.5 },
          { note: 'B4', solfege: '미', duration: 0.5 },
          { note: 'D5', solfege: '솔', duration: 0.5 }
        ]
      },
      {
        measureNum: 2,
        lyrics: '산골짜기 사이로',
        chords: 'V',
        melodyNotes: [
          { note: 'D5', solfege: '솔', duration: 0.5 },
          { note: 'C5', solfege: '파', duration: 0.5 },
          { note: 'A4', solfege: '레', duration: 0.5 },
          { note: 'F#4', solfege: '시', duration: 0.5 }
        ]
      },
      {
        measureNum: 3,
        lyrics: '맑은 물 흐르는',
        chords: 'V',
        melodyNotes: [
          { note: 'A4', solfege: '레', duration: 0.5 },
          { note: 'B4', solfege: '미', duration: 0.5 },
          { note: 'C5', solfege: '파', duration: 0.5 },
          { note: 'E5', solfege: '라', duration: 0.5 }
        ]
      },
      {
        measureNum: 4,
        lyrics: '작은 샘터에',
        chords: 'I',
        melodyNotes: [
          { note: 'D5', solfege: '솔', duration: 1.0 },
          { note: 'B4', solfege: '미', duration: 1.0 }
        ]
      },
      {
        measureNum: 5,
        lyrics: '한 잎 랄랄라',
        chords: 'IV',
        melodyNotes: [
          { note: 'E5', solfege: '라', duration: 0.5 },
          { note: 'E5', solfege: '라', duration: 0.5 },
          { note: 'E5', solfege: '라', duration: 0.5 },
          { note: 'G5', solfege: '도', duration: 0.5 }
        ]
      },
      {
        measureNum: 6,
        lyrics: '두 잎 랄랄라',
        chords: 'I',
        melodyNotes: [
          { note: 'D5', solfege: '솔', duration: 0.5 },
          { note: 'D5', solfege: '솔', duration: 0.5 },
          { note: 'D5', solfege: '솔', duration: 0.5 },
          { note: 'B4', solfege: '미', duration: 0.5 }
        ]
      },
      {
        measureNum: 7,
        lyrics: '세 잎 랄랄라',
        chords: 'V',
        melodyNotes: [
          { note: 'C5', solfege: '파', duration: 0.5 },
          { note: 'C5', solfege: '파', duration: 0.5 },
          { note: 'C5', solfege: '파', duration: 0.5 },
          { note: 'A4', solfege: '레', duration: 0.5 }
        ]
      },
      {
        measureNum: 8,
        lyrics: '네 잎 행운을~',
        chords: 'I',
        melodyNotes: [
          { note: 'B4', solfege: '미', duration: 0.5 },
          { note: 'G4', solfege: '도', duration: 1.5 }
        ]
      }
    ]
  },

  {
    id: 'stars-and-moon',
    title: '별 보며 달 보며',
    subtitle: '라단조 노래의 어울림 (교과서 50~51쪽)',
    composer: '유성윤 작사 / 유병무 작곡',
    keyId: 'd-minor',
    timeSignature: '6/8',
    description: '라단조의 서정적인 멜로디! 학생 1(주 멜로디)과 학생 2(어울림 화음 가락)의 2중창 조화를 느껴봅니다.',
    measures: [
      {
        measureNum: 1,
        lyrics: '멀리서 반짝',
        chords: 'i',
        melodyNotes: [
          { note: 'A4', solfege: '미', duration: 0.5 },
          { note: 'D5', solfege: '라', duration: 0.5 },
          { note: 'F5', solfege: '도', duration: 0.5 }
        ],
        harmonyNotes: [
          { note: 'F4', solfege: '도', duration: 0.5 },
          { note: 'A4', solfege: '미', duration: 0.5 },
          { note: 'D5', solfege: '라', duration: 0.5 }
        ]
      },
      {
        measureNum: 2,
        lyrics: '이는',
        chords: 'i',
        melodyNotes: [
          { note: 'E5', solfege: '시', duration: 0.5 },
          { note: 'D5', solfege: '라', duration: 1.0 }
        ],
        harmonyNotes: [
          { note: 'C#5', solfege: '솔#', duration: 0.5 },
          { note: 'D5', solfege: '라', duration: 1.0 }
        ]
      },
      {
        measureNum: 3,
        lyrics: '별님과 같이',
        chords: 'iv',
        melodyNotes: [
          { note: 'G5', solfege: '레', duration: 0.5 },
          { note: 'Bb5', solfege: '파', duration: 0.5 },
          { note: 'A5', solfege: '미', duration: 0.5 }
        ],
        harmonyNotes: [
          { note: 'D5', solfege: '라', duration: 0.5 },
          { note: 'G5', solfege: '레', duration: 0.5 },
          { note: 'F5', solfege: '도', duration: 0.5 }
        ]
      },
      {
        measureNum: 4,
        lyrics: '의좋게 사귀',
        chords: 'V',
        melodyNotes: [
          { note: 'F5', solfege: '도', duration: 0.5 },
          { note: 'E5', solfege: '시', duration: 0.5 },
          { note: 'D5', solfege: '라', duration: 0.5 }
        ],
        harmonyNotes: [
          { note: 'D5', solfege: '라', duration: 0.5 },
          { note: 'C#5', solfege: '솔#', duration: 0.5 },
          { note: 'D5', solfege: '라', duration: 0.5 }
        ]
      },
      {
        measureNum: 5,
        lyrics: '고서 놀아봤',
        chords: 'i',
        melodyNotes: [
          { note: 'D5', solfege: '라', duration: 0.5 },
          { note: 'F5', solfege: '도', duration: 0.5 },
          { note: 'E5', solfege: '시', duration: 0.5 }
        ],
        harmonyNotes: [
          { note: 'Bb4', solfege: '파', duration: 0.5 },
          { note: 'A4', solfege: '미', duration: 0.5 },
          { note: 'G4', solfege: '레', duration: 0.5 }
        ]
      },
      {
        measureNum: 6,
        lyrics: '으면~',
        chords: 'i',
        melodyNotes: [
          { note: 'D5', solfege: '라', duration: 1.5 }
        ],
        harmonyNotes: [
          { note: 'F4', solfege: '도', duration: 1.5 }
        ]
      }
    ]
  },

  {
    id: 'twinkle-star',
    title: '작은 별',
    subtitle: '다장조 주요 3화음 익히기',
    composer: '프랑스 민요 / 모차르트 변주곡',
    keyId: 'c-major',
    timeSignature: '4/4',
    description: '아이들에게 가장 친숙한 곡으로 다장조의 I (C), IV (F), V (G) 화음을 익힙니다.',
    measures: [
      {
        measureNum: 1,
        lyrics: '반짝 반짝',
        chords: 'I',
        melodyNotes: [
          { note: 'C4', solfege: '도', duration: 0.5 },
          { note: 'C4', solfege: '도', duration: 0.5 },
          { note: 'G4', solfege: '솔', duration: 0.5 },
          { note: 'G4', solfege: '솔', duration: 0.5 }
        ]
      },
      {
        measureNum: 2,
        lyrics: '작은 별',
        chords: 'IV',
        melodyNotes: [
          { note: 'A4', solfege: '라', duration: 0.5 },
          { note: 'A4', solfege: '라', duration: 0.5 },
          { note: 'G4', solfege: '솔', duration: 1.0 }
        ]
      },
      {
        measureNum: 3,
        lyrics: '아름답게',
        chords: 'V',
        melodyNotes: [
          { note: 'F4', solfege: '파', duration: 0.5 },
          { note: 'F4', solfege: '파', duration: 0.5 },
          { note: 'E4', solfege: '미', duration: 0.5 },
          { note: 'E4', solfege: '미', duration: 0.5 }
        ]
      },
      {
        measureNum: 4,
        lyrics: '비치네',
        chords: 'I',
        melodyNotes: [
          { note: 'D4', solfege: '레', duration: 0.5 },
          { note: 'D4', solfege: '레', duration: 0.5 },
          { note: 'C4', solfege: '도', duration: 1.0 }
        ]
      }
    ]
  }
];

// 초등학생 및 선생님을 위한 친절한 화성학 비밀 Q&A 데이터
export interface TheoryQuestion {
  id: string;
  category: string;
  question: string;
  summary: string;
  analogy: string; // 어린이 눈높이 비유
  details: string[];
  interactiveDemoType: 'name-vs-solfege' | 'step-stairs' | 'major-vs-minor' | 'key-signature-rule';
}

export const THEORY_QUESTIONS: TheoryQuestion[] = [
  {
    id: 'name-vs-solfege',
    category: '음이름 vs 계이름',
    question: '음이름이랑 계이름은 왜 다르고, 왜 사장조에서는 솔을 도로 불러요?',
    summary: '음이름은 건반의 "주민등록번호(고정 주소)"이고, 계이름은 노래 속에서의 "역할(아빠, 맏이, 막내)"이에요!',
    analogy: '김철수 선생님이 학교에 가면 "선생님", 집에 가면 "아빠", 축구할 땐 "공격수"로 불리는 것처럼요!',
    details: [
      '피아노 건반의 다(C), 라(D), 마(E), 바(F), 사(G), 가(A), 나(B)는 평생 변하지 않는 절대적인 "음이름"이에요.',
      '하지만 노래를 부를 때 "도 레 미 파 솔 라 시 도"는 각 조의 주인공(으뜸음)이 누구냐에 따라 움직여요(이동도법).',
      '사장조에서는 대장(으뜸음)이 "사(G)" 음이기 때문에, 사(G) 음을 "도"라고 부르고 시작하는 거예요!',
      '그래서 악보에 솔 자리에 그려져 있어도, 사장조 곡을 부를 때는 "도~"라고 계이름으로 노래합니다.'
    ],
    interactiveDemoType: 'name-vs-solfege'
  },
  {
    id: 'step-stairs',
    category: '샵(#)과 플랫(b)의 비밀',
    question: '라장조나 사장조 스케일을 연습할 때 왜 샵(#)이나 플랫(b)을 붙여야 해요?',
    summary: '도레미파솔라시도의 자연스러운 멜로디는 "3-4번(미-파)"과 "7-8번(시-도)"이 딱 붙은 반음이어야 하기 때문이에요!',
    analogy: '계단을 올라갈 때 3번째와 7번째 칸만 반 칸 높이로 되어 있어요. 출발 계단을 다른 곳으로 바꾸면 반 칸 자리를 맞추기 위해 받침목(#이나 b)을 괴어야 해요!',
    details: [
      '장음계의 황금 규칙: [온음 - 온음 - 반음 - 온음 - 온음 - 온음 - 반음] (미-파와 시-도가 반음!)',
      '사장조는 솔(G)부터 출발해요: 솔-라(온음), 라-시(온음), 시-도(반음!), 도-레(온음), 레-미(온음)... 그런데 미 다음 파는 원래 반음이라서 온음으로 벌려주기 위해 "파#"으로 반음 올려야 해요!',
      '파#이 되니 마지막 파#에서 솔까지가 딱 예쁜 반음(7-8)이 완성되어 경쾌한 도레미파솔라시도가 됩니다.'
    ],
    interactiveDemoType: 'step-stairs'
  },
  {
    id: 'major-vs-minor',
    category: '장조 vs 단조',
    question: '장조는 왜 밝고, 단조는 왜 슬프고 아련하게 들리나요?',
    summary: '으뜸화음의 첫 계단(1음과 3음 사이)이 "넓은 장3도(4반음)"이면 햇살처럼 밝고, "좁은 단3도(3반음)"이면 달빛처럼 차분해져요!',
    analogy: '장조는 활짝 웃는 햇님 ☀️, 단조는 은은하게 빛나는 밤하늘의 달님 🌙 이에요!',
    details: [
      '다장조 으뜸화음(도-미-솔): 도와 미 사이가 건반 4칸(장3도)이라 밝고 씩씩합니다.',
      '라단조 으뜸화음(레-파-라): 레와 파 사이가 건반 3칸(단3도)이라 감성적이고 촉촉한 울림이 납니다.',
      '교과서 50쪽 <별 보며 달 보며>가 밤하늘의 은은한 감성을 줄 수 있는 이유가 바로 이 "단조(라단조)"의 화음 어울림 덕분이에요!'
    ],
    interactiveDemoType: 'major-vs-minor'
  },
  {
    id: 'key-signature-rule',
    category: '조표 찾는 마법 공식',
    question: '악보 맨 앞의 샵(#)이나 플랫(b)을 보고 으뜸음(도)을 어떻게 단 1초 만에 찾나요?',
    summary: '#이 붙으면 "마지막 #의 바로 윗음"이 도! b이 붙으면 "끝에서 두 번째 b" 또는 4도 아래가 도!',
    analogy: '보물찾기 지도에 표시된 화살표예요!',
    details: [
      '샵(#)의 마법: 조표 맨 마지막 샵에서 바로 다음 음(반음 위)을 읽으면 그게 바로 으뜸음(도)이에요. 예: 파# 1개 -> 바로 위 솔(사)이 도! -> 사장조!',
      '플랫(b)의 마법: 조표가 여러 개일 때 끝에서 두 번째 플랫이 바로 으뜸음! (b 1개인 바장조는 시b에서 4도 내려간 파(F)가 으뜸음!)',
      '단조 찾는 법: 같은 조표를 쓰는 장조의 "도"에서 3반음(단3도) 아래로 내려간 음이 바로 단조의 으뜸음 "라"가 돼요! (다장조 짝꿍은 가단조, 바장조 짝꿍은 라단조!)'
    ],
    interactiveDemoType: 'key-signature-rule'
  },
  {
    id: 'why-few-keys',
    category: '교과서 조(Key)의 비밀',
    question: '원래 조(Key)가 몇 개 없나요? 왜 초등학교에선 다·사·바·라장조만 배워요?',
    summary: '서양음악 전체에는 24개(장조 12개, 단조 12개)의 조가 있지만, 초등학교에서는 어린이 목소리 음역과 악기 연주에 가장 알맞은 조표 1~2개 조를 배웁니다!',
    analogy: '어린이 자전거에 꼭 맞는 안장 높이가 있듯, 초등학생이 편안하게 부르고 연주할 수 있는 황금 음역대를 고른 거예요!',
    details: [
      '서양음악의 5도권(Circle of Fifths) 순환표를 보면, 조표(#과 b)가 늘어나면서 총 24개의 서로 다른 장조와 단조가 존재해요.',
      '하지만 샵이나 플랫이 4~5개씩 붙으면 초등학생들의 리코더나 멜로디언 운지가 너무 까다로워지고, 음높이가 너무 높거나 낮아져 노래 부르기 힘들어요.',
      '그래서 초등학교 교과서에서는 [다·사·바·라·내림나장조]와 [가·라·마단조]처럼 조표가 1~2개 이내인 친근하고 안전한 조들을 엄선하여 즐겁게 배우도록 구성되어 있습니다!'
    ],
    interactiveDemoType: 'key-signature-rule'
  },
  {
    id: 'harmony-vs-chord',
    category: '화음과 소리의 어울림',
    question: '초등학교에서는 왜 "화성학" 대신 "화음"이나 "소리의 어울림"이라고 부를까요?',
    summary: '"화성학"은 대학이나 전공자들이 음악을 분석하는 어려운 학문 용어예요. 초등학교 교과서에서는 둘 이상의 음이 아름답게 조화를 이루는 감각을 느끼기 위해 "화음"과 "소리의 어울림"이라는 말을 씁니다!',
    analogy: '"식품영양화학 분석" 대신 "맛있는 음식 함께 어울려 맛보기"라고 부르는 것과 같아요!',
    details: [
      '2015·2022 개정 초등 음악과 교육과정에서는 딱딱한 이론 용어인 "화성학"을 쓰지 않고, "소리의 어울림", "화음 반주하기", "주요 3화음"이라는 친근한 표현을 씁니다.',
      '"화음(Chord)"은 2개 이상의 음이 동시에 울리는 소리를 말하고, "소리의 어울림"은 그 화음들이 노래 가락과 어우러져 만들어내는 조화로운 감각이에요.',
      '초등 교육의 진짜 목표는 어려운 화성학 공식을 외우는 것이 아니라, 실로폰이나 멜로디언으로 I, IV, V 화음을 직접 쳐보며 "소리가 참 예쁘게 어울린다!"라고 귀와 마음으로 느끼는 것입니다!'
    ],
    interactiveDemoType: 'name-vs-solfege'
  }
];

