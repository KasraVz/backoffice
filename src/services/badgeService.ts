import { Badge, BadgeAward } from '@/types/badge';

const generateMockBadges = (): Badge[] => [
  {
    id: 'BADGE-001',
    name: 'First Assessment',
    description: 'Complete your first assessment',
    category: 'Assessment',
    status: 'Active',
    iconName: 'Trophy',
    color: '#FFD700',
    criteria: [
      {
        type: 'assessment_completion',
        value: 1,
        operator: '>=',
        description: 'Complete at least 1 assessment'
      }
    ],
    trigger: 'automatic',
    rarity: 'Common',
    points: 10,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    awardedCount: 1234
  },
  {
    id: 'BADGE-002',
    name: 'Perfect Score',
    description: 'Achieve a perfect score on any assessment',
    category: 'Score',
    status: 'Active',
    iconName: 'Star',
    color: '#9333EA',
    criteria: [
      {
        type: 'perfect_score',
        value: 100,
        operator: '>=',
        description: 'Score 100% on any assessment'
      }
    ],
    trigger: 'automatic',
    rarity: 'Epic',
    points: 100,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    awardedCount: 45
  },
  {
    id: 'BADGE-003',
    name: 'Speed Demon',
    description: 'Complete an assessment in record time',
    category: 'Special',
    status: 'Active',
    iconName: 'Zap',
    color: '#EF4444',
    criteria: [
      {
        type: 'speed_completion',
        value: 30,
        operator: '<=',
        description: 'Complete assessment in under 30 minutes'
      }
    ],
    trigger: 'automatic',
    rarity: 'Rare',
    points: 50,
    createdAt: '2025-01-05T00:00:00Z',
    updatedAt: '2025-01-05T00:00:00Z',
    awardedCount: 234
  },
  {
    id: 'BADGE-004',
    name: 'Certification Master',
    description: 'Earn 5 certifications',
    category: 'Milestone',
    status: 'Active',
    iconName: 'Award',
    color: '#10B981',
    criteria: [
      {
        type: 'certification_earned',
        value: 5,
        operator: '>=',
        description: 'Earn at least 5 certifications'
      }
    ],
    trigger: 'automatic',
    rarity: 'Epic',
    points: 150,
    createdAt: '2025-01-10T00:00:00Z',
    updatedAt: '2025-01-10T00:00:00Z',
    awardedCount: 89
  },
  {
    id: 'BADGE-005',
    name: 'Consistent Performer',
    description: 'Complete 10 consecutive assessments',
    category: 'Streak',
    status: 'Active',
    iconName: 'Flame',
    color: '#F97316',
    criteria: [
      {
        type: 'consecutive_assessments',
        value: 10,
        operator: '>=',
        description: 'Complete 10 assessments without gaps'
      }
    ],
    trigger: 'automatic',
    rarity: 'Rare',
    points: 75,
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
    awardedCount: 167
  },
  {
    id: 'BADGE-006',
    name: 'Early Adopter',
    description: 'Awarded to beta testers and early users',
    category: 'Special',
    status: 'Inactive',
    iconName: 'Rocket',
    color: '#3B82F6',
    criteria: [
      {
        type: 'assessment_completion',
        value: 1,
        operator: '>=',
        description: 'Manually awarded to early users'
      }
    ],
    trigger: 'manual',
    rarity: 'Legendary',
    points: 500,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    awardedCount: 12
  }
];

const generateMockAwards = (): BadgeAward[] => [
  {
    id: 'AWARD-001',
    badgeId: 'BADGE-001',
    userId: 'U001',
    userName: 'Sarah Johnson',
    awardedAt: '2025-10-15T10:30:00Z'
  },
  {
    id: 'AWARD-002',
    badgeId: 'BADGE-001',
    userId: 'U002',
    userName: 'Michael Chen',
    awardedAt: '2025-10-16T14:20:00Z'
  }
];

export const badgeService = {
  getAllBadges: async (): Promise<Badge[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateMockBadges();
  },
  
  getBadgeById: async (id: string): Promise<Badge | null> => {
    const badges = generateMockBadges();
    return badges.find(b => b.id === id) || null;
  },
  
  createBadge: async (badge: Omit<Badge, 'id' | 'createdAt' | 'updatedAt' | 'awardedCount'>): Promise<Badge> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      ...badge,
      id: `BADGE-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      awardedCount: 0
    };
  },
  
  updateBadge: async (id: string, updates: Partial<Badge>): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Updated badge:', id, updates);
  },
  
  deleteBadge: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Deleted badge:', id);
  },
  
  awardBadgeManually: async (badgeId: string, userId: string, reason: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Awarded badge:', badgeId, 'to user:', userId, 'Reason:', reason);
  },
  
  getBadgeAwards: async (badgeId: string): Promise<BadgeAward[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateMockAwards().filter(a => a.badgeId === badgeId);
  }
};
