export type PitchClass = 
  | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export type NoteName = 
  | 'C' | 'C#' | 'Db' | 'D' | 'D#' | 'Eb' | 'E' | 'F' | 'F#' | 'Gb' | 'G' | 'G#' | 'Ab' | 'A' | 'A#' | 'Bb' | 'B';

export interface NoteInfo {
  pitchClass: PitchClass;
  octave: number;
  midiNumber: number;
  frequency: number;
  displayName: string;
  solfege: string; // 도, 레, 미...
  isBlack: boolean;
}

export type ChordCategory = 'triad' | 'seventh' | 'extended' | 'suspended';

export interface ChordDefinition {
  id: string;
  name: string; // e.g., 'Major', 'Minor', 'Dominant 7th'
  symbol: string; // '', 'm', '7', 'maj7'
  koreanName: string; // '장3화음', '단3화음'
  category: ChordCategory;
  intervals: number[]; // semitones from root, e.g., [0, 4, 7]
  intervalNames: string[]; // ['근음', '장3도', '완전5도']
  description: string;
  mood: string; // '밝고 당당함', '슬프고 차분함'
  formula: string; // '1 - 3 - 5', '1 - b3 - 5'
}

export type InversionType = 0 | 1 | 2 | 3; // 0 = Root, 1 = 1st, 2 = 2nd, 3 = 3rd

export interface ActiveChord {
  root: PitchClass;
  chordType: ChordDefinition;
  inversion: InversionType;
  notes: NoteInfo[];
}

export interface ProgressionStep {
  root: PitchClass;
  chordId: string;
  numeral: string; // 'I', 'IV', 'V', 'vi'
  koreanRole: string; // '으뜸화음 (토닉)', '버금딸림화음 (서브도미넌트)', '딸림화음 (도미넌트)'
  durationBeats: number;
}

export interface ProgressionTemplate {
  id: string;
  name: string;
  category: string; // '기초/클래식', '대중음악/가요', '재즈', '종지법'
  description: string;
  steps: ProgressionStep[];
  cadenceType?: string;
}

export type QuizMode = 'ear-training' | 'chord-building';
export type QuizDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface QuizQuestion {
  id: string;
  mode: QuizMode;
  targetChord: ActiveChord;
  options?: {
    id: string;
    label: string;
    chordId: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}
