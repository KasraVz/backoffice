import { BadgeStatus } from '@/types/badge';

export const getBadgeRarityVariant = (rarity: string) => {
  switch (rarity) {
    case 'Common':
      return 'secondary';
    case 'Rare':
      return 'default';
    case 'Epic':
      return 'outline';
    case 'Legendary':
      return 'destructive';
    default:
      return 'outline';
  }
};

export const getBadgeStatusVariant = (status: BadgeStatus) => {
  switch (status) {
    case 'Active':
      return 'default';
    case 'Inactive':
      return 'secondary';
    case 'Draft':
      return 'outline';
    default:
      return 'outline';
  }
};

export const getRarityColor = (rarity: string): string => {
  switch (rarity) {
    case 'Common':
      return '#9CA3AF';
    case 'Rare':
      return '#3B82F6';
    case 'Epic':
      return '#9333EA';
    case 'Legendary':
      return '#F59E0B';
    default:
      return '#6B7280';
  }
};

export const getCriteriaTypeLabel = (type: string): string => {
  const labels = {
    'assessment_completion': 'Complete Assessment',
    'score_threshold': 'Score Threshold',
    'certification_earned': 'Certification Earned',
    'perfect_score': 'Perfect Score',
    'speed_completion': 'Speed Completion',
    'consecutive_assessments': 'Consecutive Assessments',
    'profile_completion': 'Profile Completion'
  };
  return labels[type] || type;
};
