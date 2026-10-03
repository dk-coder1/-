import { ChordDefinition, NoteInfo, PitchClass, ProgressionTemplate, InversionType } from '../types/music';

export const PITCH_CLASSES: PitchClass[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

export const ENHARMONIC_EQUIVALENTS: Record<string, PitchClass> = {
  'Db': 'C#',
  'Eb': 'D#',
  'Gb': 'F#',
  'Ab': 'G#',
  'Bb': 'A#',
};

export const SOLFEGE_MAP: Record<PitchClass, string> = {
  'C': '도',
  'C#': '도#',
  'D': '레',
  'D#': '레#',
  'E': '미',
  'F': '파',
  'F#': '파#',
  'G': '솔',
  'G#': '솔#',
  'A': '라',
  'A#': '라#',
  'B': '시',
};

export const KOREAN_NOTE_NAMES: Record<PitchClass, string> = {
  'C': '다',
  'C#': '올림다',
  'D': '라',
  'D#': '올림라',
  'E': '마',
  'F': '바',
  'F#': '올림바',
  'G': '사',
  'G#': '올림사',
  'A': '가',
  'A#': '올림가',
  'B': '나',
};

export const CHORD_DEFINITIONS: ChordDefinition[] = [
  // 3화음 (Triads)
  {
    id: 'major',
    name: 'Major',
    symbol: '',
    koreanName: '장3화음',
    category: 'triad',
    intervals: [0, 4, 7],
    intervalNames: ['근음 (1)', '장3도 (M3)', '완전5도 (P5)'],
    description: '가장 기본적이고 밝고 안정적인 화음입니다. 장3도(반음 4개) 위에 단3도(반음 3개)를 쌓아 만듭니다.',
    mood: '밝음, 당당함, 희망참, 안정적',
    formula: '1 - 3 - 5'
  },
  {
    id: 'minor',
    name: 'Minor',
    symbol: 'm',
    koreanName: '단3화음',
    category: 'triad',
    intervals: [0, 3, 7],
    intervalNames: ['근음 (1)', '단3도 (m3)', '완전5도 (P5)'],
    description: '감성적이고 슬프며 차분한 느낌을 주는 화음입니다. 단3도 위에 장3도를 쌓아 만듭니다.',
    mood: '슬픔, 감성적, 차분함, 진지함',
    formula: '1 - ♭3 - 5'
  },
  {
    id: 'augmented',
    name: 'Augmented',
    symbol: 'aug',
    koreanName: '증3화음',
    category: 'triad',
    intervals: [0, 4, 8],
    intervalNames: ['근음 (1)', '장3도 (M3)', '증5도 (aug5)'],
    description: '장3도 위에 다시 장3도를 쌓은 화음으로, 공중에 떠 있는 듯한 신비롭고 몽환적인 긴장감을 만듭니다.',
    mood: '신비로움, 몽환적, 미완성, 팽창감',
    formula: '1 - 3 - ♯5'
  },
  {
    id: 'diminished',
    name: 'Diminished',
    symbol: 'dim',
    koreanName: '감3화음',
    category: 'triad',
    intervals: [0, 3, 6],
    intervalNames: ['근음 (1)', '단3도 (m3)', '감5도 (dim5)'],
    description: '단3도 위에 다시 단3도를 쌓은 화음으로, 어둡고 긴장감이 높으며 서스펜스 영화 같은 불안정한 느낌을 줍니다.',
    mood: '불안함, 긴장됨, 어두움, 긴박함',
    formula: '1 - ♭3 - ♭5'
  },
  {
    id: 'sus4',
    name: 'Suspended 4th',
    symbol: 'sus4',
    koreanName: '서스포 (서스펜디드 4)',
    category: 'suspended',
    intervals: [0, 5, 7],
    intervalNames: ['근음 (1)', '완전4도 (P4)', '완전5도 (P5)'],
    description: '3음 대신 4음을 넣어 만든 화음으로, 3음으로 해결되고 싶어 하는 기분 좋은 긴장감을 선사합니다.',
    mood: '열린 느낌, 기대감, 맑은 긴장, 해결 대기',
    formula: '1 - 4 - 5'
  },
  {
    id: 'sus2',
    name: 'Suspended 2nd',
    symbol: 'sus2',
    koreanName: '서스투 (서스펜디드 2)',
    category: 'suspended',
    intervals: [0, 2, 7],
    intervalNames: ['근음 (1)', '장2도 (M2)', '완전5도 (P5)'],
    description: '3음 대신 2음을 넣어 아련하고 공간감이 넓게 퍼지는 현대적인 사운드를 만듭니다.',
    mood: '청량함, 아련함, 공간감, 서정적',
    formula: '1 - 2 - 5'
  },

  // 7화음 (7th Chords)
  {
    id: 'maj7',
    name: 'Major 7th',
    symbol: 'maj7',
    koreanName: '장7화음 (메이저 7)',
    category: 'seventh',
    intervals: [0, 4, 7, 11],
    intervalNames: ['근음 (1)', '장3도 (M3)', '완전5도 (P5)', '장7도 (M7)'],
    description: '장3화음에 장7도를 더해 부드럽고 세련되며 도회적인 분위기(재즈, 시티팝, 보사노바)를 냅니다.',
    mood: '세련됨, 낭만적, 부드러움, 따뜻함',
    formula: '1 - 3 - 5 - 7'
  },
  {
    id: 'dom7',
    name: 'Dominant 7th',
    symbol: '7',
    koreanName: '딸림7화음 (도미넌트 7)',
    category: 'seventh',
    intervals: [0, 4, 7, 10],
    intervalNames: ['근음 (1)', '장3도 (M3)', '완전5도 (P5)', '단7도 (m7)'],
    description: '3음과 7음 사이에 감5도(트라이톤)가 있어 강력한 해결 충동을 가집니다. 블루스, 록, 클래식의 핵심 종지 화음입니다.',
    mood: '강한 끌림, 긴장감, 블루지함, 역동적',
    formula: '1 - 3 - 5 - ♭7'
  },
  {
    id: 'm7',
    name: 'Minor 7th',
    symbol: 'm7',
    koreanName: '단7화음 (마이너 7)',
    category: 'seventh',
    intervals: [0, 3, 7, 10],
    intervalNames: ['근음 (1)', '단3도 (m3)', '완전5도 (P5)', '단7도 (m7)'],
    description: '단3화음에 단7도를 더해 멜랑콜리하면서도 감미롭고 지적인 그루브를 연출합니다.',
    mood: '감미로움, 그루비함, 서정적, 포근함',
    formula: '1 - ♭3 - 5 - ♭7'
  },
  {
    id: 'm7b5',
    name: 'Half-Diminished 7th',
    symbol: 'm7♭5',
    koreanName: '반감7화음 (하프 디미니쉬)',
    category: 'seventh',
    intervals: [0, 3, 6, 10],
    intervalNames: ['근음 (1)', '단3도 (m3)', '감5도 (dim5)', '단7도 (m7)'],
    description: '감3화음에 단7도를 더한 코드로, 단조 진행의 ii 도로 자주 사용되어 깊은 애수를 띱니다.',
    mood: '애절함, 깊은 우수, 시련, 영화적',
    formula: '1 - ♭3 - ♭5 - ♭7'
  },
  {
    id: 'dim7',
    name: 'Diminished 7th',
    symbol: 'dim7',
    koreanName: '감7화음 (디미니쉬 7)',
    category: 'seventh',
    intervals: [0, 3, 6, 9],
    intervalNames: ['근음 (1)', '단3도 (m3)', '감5도 (dim5)', '감7도 (dim7)'],
    description: '모든 음 사이가 단3도로 동일하게 이루어진 대칭적 화음으로, 극적인 전조나 위기 상황에 최고의 긴장을 연출합니다.',
    mood: '극적 위기, 으스스함, 긴박감, 극대화된 긴장',
    formula: '1 - ♭3 - ♭5 - 𝄫7'
  },
  {
    id: 'mmaj7',
    name: 'Minor Major 7th',
    symbol: 'm(maj7)',
    koreanName: '단장7화음 (마이너 메이저 7)',
    category: 'seventh',
    intervals: [0, 3, 7, 11],
    intervalNames: ['근음 (1)', '단3도 (m3)', '완전5도 (P5)', '장7도 (M7)'],
    description: '마이너의 슬픔과 메이저7의 날카로움이 융합된 화음으로, 007 제임스본드 테마 같은 스파이 영화 사운드의 대표주자입니다.',
    mood: '비밀스러움, 첩보 영화, 서늘함, 미스터리',
    formula: '1 - ♭3 - 5 - 7'
  },

  // 확장화음 (Extended & Add)
  {
    id: 'add9',
    name: 'Add 9',
    symbol: 'add9',
    koreanName: '애드나인',
    category: 'extended',
    intervals: [0, 4, 7, 14], // 14 semitones = 9th
    intervalNames: ['근음 (1)', '장3도 (M3)', '완전5도 (P5)', '장9도 (9)'],
    description: '기본 메이저 화음에 9음(2음의 한옥타브 위)을 추가하여 반짝이는 햇살 같은 맑고 풍성한 음향을 만듭니다.',
    mood: '반짝임, 화사함, 풍성함, 팝적인 감성',
    formula: '1 - 3 - 5 - 9'
  },
  {
    id: '6',
    name: 'Major 6th',
    symbol: '6',
    koreanName: '6화음 (메이저 식스)',
    category: 'extended',
    intervals: [0, 4, 7, 9],
    intervalNames: ['근음 (1)', '장3도 (M3)', '완전5도 (P5)', '장6도 (M6)'],
    description: '고전 스윙 재즈와 컨트리, 보사노바에서 엔딩 코드로 사랑받는 편안하고 달콤한 화음입니다.',
    mood: '아늑함, 빈티지, 편안함, 달콤함',
    formula: '1 - 3 - 5 - 6'
  },
  {
    id: '9',
    name: 'Dominant 9th',
    symbol: '9',
    koreanName: '도미넌트 9',
    category: 'extended',
    intervals: [0, 4, 7, 10, 14],
    intervalNames: ['근음 (1)', '장3도 (M3)', '완전5도 (P5)', '단7도 (m7)', '장9도 (9)'],
    description: '훵크(Funk), 알앤비(R&B), 재즈에서 춤추게 만드는 그루브와 풍성한 텐션을 주는 화음입니다.',
    mood: '훵키함, 도시적, 세련된 그루브, 풍부함',
    formula: '1 - 3 - 5 - ♭7 - 9'
  }
];

export function getMidiNumber(pitchClass: PitchClass, octave: number): number {
  const index = PITCH_CLASSES.indexOf(pitchClass);
  return (octave + 1) * 12 + index;
}

export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function isBlackKey(pitchClass: PitchClass): boolean {
  return pitchClass.includes('#');
}

export function createNoteInfo(pitchClass: PitchClass, octave: number): NoteInfo {
  const midiNumber = getMidiNumber(pitchClass, octave);
  const frequency = midiToFrequency(midiNumber);
  const isBlack = isBlackKey(pitchClass);
  const solfege = SOLFEGE_MAP[pitchClass];

  return {
    pitchClass,
    octave,
    midiNumber,
    frequency,
    displayName: `${pitchClass}${octave}`,
    solfege: `${solfege}${octave}`,
    isBlack,
  };
}

export function midiToNoteInfo(midi: number): NoteInfo {
  const octave = Math.floor(midi / 12) - 1;
  const noteIndex = midi % 12;
  const pitchClass = PITCH_CLASSES[noteIndex];
  return createNoteInfo(pitchClass, octave);
}

export function buildChordNotes(
  root: PitchClass,
  chordDef: ChordDefinition,
  baseOctave: number = 4,
  inversion: InversionType = 0
): NoteInfo[] {
  const rootIndex = PITCH_CLASSES.indexOf(root);
  const rawNotes: NoteInfo[] = [];

  chordDef.intervals.forEach((interval) => {
    const totalSemitones = rootIndex + interval;
    const notePitchClass = PITCH_CLASSES[totalSemitones % 12];
    const octaveOffset = Math.floor(totalSemitones / 12);
    const noteOctave = baseOctave + octaveOffset;
    rawNotes.push(createNoteInfo(notePitchClass, noteOctave));
  });

  // Apply inversion
  // Inversion 1: move 1st note up 1 octave
  // Inversion 2: move 1st & 2nd note up 1 octave
  // Inversion 3: move 1st, 2nd & 3rd note up 1 octave
  const invertedNotes = [...rawNotes];
  const notesCount = invertedNotes.length;
  const inv = Math.min(inversion, notesCount - 1);

  for (let i = 0; i < inv; i++) {
    const moved = invertedNotes.shift()!;
    invertedNotes.push(createNoteInfo(moved.pitchClass, moved.octave + 1));
  }

  // Sort by MIDI number to maintain bottom-to-top order
  return invertedNotes.sort((a, b) => a.midiNumber - b.midiNumber);
}

export function getInversionName(inversion: InversionType, isSeventh: boolean = false): {
  korean: string;
  english: string;
  bassRole: string;
} {
  switch (inversion) {
    case 1:
      return { korean: '제1전위', english: '1st Inversion', bassRole: '3음이 가장 낮은 베이스음' };
    case 2:
      return { korean: '제2전위', english: '2nd Inversion', bassRole: '5음이 가장 낮은 베이스음' };
    case 3:
      return isSeventh 
        ? { korean: '제3전위', english: '3rd Inversion', bassRole: '7음이 가장 낮은 베이스음' }
        : { korean: '기본위치', english: 'Root Position', bassRole: '근음이 가장 낮은 베이스음' };
    default:
      return { korean: '기본위치 (Root)', english: 'Root Position', bassRole: '근음(Root)이 가장 낮은 베이스음' };
  }
}

// Progression templates
export const PROGRESSION_TEMPLATES: ProgressionTemplate[] = [
  {
    id: 'classic-basic',
    name: '기본 주요 3화음 진행 (I - IV - V - I)',
    category: '기초/클래식',
    description: '음악의 기승전결을 이루는 가장 기본적이고 튼튼한 진행입니다. 으뜸(I) → 버금딸림(IV) → 딸림(V)의 긴장 후 다시 으뜸화음으로 완벽하게 안착합니다.',
    cadenceType: '바른종지 (Authentic Cadence)',
    steps: [
      { root: 'C', chordId: 'major', numeral: 'I', koreanRole: '으뜸화음 (토닉) - 시작', durationBeats: 4 },
      { root: 'F', chordId: 'major', numeral: 'IV', koreanRole: '버금딸림화음 (서브도미넌트) - 전개', durationBeats: 4 },
      { root: 'G', chordId: 'major', numeral: 'V', koreanRole: '딸림화음 (도미넌트) - 최대 긴장', durationBeats: 4 },
      { root: 'C', chordId: 'major', numeral: 'I', koreanRole: '으뜸화음 (토닉) - 완전 해결', durationBeats: 4 },
    ]
  },
  {
    id: 'canon-progression',
    name: '파헬벨 캐논 진행 (Canon in C)',
    category: '기초/클래식',
    description: '수백 년 동안 수많은 클래식과 가요(신승훈, god, SG워너비 등)에서 감동을 준 하향 베이스 선율의 불후의 명진행입니다.',
    steps: [
      { root: 'C', chordId: 'major', numeral: 'I', koreanRole: '으뜸화음', durationBeats: 4 },
      { root: 'G', chordId: 'major', numeral: 'V', koreanRole: '딸림화음', durationBeats: 4 },
      { root: 'A', chordId: 'minor', numeral: 'vi', koreanRole: '나란한조 단화음', durationBeats: 4 },
      { root: 'E', chordId: 'minor', numeral: 'iii', koreanRole: '가온화음', durationBeats: 4 },
      { root: 'F', chordId: 'major', numeral: 'IV', koreanRole: '버금딸림화음', durationBeats: 4 },
      { root: 'C', chordId: 'major', numeral: 'I', koreanRole: '으뜸화음', durationBeats: 4 },
      { root: 'F', chordId: 'major', numeral: 'IV', koreanRole: '버금딸림화음', durationBeats: 4 },
      { root: 'G', chordId: 'major', numeral: 'V', koreanRole: '딸림화음', durationBeats: 4 },
    ]
  },
  {
    id: 'pop-money-chord',
    name: '대중음악 머니코드 (I - V - vi - IV)',
    category: '대중음악/가요',
    description: '전 세계 빌보드 1위 히트곡 및 K-POP에서 가장 많은 사랑을 받은 마법의 4코드 진행입니다. 희망과 감동을 동시에 줍니다.',
    steps: [
      { root: 'C', chordId: 'major', numeral: 'I', koreanRole: 'C (으뜸화음)', durationBeats: 4 },
      { root: 'G', chordId: 'major', numeral: 'V', koreanRole: 'G (딸림화음)', durationBeats: 4 },
      { root: 'A', chordId: 'minor', numeral: 'vi', koreanRole: 'Am (감성적 단화음)', durationBeats: 4 },
      { root: 'F', chordId: 'major', numeral: 'IV', koreanRole: 'F (밝은 도약)', durationBeats: 4 },
    ]
  },
  {
    id: 'emotional-minor-walk',
    name: '감성 애상 진행 (vi - IV - I - V)',
    category: '대중음악/가요',
    description: '아련한 단조로 시작하여 웅장한 감동으로 이어지는 발라드, 애니메이션 OST 단골 진행입니다.',
    steps: [
      { root: 'A', chordId: 'minor', numeral: 'vi', koreanRole: 'Am (애수어린 시작)', durationBeats: 4 },
      { root: 'F', chordId: 'major', numeral: 'IV', koreanRole: 'F (감정의 고조)', durationBeats: 4 },
      { root: 'C', chordId: 'major', numeral: 'I', koreanRole: 'C (빛나는 해결)', durationBeats: 4 },
      { root: 'G', chordId: 'major', numeral: 'V', koreanRole: 'G (다음 순환 연결)', durationBeats: 4 },
    ]
  },
  {
    id: 'jazz-two-five-one',
    name: '재즈 투파이브원 (ii - V - I)',
    category: '재즈',
    description: '재즈 및 현대 대중음악의 심장입니다. Dm7 → G7의 팽팽한 도미넌트 긴장 후 Cmaj7으로의 스무스한 세련된 낙하를 경험하세요.',
    cadenceType: '재즈 바른종지',
    steps: [
      { root: 'D', chordId: 'm7', numeral: 'ii7', koreanRole: 'Dm7 (서브도미넌트 대리)', durationBeats: 4 },
      { root: 'G', chordId: 'dom7', numeral: 'V7', koreanRole: 'G7 (트라이톤 긴장)', durationBeats: 4 },
      { root: 'C', chordId: 'maj7', numeral: 'Imaj7', koreanRole: 'Cmaj7 (세련된 토닉 해결)', durationBeats: 4 },
    ]
  },
  {
    id: 'cadence-plagal',
    name: '변격종지 / 아멘종지 (IV - I)',
    category: '종지법',
    description: '찬송가 끝에 나오는 "아-멘" 소리로 유명하며, V-I와는 다른 평화롭고 성스러운 마무리를 줍니다.',
    cadenceType: '변격종지 (Plagal Cadence)',
    steps: [
      { root: 'F', chordId: 'major', numeral: 'IV', koreanRole: 'F (아-)', durationBeats: 4 },
      { root: 'C', chordId: 'major', numeral: 'I', koreanRole: 'C (-멘 / 평화로운 안착)', durationBeats: 4 },
    ]
  },
  {
    id: 'cadence-deceptive',
    name: '거짓종지 / 위종지 (V - vi)',
    category: '종지법',
    description: 'V 다음 당연히 I가 올 것으로 기대되는 순간, 예상치 못한 vi(Am)로 살짝 비틀어 여운과 극적 반전을 줍니다.',
    cadenceType: '위종지 (Deceptive Cadence)',
    steps: [
      { root: 'C', chordId: 'major', numeral: 'I', koreanRole: 'C (시작)', durationBeats: 4 },
      { root: 'F', chordId: 'major', numeral: 'IV', koreanRole: 'F (전개)', durationBeats: 4 },
      { root: 'G', chordId: 'major', numeral: 'V', koreanRole: 'G (기대감 고조)', durationBeats: 4 },
      { root: 'A', chordId: 'minor', numeral: 'vi', koreanRole: 'Am (예상을 깬 반전 여운!)', durationBeats: 4 },
    ]
  }
];

// Chord detection algorithm
export function detectChord(midiNotes: number[]): {
  chordName: string;
  koreanName: string;
  root: PitchClass;
  formula: string;
  notes: NoteInfo[];
} | null {
  if (midiNotes.length < 2) return null;

  const sortedMidi = [...new Set(midiNotes)].sort((a, b) => a - b);
  const pitchClasses = sortedMidi.map(m => PITCH_CLASSES[m % 12]);
  const uniquePitchClasses = [...new Set(pitchClasses)];

  // Try each note in the set as the root candidate
  for (const rootCandidate of uniquePitchClasses) {
    const rootIndex = PITCH_CLASSES.indexOf(rootCandidate);
    const intervalsFromRoot = uniquePitchClasses.map(p => {
      const idx = PITCH_CLASSES.indexOf(p);
      return (idx - rootIndex + 12) % 12;
    }).sort((a, b) => a - b);

    for (const def of CHORD_DEFINITIONS) {
      const defNormalized = def.intervals.map(i => i % 12).sort((a, b) => a - b);
      const uniqueDef = [...new Set(defNormalized)];

      // Check if exact match of interval set
      if (
        intervalsFromRoot.length === uniqueDef.length &&
        intervalsFromRoot.every((val, i) => val === uniqueDef[i])
      ) {
        return {
          chordName: `${rootCandidate}${def.symbol}`,
          koreanName: `${rootCandidate} ${def.koreanName}`,
          root: rootCandidate,
          formula: def.formula,
          notes: sortedMidi.map(m => midiToNoteInfo(m)),
        };
      }
    }
  }

  // Fallback for partial or interval:
  if (sortedMidi.length === 2) {
    const semitones = Math.abs(sortedMidi[1] - sortedMidi[0]) % 12;
    const intervalNames: Record<number, string> = {
      1: '단2도', 2: '장2도', 3: '단3도', 4: '장3도',
      5: '완전4도', 6: '증4도/감5도 (트라이톤)', 7: '완전5도 (파워코드 5)',
      8: '단6도', 9: '장6도', 10: '단7도', 11: '장7도'
    };
    const root = PITCH_CLASSES[sortedMidi[0] % 12];
    return {
      chordName: `${root} (${intervalNames[semitones] || '음정'})`,
      koreanName: `${intervalNames[semitones] || '음정'}`,
      root,
      formula: `간격: ${semitones}반음`,
      notes: sortedMidi.map(m => midiToNoteInfo(m)),
    };
  }

  return null;
}
