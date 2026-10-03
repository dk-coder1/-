import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { soundEngine } from '../utils/audioEngine';
import {
  Sparkles,
  Play,
  Volume2,
  Compass,
  Sun,
  Moon,
  Info
} from 'lucide-react';

export interface RelativeKeyPair {
  id: string;
  majorName: string;
  majorShort: string;
  majorTonicNote: string;
  majorTonicPitch: string;
  majorTonicKorean: string;
  
  minorName: string;
  minorShort: string;
  minorTonicNote: string;
  minorTonicPitch: string;
  minorTonicKorean: string;
  
  keySignatureDesc: string;
  keySignatureType: 'none' | 'sharp' | 'flat';
  accidentals: string[];
  
  textbookBadge: string;
  
  shiftSteps: { note: string; pitch: string; semitoneOffset: number; label: string }[];
  
  majorScale: { degree: number; solfege: string; pitch: string; korean: string; note: string }[];
  
  minorScale: { degree: number; solfege: string; pitch: string; korean: string; note: string }[];
}

export const RELATIVE_KEY_PAIRS: RelativeKeyPair[] = [
  // 1. 바장조 (F) ↔ 라단조 (D) - 교과서 50~51쪽 <별 보며 달 보며>
  {
    id: 'f-major-d-minor',
    majorName: '바장조 (F Major)',
    majorShort: '바장조',
    majorTonicNote: 'F4',
    majorTonicPitch: 'F',
    majorTonicKorean: '바',
    minorName: '라단조 (D minor)',
    minorShort: '라단조',
    minorTonicNote: 'D4',
    minorTonicPitch: 'D',
    minorTonicKorean: '라',
    keySignatureDesc: '내림표(b) 1개 (시b)',
    keySignatureType: 'flat',
    accidentals: ['Bb'],
    textbookBadge: '교과서 <별 보며 달 보며>',
    shiftSteps: [
      { note: 'F4', pitch: 'F', semitoneOffset: 0, label: '도 (장조 으뜸음)' },
      { note: 'E4', pitch: 'E', semitoneOffset: -1, label: '-1반음 (미)' },
      { note: 'D#4', pitch: 'Eb', semitoneOffset: -2, label: '-2반음' },
      { note: 'D4', pitch: 'D', semitoneOffset: -3, label: '라 (단조 으뜸음!)' },
    ],
    majorScale: [
      { degree: 1, solfege: '도', pitch: 'F', korean: '바', note: 'F4' },
      { degree: 2, solfege: '레', pitch: 'G', korean: '사', note: 'G4' },
      { degree: 3, solfege: '미', pitch: 'A', korean: '가', note: 'A4' },
      { degree: 4, solfege: '파', pitch: 'Bb', korean: '내림나', note: 'A#4' },
      { degree: 5, solfege: '솔', pitch: 'C', korean: '다', note: 'C5' },
      { degree: 6, solfege: '라', pitch: 'D', korean: '라', note: 'D5' },
      { degree: 7, solfege: '시', pitch: 'E', korean: '마', note: 'E5' },
    ],
    minorScale: [
      { degree: 1, solfege: '라', pitch: 'D', korean: '라', note: 'D4' },
      { degree: 2, solfege: '시', pitch: 'E', korean: '마', note: 'E4' },
      { degree: 3, solfege: '도', pitch: 'F', korean: '바', note: 'F4' },
      { degree: 4, solfege: '레', pitch: 'G', korean: '사', note: 'G4' },
      { degree: 5, solfege: '미', pitch: 'A', korean: '가', note: 'A4' },
      { degree: 6, solfege: '파', pitch: 'Bb', korean: '내림나', note: 'A#4' },
      { degree: 7, solfege: '솔', pitch: 'C', korean: '다', note: 'C5' },
    ]
  },

  // 2. 다장조 (C) ↔ 가단조 (A) - 초등 기본 나란한 조
  {
    id: 'c-major-a-minor',
    majorName: '다장조 (C Major)',
    majorShort: '다장조',
    majorTonicNote: 'C4',
    majorTonicPitch: 'C',
    majorTonicKorean: '다',
    minorName: '가단조 (A minor)',
    minorShort: '가단조',
    minorTonicNote: 'A3',
    minorTonicPitch: 'A',
    minorTonicKorean: '가',
    keySignatureDesc: '조표 없음 (깨끗함)',
    keySignatureType: 'none',
    accidentals: [],
    textbookBadge: '기초 나란한 조',
    shiftSteps: [
      { note: 'C4', pitch: 'C', semitoneOffset: 0, label: '도 (다장조 으뜸음)' },
      { note: 'B3', pitch: 'B', semitoneOffset: -1, label: '-1반음 (시)' },
      { note: 'A#3', pitch: 'Bb', semitoneOffset: -2, label: '-2반음' },
      { note: 'A3', pitch: 'A', semitoneOffset: -3, label: '라 (가단조 으뜸음!)' },
    ],
    majorScale: [
      { degree: 1, solfege: '도', pitch: 'C', korean: '다', note: 'C4' },
      { degree: 2, solfege: '레', pitch: 'D', korean: '라', note: 'D4' },
      { degree: 3, solfege: '미', pitch: 'E', korean: '마', note: 'E4' },
      { degree: 4, solfege: '파', pitch: 'F', korean: '바', note: 'F4' },
      { degree: 5, solfege: '솔', pitch: 'G', korean: '사', note: 'G4' },
      { degree: 6, solfege: '라', pitch: 'A', korean: '가', note: 'A4' },
      { degree: 7, solfege: '시', pitch: 'B', korean: '나', note: 'B4' },
    ],
    minorScale: [
      { degree: 1, solfege: '라', pitch: 'A', korean: '가', note: 'A3' },
      { degree: 2, solfege: '시', pitch: 'B', korean: '나', note: 'B3' },
      { degree: 3, solfege: '도', pitch: 'C', korean: '다', note: 'C4' },
      { degree: 4, solfege: '레', pitch: 'D', korean: '라', note: 'D4' },
      { degree: 5, solfege: '미', pitch: 'E', korean: '마', note: 'E4' },
      { degree: 6, solfege: '파', pitch: 'F', korean: '바', note: 'F4' },
      { degree: 7, solfege: '솔', pitch: 'G', korean: '사', note: 'G4' },
    ]
  },

  // 3. 사장조 (G) ↔ 마단조 (E) - 교과서 14~15쪽 <네잎클로버>
  {
    id: 'g-major-e-minor',
    majorName: '사장조 (G Major)',
    majorShort: '사장조',
    majorTonicNote: 'G4',
    majorTonicPitch: 'G',
    majorTonicKorean: '사',
    minorName: '마단조 (E minor)',
    minorShort: '마단조',
    minorTonicNote: 'E4',
    minorTonicPitch: 'E',
    minorTonicKorean: '마',
    keySignatureDesc: '올림표(#) 1개 (파#)',
    keySignatureType: 'sharp',
    accidentals: ['F#'],
    textbookBadge: '교과서 <네잎클로버>',
    shiftSteps: [
      { note: 'G4', pitch: 'G', semitoneOffset: 0, label: '도 (사장조 으뜸음)' },
      { note: 'F#4', pitch: 'F#', semitoneOffset: -1, label: '-1반음 (파#)' },
      { note: 'F4', pitch: 'F', semitoneOffset: -2, label: '-2반음 (파)' },
      { note: 'E4', pitch: 'E', semitoneOffset: -3, label: '라 (마단조 으뜸음!)' },
    ],
    majorScale: [
      { degree: 1, solfege: '도', pitch: 'G', korean: '사', note: 'G4' },
      { degree: 2, solfege: '레', pitch: 'A', korean: '가', note: 'A4' },
      { degree: 3, solfege: '미', pitch: 'B', korean: '나', note: 'B4' },
      { degree: 4, solfege: '파', pitch: 'C', korean: '다', note: 'C5' },
      { degree: 5, solfege: '솔', pitch: 'D', korean: '라', note: 'D5' },
      { degree: 6, solfege: '라', pitch: 'E', korean: '마', note: 'E5' },
      { degree: 7, solfege: '시', pitch: 'F#', korean: '올림바', note: 'F#5' },
    ],
    minorScale: [
      { degree: 1, solfege: '라', pitch: 'E', korean: '마', note: 'E4' },
      { degree: 2, solfege: '시', pitch: 'F#', korean: '올림바', note: 'F#4' },
      { degree: 3, solfege: '도', pitch: 'G', korean: '사', note: 'G4' },
      { degree: 4, solfege: '레', pitch: 'A', korean: '가', note: 'A4' },
      { degree: 5, solfege: '미', pitch: 'B', korean: '나', note: 'B4' },
      { degree: 6, solfege: '파', pitch: 'C', korean: '다', note: 'C5' },
      { degree: 7, solfege: '솔', pitch: 'D', korean: '라', note: 'D5' },
    ]
  },

  // 4. 라장조 (D) ↔ 나단조 (B) - # 2개
  {
    id: 'd-major-b-minor',
    majorName: '라장조 (D Major)',
    majorShort: '라장조',
    majorTonicNote: 'D4',
    majorTonicPitch: 'D',
    majorTonicKorean: '라',
    minorName: '나단조 (B minor)',
    minorShort: '나단조',
    minorTonicNote: 'B3',
    minorTonicPitch: 'B',
    minorTonicKorean: '나',
    keySignatureDesc: '올림표(#) 2개 (파#, 도#)',
    keySignatureType: 'sharp',
    accidentals: ['F#', 'C#'],
    textbookBadge: '교과서 음계 단원',
    shiftSteps: [
      { note: 'D4', pitch: 'D', semitoneOffset: 0, label: '도 (라장조 으뜸음)' },
      { note: 'C#4', pitch: 'C#', semitoneOffset: -1, label: '-1반음 (도#)' },
      { note: 'C4', pitch: 'C', semitoneOffset: -2, label: '-2반음 (도)' },
      { note: 'B3', pitch: 'B', semitoneOffset: -3, label: '라 (나단조 으뜸음!)' },
    ],
    majorScale: [
      { degree: 1, solfege: '도', pitch: 'D', korean: '라', note: 'D4' },
      { degree: 2, solfege: '레', pitch: 'E', korean: '마', note: 'E4' },
      { degree: 3, solfege: '미', pitch: 'F#', korean: '올림바', note: 'F#4' },
      { degree: 4, solfege: '파', pitch: 'G', korean: '사', note: 'G4' },
      { degree: 5, solfege: '솔', pitch: 'A', korean: '가', note: 'A4' },
      { degree: 6, solfege: '라', pitch: 'B', korean: '나', note: 'B4' },
      { degree: 7, solfege: '시', pitch: 'C#', korean: '올림다', note: 'C#5' },
    ],
    minorScale: [
      { degree: 1, solfege: '라', pitch: 'B', korean: '나', note: 'B3' },
      { degree: 2, solfege: '시', pitch: 'C#', korean: '올림다', note: 'C#4' },
      { degree: 3, solfege: '도', pitch: 'D', korean: '라', note: 'D4' },
      { degree: 4, solfege: '레', pitch: 'E', korean: '마', note: 'E4' },
      { degree: 5, solfege: '미', pitch: 'F#', korean: '올림바', note: 'F#4' },
      { degree: 6, solfege: '파', pitch: 'G', korean: '사', note: 'G4' },
      { degree: 7, solfege: '솔', pitch: 'A', korean: '가', note: 'A4' },
    ]
  }
];

