export interface LifePoint {
  age: number;
  reflection: string;
  type: 'past' | 'present' | 'future';
  category?: 'personal' | 'professional' | 'both';
}

export interface TrajectoryData {
  pastPoints: LifePoint[];
  presentPoint: LifePoint;
  futureDesires: LifePoint[];
  analysis?: TrajectoryAnalysis;
  createdAt: string;
  updatedAt: string;
}

export interface TrajectoryAnalysis {
  currentPath: string;
  desiredPath: string;
  gap: string;
  actionNeeded: string;
  patterns: string[];
}

export interface DetailedWalk {
  id: string;
  currentAge: number;
  reflections: WalkReflection[];
  createdAt: string;
  updatedAt: string;
}

export interface WalkReflection {
  age: number;
  personal: {
    text?: string;
    audioUrl?: string;
    themes: string[];
  };
  professional: {
    text?: string;
    audioUrl?: string;
    goals: string[];
  };
  timestamp: string;
}

export type Phase = 'welcome' | 'quickCheck' | 'results' | 'detailed';

export interface QuickCheckStep {
  title: string;
  question: string;
  age?: number;
  placeholder: string;
}