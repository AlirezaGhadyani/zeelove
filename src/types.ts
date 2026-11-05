export interface CoupleProfile {
  partner1: string;
  partner2: string;
  partner1Avatar?: string;
  partner2Avatar?: string;
  partner1Nickname?: string;
  partner2Nickname?: string;
  anniversaryDate: string; // YYYY-MM-DD
  ourSong?: string;
  meetingPlace?: string;
}

export interface Memory {
  id: string;
  title: string;
  date: string;
  location?: string;
  category: 'firsts' | 'trips' | 'dates' | 'milestones' | 'everyday';
  description: string;
  imageUrl?: string;
  hearts: number;
}

export interface DateIdea {
  id: string;
  title: string;
  category: 'cozy' | 'romantic' | 'adventure' | 'budget' | 'foodie';
  cost: '$' | '$$' | '$$$';
  duration: string;
  description: string;
  tip: string;
  isPlanned?: boolean;
}

export interface LoveNote {
  id: string;
  from: string;
  to: string;
  text: string;
  date: string;
  color: 'rose' | 'amber' | 'emerald' | 'violet' | 'sky';
  isPinned?: boolean;
}

export interface BucketItem {
  id: string;
  title: string;
  category: 'travel' | 'adventure' | 'food' | 'milestone' | 'cozy';
  completed: boolean;
  targetYear?: string;
  completedDate?: string;
  notes?: string;
}

export interface DailyQuestion {
  id: string;
  question: string;
  partner1Answer?: string;
  partner2Answer?: string;
  date: string;
}
