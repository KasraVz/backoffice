export type LeaderboardTimeframe = 'weekly' | 'monthly' | 'quarterly' | 'all-time';
export type AssessmentType = 'FPA' | 'EEA' | 'GEB';
export type LeaderboardStatus = 'Active' | 'Inactive';

export interface LeaderboardCriteria {
  id: string;
  name: string;
  weight: number;
  enabled: boolean;
  description: string;
  calculationType: 'score' | 'completion_time' | 'certification_count' | 'perfect_scores';
}

export interface LeaderboardConfiguration {
  id: string;
  assessmentType: AssessmentType;
  timeframe: LeaderboardTimeframe;
  status: LeaderboardStatus;
  criteria: LeaderboardCriteria[];
  minimumAssessments: number;
  enableTies: boolean;
  showTop: number;
  updatedAt: string;
  updatedBy: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  score: number;
  assessmentsCompleted: number;
  averageScore: number;
  certificationsEarned: number;
  profilePicture?: string;
}