export const RelativeScaleGraph: React.FC = () => {
  const [selectedPairId, setSelectedPairId] = useState<string>(RELATIVE_KEY_PAIRS[0].id);
  const [activeMode, setActiveMode] = useState<'major' | 'minor'>('major');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeView, setActiveView] = useState<'shift-ladder' | 'circle-orbit'>('shift-ladder');

  const svgRef = useRef<SVGSVGElement | null>(null);

  const pair = RELATIVE_KEY_PAIRS.find(p => p.id === selectedPairId) || RELATIVE_KEY_PAIRS[0];

  const playScaleAudio = (mode: 'major' | 'minor') => {
    const scale = mode === 'major' ? pair.majorScale : pair.minorScale;
    scale.forEach((s, idx) => {
      soundEngine.playNote(s.note, 0.7, idx * 0.35, 0.3);
    });
  };

  const playShiftAudio = () => {
    pair.shiftSteps.forEach((step, idx) => {
      soundEngine.playNote(step.note, 0.8, idx * 0.45, 0.32);
    });
  };

  const playChordComparison = () => {
    const mChord = [pair.majorScale[0].note, pair.majorScale[2].note, pair.majorScale[4].note];
    soundEngine.playChord(mChord, 1.5, 0.03, 0.3);

    setTimeout(() => {
      const minChord = [pair.minorScale[0].note, pair.minorScale[2].note, pair.minorScale[4].note];
      soundEngine.playChord(minChord, 1.8, 0.03, 0.3);
    }, 1800);
  };

  const triggerTonicShiftAnimation = useCallback(() => {
    setIsTransitioning(true);
    setCurrentStep(1);

    soundEngine.playNote(pair.shiftSteps[0].note, 0.8, 0, 0.35);

    setTimeout(() => {
      setCurrentStep(2);
      soundEngine.playNote(pair.shiftSteps[1].note, 0.5, 0, 0.28);
      setTimeout(() => soundEngine.playNote(pair.shiftSteps[2].note, 0.5, 0, 0.28), 350);
    }, 700);

    setTimeout(() => {
      setCurrentStep(3);
      soundEngine.playNote(pair.shiftSteps[3].note, 1.2, 0, 0.38);
      setActiveMode('minor');
    }, 1500);

    setTimeout(() => {
      setCurrentStep(4);
      setIsTransitioning(false);
    }, 2400);
  }, [pair]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 440;

    const defs = svg.append('defs');

    const sunGrad = defs.append('linearGradient').attr('id', 'sun-grad')
      .attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
    sunGrad.append('stop').attr('offset', '0%').attr('stop-color', '#FBBF24');
    sunGrad.append('stop').attr('offset', '100%').attr('stop-color', '#F59E0B');

    const moonGrad = defs.append('linearGradient').attr('id', 'moon-grad')
      .attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
    moonGrad.append('stop').attr('offset', '0%').attr('stop-color', '#818CF8');
    moonGrad.append('stop').attr('offset', '100%').attr('stop-color', '#4F46E5');

    defs.append('marker')
      .attr('id', 'shift-arrow')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', '6')
      .attr('refY', '5')
      .attr('markerWidth', '6')
      .attr('markerHeight', '6')
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d', 'M 0 1.5 L 10 5 L 0 8.5 z')
      .attr('fill', '#EF4444');

    if (activeView === 'shift-ladder') {
      const container = svg.append('g').attr('transform', 'translate(0, 0)');

      container.append('text')
        .attr('x', width / 2)
        .attr('y', 36)
        .attr('text-anchor', 'middle')
        .attr('font-size', '17')
        .attr('font-weight', '900')
        .attr('fill', '#0F172A')
        .attr('font-family', 'sans-serif')
        .text(`[${pair.majorShort}] ➔ [${pair.minorShort}] 으뜸음 이동 다이어그램`);

      container.append('text')
        .attr('x', width / 2)
        .attr('y', 60)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12')
        .attr('font-weight', '700')
        .attr('fill', '#64748B')
        .text(`동일한 조표: ${pair.keySignatureDesc} | 같은 음 7개를 공유하지만 으뜸음이 '도'에서 '라'로 3반음(단3도) 이동합니다.`);

      const shiftGroup = container.append('g').attr('transform', 'translate(100, 95)');

      shiftGroup.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 600)
        .attr('height', 140)
        .attr('rx', 20)
        .attr('fill', '#FFFDF7')
        .attr('stroke', '#FDE68A')
        .attr('stroke-width', 2);

      shiftGroup.append('text')
        .attr('x', 30)
        .attr('y', 30)
        .attr('font-size', '13')
        .attr('font-weight', '900')
        .attr('fill', '#92400E')
        .text('📍 으뜸음 이동 경로: 장조 "도"에서 3반음(단3도) 아래로 쏙!');

      const stepXScale = d3.scalePoint()
        .domain(pair.shiftSteps.map(s => s.pitch))
        .range([80, 520]);

      shiftGroup.append('line')
        .attr('x1', 80)
        .attr('y1', 75)
        .attr('x2', 520)
        .attr('y2', 75)
        .attr('stroke', '#E2E8F0')
        .attr('stroke-width', 6)
        .attr('stroke-linecap', 'round');

      const xStart = 80;
      const xEnd = 520;
      const yPos = 75;
      const arcPath = `M ${xStart} ${yPos} Q ${(xStart + xEnd) / 2} ${yPos - 55} ${xEnd} ${yPos}`;

      const arc = shiftGroup.append('path')
        .attr('d', arcPath)
        .attr('fill', 'none')
        .attr('stroke', '#EF4444')
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', '6 4')
        .attr('marker-end', 'url(#shift-arrow)');

      if (isTransitioning) {
        const totalLength = (arc.node() as SVGPathElement)?.getTotalLength?.() || 400;
        arc
          .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
          .attr('stroke-dashoffset', totalLength)
          .transition()
          .duration(1400)
          .ease(d3.easeCubicInOut)
          .attr('stroke-dashoffset', 0);
      }

      shiftGroup.append('rect')
        .attr('x', 240)
        .attr('y', 30)
        .attr('width', 120)
        .attr('height', 24)
        .attr('rx', 12)
        .attr('fill', '#FEE2E2')
        .attr('stroke', '#EF4444')
        .attr('stroke-width', 1.5);

      shiftGroup.append('text')
        .attr('x', 300)
        .attr('y', 46)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11')
        .attr('font-weight', '900')
        .attr('fill', '#991B1B')
        .text('▼ -3 반음 (단3도)');

      pair.shiftSteps.forEach((step, idx) => {
        const cx = stepXScale(step.pitch) || 80;
        const cy = 75;
        const isStart = idx === 0;
        const isEnd = idx === pair.shiftSteps.length - 1;

        const nodeGroup = shiftGroup.append('g')
          .attr('transform', `translate(${cx}, ${cy})`)
          .style('cursor', 'pointer')
          .on('click', () => {
            soundEngine.playNote(step.note, 0.8, 0, 0.35);
          });

        if (isStart) {
          nodeGroup.append('circle')
            .attr('r', 24)
            .attr('fill', 'url(#sun-grad)')
            .attr('stroke', '#D97706')
            .attr('stroke-width', 3)
            .attr('filter', 'drop-shadow(0 4px 6px rgba(245, 158, 11, 0.3))');

          nodeGroup.append('text')
            .attr('y', -4)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12')
            .attr('font-weight', '900')
            .attr('fill', '#FFFFFF')
            .text('☀️ 도');

          nodeGroup.append('text')
            .attr('y', 12)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10')
            .attr('font-weight', '800')
            .attr('fill', '#FFFBEB')
            .text(`${pair.majorTonicKorean}(${pair.majorTonicPitch})`);
        } else if (isEnd) {
          nodeGroup.append('circle')
            .attr('r', 24)
            .attr('fill', 'url(#moon-grad)')
            .attr('stroke', '#3730A3')
            .attr('stroke-width', 3)
            .attr('filter', 'drop-shadow(0 4px 6px rgba(79, 70, 229, 0.3))');

          nodeGroup.append('text')
            .attr('y', -4)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12')
            .attr('font-weight', '900')
            .attr('fill', '#FFFFFF')
            .text('🌙 라');

          nodeGroup.append('text')
            .attr('y', 12)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10')
            .attr('font-weight', '800')
            .attr('fill', '#EEF2FF')
            .text(`${pair.minorTonicKorean}(${pair.minorTonicPitch})`);
        } else {
          nodeGroup.append('circle')
            .attr('r', 13)
            .attr('fill', '#FFFFFF')
            .attr('stroke', '#CBD5E1')
            .attr('stroke-width', 2);

          nodeGroup.append('text')
            .attr('y', 4)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10')
            .attr('font-weight', '800')
            .attr('fill', '#64748B')
            .text(step.pitch);
        }

        shiftGroup.append('text')
          .attr('x', cx)
          .attr('y', cy + 38)
          .attr('text-anchor', 'middle')
          .attr('font-size', '11')
          .attr('font-weight', isStart || isEnd ? '900' : '600')
          .attr('fill', isStart ? '#B45309' : isEnd ? '#4338CA' : '#64748B')
          .text(step.label);
      });

      const scaleGroup = container.append('g').attr('transform', 'translate(50, 260)');

      scaleGroup.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 700)
        .attr('height', 160)
        .attr('rx', 20)
        .attr('fill', activeMode === 'major' ? '#FEFCE8' : '#EEF2FF')
        .attr('stroke', activeMode === 'major' ? '#FDE047' : '#C7D2FE')
        .attr('stroke-width', 2);

      scaleGroup.append('text')
        .attr('x', 30)
        .attr('y', 32)
        .attr('font-size', '14')
        .attr('font-weight', '900')
        .attr('fill', activeMode === 'major' ? '#854D0E' : '#3730A3')
        .text(activeMode === 'major'
          ? `☀️ [${pair.majorName}]의 7음 구조: "도"를 중심으로 밝고 씩씩하게 펼쳐집니다`
          : `🌙 [${pair.minorName}]의 7음 구조: "라"를 으뜸음으로 차분하고 은은하게 울려 퍼집니다`
        );

      const activeScaleNotes = activeMode === 'major' ? pair.majorScale : pair.minorScale;

      const scaleNodeX = d3.scalePoint()
        .domain(activeScaleNotes.map(n => String(n.degree)))
        .range([50, 650]);

      activeScaleNotes.forEach((n) => {
        const nx = scaleNodeX(String(n.degree)) || 50;
        const ny = 85;
        const isTonic = n.degree === 1;

        const node = scaleGroup.append('g')
          .attr('transform', `translate(${nx}, ${ny})`)
          .style('cursor', 'pointer')
          .on('click', () => {
            soundEngine.playNote(n.note, 0.8, 0, 0.35);
          });

        node.append('circle')
          .attr('r', isTonic ? 25 : 20)
          .attr('fill', isTonic
            ? (activeMode === 'major' ? '#F59E0B' : '#4F46E5')
            : '#FFFFFF'
          )
          .attr('stroke', isTonic
            ? (activeMode === 'major' ? '#D97706' : '#3730A3')
            : '#CBD5E1'
          )
          .attr('stroke-width', isTonic ? 3 : 2)
          .attr('filter', isTonic ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' : 'none');

        node.append('text')
          .attr('y', -3)
          .attr('text-anchor', 'middle')
          .attr('font-size', isTonic ? '14' : '13')
          .attr('font-weight', '900')
          .attr('fill', isTonic ? '#FFFFFF' : '#0F172A')
          .text(n.solfege);

        node.append('text')
          .attr('y', 13)
          .attr('text-anchor', 'middle')
          .attr('font-size', '10')
          .attr('font-weight', '800')
          .attr('fill', isTonic ? '#FEF3C7' : '#64748B')
          .text(`${n.degree}음`);

        scaleGroup.append('text')
          .attr('x', nx)
          .attr('y', ny + 40)
          .attr('text-anchor', 'middle')
          .attr('font-size', '11')
          .attr('font-weight', '800')
          .attr('fill', isTonic
            ? (activeMode === 'major' ? '#B45309' : '#3730A3')
            : '#475569'
          )
          .text(`${n.korean}(${n.pitch})`);
      });
    } else {
      const centerX = width / 2;
      const centerY = height / 2 + 10;
      const rOuter = 150;
      const rInner = 95;

      const orbitGroup = svg.append('g').attr('transform', `translate(${centerX}, ${centerY})`);

      svg.append('text')
        .attr('x', centerX)
        .attr('y', 36)
        .attr('text-anchor', 'middle')
        .attr('font-size', '17')
        .attr('font-weight', '900')
        .attr('fill', '#0F172A')
        .text('🌀 5도권(Circle of Fifths) 나란한 조 동심원 궤도');

      svg.append('text')
        .attr('x', centerX)
        .attr('y', 58)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12')
        .attr('font-weight', '700')
        .attr('fill', '#64748B')
        .text('바깥쪽 원은 장조(☀️), 안쪽 원은 나란한 단조(🌙)예요! 마주보는 짝꿍끼리 같은 조표를 씁니다.');

      orbitGroup.append('circle')
        .attr('r', rOuter)
        .attr('fill', 'none')
        .attr('stroke', '#FDE68A')
        .attr('stroke-width', 4)
        .attr('stroke-dasharray', '4 4');

      orbitGroup.append('circle')
        .attr('r', rInner)
        .attr('fill', 'none')
        .attr('stroke', '#C7D2FE')
        .attr('stroke-width', 4)
        .attr('stroke-dasharray', '4 4');

      orbitGroup.append('circle')
        .attr('r', 44)
        .attr('fill', '#FFFFFF')
        .attr('stroke', '#E2E8F0')
        .attr('stroke-width', 2);

      orbitGroup.append('text')
        .attr('y', -6)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11')
        .attr('font-weight', '900')
        .attr('fill', '#0F172A')
        .text('같은 조표');

      orbitGroup.append('text')
        .attr('y', 12)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10')
        .attr('font-weight', '800')
        .attr('fill', '#64748B')
        .text('나란한 조');

      RELATIVE_KEY_PAIRS.forEach((kPair, idx) => {
        const angle = (idx * (2 * Math.PI) / RELATIVE_KEY_PAIRS.length) - (Math.PI / 2);
        const xOut = rOuter * Math.cos(angle);
        const yOut = rOuter * Math.sin(angle);
        const xIn = rInner * Math.cos(angle);
        const yIn = rInner * Math.sin(angle);

        const isSelected = kPair.id === selectedPairId;

        orbitGroup.append('line')
          .attr('x1', xIn)
          .attr('y1', yIn)
          .attr('x2', xOut)
          .attr('y2', yOut)
          .attr('stroke', isSelected ? '#EF4444' : '#CBD5E1')
          .attr('stroke-width', isSelected ? 3 : 1.5)
          .attr('stroke-dasharray', isSelected ? 'none' : '2 2');

        const outerG = orbitGroup.append('g')
          .attr('transform', `translate(${xOut}, ${yOut})`)
          .style('cursor', 'pointer')
          .on('click', () => {
            setSelectedPairId(kPair.id);
            setActiveMode('major');
            soundEngine.playNote(kPair.majorTonicNote, 0.8, 0, 0.35);
          });

        outerG.append('circle')
          .attr('r', isSelected ? 26 : 22)
          .attr('fill', isSelected ? '#F59E0B' : '#FEF3C7')
          .attr('stroke', '#D97706')
          .attr('stroke-width', isSelected ? 3 : 2);

        outerG.append('text')
          .attr('y', 4)
          .attr('text-anchor', 'middle')
          .attr('font-size', '11')
          .attr('font-weight', '900')
          .attr('fill', isSelected ? '#FFFFFF' : '#92400E')
          .text(kPair.majorShort);

        const innerG = orbitGroup.append('g')
          .attr('transform', `translate(${xIn}, ${yIn})`)
          .style('cursor', 'pointer')
          .on('click', () => {
            setSelectedPairId(kPair.id);
            setActiveMode('minor');
            soundEngine.playNote(kPair.minorTonicNote, 0.8, 0, 0.35);
          });

        innerG.append('circle')
          .attr('r', isSelected ? 24 : 20)
          .attr('fill', isSelected ? '#4F46E5' : '#EEF2FF')
          .attr('stroke', '#4338CA')
          .attr('stroke-width', isSelected ? 3 : 2);

        innerG.append('text')
          .attr('y', 4)
          .attr('text-anchor', 'middle')
          .attr('font-size', '10')
          .attr('font-weight', '900')
          .attr('fill', isSelected ? '#FFFFFF' : '#3730A3')
          .text(kPair.minorShort);
      });
    }
  }, [selectedPairId, activeMode, isTransitioning, activeView, pair]);

  return (
    <div className="space-y-6">
      {/* 1. Header & Interactive Controls */}
      <div className="bg-white rounded-3xl border-2 border-amber-300 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-xs shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-jua">
                  🌀 나란한 조와 으뜸음 이동 시각화
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed">
                왜 <strong>바장조</strong>와 <strong>라단조</strong>는 같은 조표(시b)를 쓸까요?
                장조의 으뜸음 '도'에서 <strong>3반음(단3도) 아래로 쏙 내려가면</strong> 단조의 으뜸음 '라'가 되는
                <strong> 으뜸음 이동</strong>의 원리를 눈과 귀로 탐험해보세요!
              </p>
            </div>
          </div>

          {/* View Switcher Button */}
          <div className="flex items-center gap-1.5 bg-[#F8F9FA] p-1.5 rounded-2xl border border-slate-200 self-start sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => setActiveView('shift-ladder')}
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer font-jua ${
                activeView === 'shift-ladder'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🪜 으뜸음 이동 사다리 뷰
            </button>
            <button
              type="button"
              onClick={() => setActiveView('circle-orbit')}
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer font-jua ${
                activeView === 'circle-orbit'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌀 5도권 동심원 궤도 뷰
            </button>
          </div>
        </div>

        {/* Key Pair Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-100">
          <span className="text-xs font-extrabold text-slate-700 font-jua">탐험할 짝꿍 조(나란한 조):</span>
          {RELATIVE_KEY_PAIRS.map(p => {
            const isSelected = p.id === selectedPairId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedPairId(p.id);
                  setActiveMode('major');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 border-2 ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-950 shadow-2xs font-jua'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{p.majorShort} ↔ {p.minorShort}</span>
                <span className="text-[10px] text-slate-500 font-bold">({p.keySignatureDesc})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. D3 Interactive Canvas Stage */}
      <div className="bg-white rounded-3xl border-2 border-slate-300 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-950 font-black text-xs border border-amber-300 font-jua">
              📖 {pair.textbookBadge}
            </span>
            <span className="text-xs text-slate-600 font-bold">
              조표: <strong className="text-slate-900">{pair.keySignatureDesc}</strong>
            </span>
            {isTransitioning && (
              <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-md animate-pulse">
                이동 단계: {currentStep}/4
              </span>
            )}
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={triggerTonicShiftAnimation}
              disabled={isTransitioning}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl text-xs font-black shadow-2xs hover:from-red-600 hover:to-rose-700 cursor-pointer font-jua active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>으뜸음 이동 애니메이션 재생!</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMode(activeMode === 'major' ? 'minor' : 'major');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-black cursor-pointer font-jua transition-colors"
            >
              {activeMode === 'major' ? <Moon className="w-3.5 h-3.5 text-indigo-600" /> : <Sun className="w-3.5 h-3.5 text-amber-600" />}
              <span>{activeMode === 'major' ? '단조 모드로 전환' : '장조 모드로 전환'}</span>
            </button>
          </div>
        </div>

        {/* SVG Canvas for D3 */}
        <div className="w-full overflow-x-auto bg-[#FBFBFA] rounded-2xl border-2 border-slate-200 p-3 select-none">
          <svg
            ref={svgRef}
            viewBox="0 0 800 440"
            className="w-full min-w-[700px] h-[360px] sm:h-[420px]"
          />
        </div>

        {/* Audio Listen Buttons Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-700">
            <Volume2 className="w-4 h-4 text-indigo-600" />
            <span>귀로 직접 확인하는 소리의 어울림:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => playScaleAudio('major')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-xl font-black cursor-pointer font-jua shadow-2xs"
            >
              <Play className="w-3.5 h-3.5 fill-amber-700" />
              <span>{pair.majorShort} 8음 음계 듣기</span>
            </button>

            <button
              type="button"
              onClick={playShiftAudio}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-950 border border-rose-300 rounded-xl font-black cursor-pointer font-jua shadow-2xs"
            >
              <Play className="w-3.5 h-3.5 fill-rose-700" />
              <span>으뜸음 이동 소리 (도 ➔ 라)</span>
            </button>

            <button
              type="button"
              onClick={() => playScaleAudio('minor')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-300 rounded-xl font-black cursor-pointer font-jua shadow-2xs"
            >
              <Play className="w-3.5 h-3.5 fill-indigo-700" />
              <span>{pair.minorShort} 8음 음계 듣기</span>
            </button>

            <button
              type="button"
              onClick={playChordComparison}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black cursor-pointer font-jua shadow-2xs"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>으뜸화음(장3화음 vs 단3화음) 비교</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Pedagogical Explanation Callout */}
      <div className="bg-[#FFFDF9] rounded-3xl border-2 border-indigo-200 p-5 sm:p-6 space-y-3.5 shadow-2xs">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-indigo-600 shrink-0" />
          <h4 className="font-black text-slate-900 text-base font-jua">
            💡 선생님과 학생을 위한 "나란한 조와 으뜸음 이동" 핵심 정리
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-700">
          <div className="p-4 bg-white rounded-2xl border-2 border-amber-200 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-500" />
              <strong className="text-amber-950 font-black text-sm font-jua">1. 같은 조표(재료)를 공유해요!</strong>
            </div>
            <p className="leading-relaxed font-medium">
              {pair.majorShort}와 {pair.minorShort}는 악보 맨 앞에 붙는 조표가 <strong>{pair.keySignatureDesc}</strong>로 100% 똑같습니다. 피아노 건반의 누르는 음 재료(7개 음)가 정확히 동일합니다.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border-2 border-rose-200 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <strong className="text-rose-950 font-black text-sm font-jua">2. 으뜸음만 3반음 아래로 이동!</strong>
            </div>
            <p className="leading-relaxed font-medium">
              장조의 대장 음인 "도"({pair.majorTonicKorean}음)에서 <strong>건반 3칸(단3도) 아래로 쏙 내려간 음</strong>이 바로 단조의 새로운 대장 음인 "라"({pair.minorTonicKorean}음)가 됩니다!
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border-2 border-indigo-200 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-indigo-500" />
              <strong className="text-indigo-950 font-black text-sm font-jua">3. 시작음이 바뀌어 느낌이 변해요!</strong>
            </div>
            <p className="leading-relaxed font-medium">
              같은 7개 음이라도 "도"를 중심으로 부르면 햇살처럼 밝고 경쾌한 장조가 되고, "라"를 중심으로 부르면 교과서 &lt;별 보며 달 보며&gt;처럼 달빛의 은은하고 아련한 단조가 완성됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
