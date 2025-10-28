export type BadgeStatus = 'Active' | 'Inactive' | 'Draft';
export type BadgeTrigger = 'manual' | 'automatic';
export type BadgeCategory = 'Assessment' | 'Score' | 'Streak' | 'Special' | 'Milestone';

export interface BadgeCriteria {
  type: 'assessment_completion' | 'score_threshold' | 'certification_earned' | 'perfect_score' | 'speed_completion' | 'consecutive_assessments' | 'profile_completion';
  value: string | number;
  operator?: '>=' | '>' | '=' | '<' | '<=';
  description: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  status: BadgeStatus;
  iconUrl?: string;
  iconName?: string;
  color?: string;
  criteria: BadgeCriteria[];
  trigger: BadgeTrigger;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  points: number;
  createdAt: string;
  updatedAt: string;
  awardedCount: number;
}

export interface BadgeAward {
  id: string;
  badgeId: string;
  userId: string;
  userName: string;
  awardedAt: string;
  awardedBy?: string;
  reason?: string;
}
