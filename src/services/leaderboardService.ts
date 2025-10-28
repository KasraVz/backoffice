import { LeaderboardConfiguration, LeaderboardEntry, AssessmentType, LeaderboardTimeframe } from '@/types/leaderboard';

const generateMockConfigurations = (): LeaderboardConfiguration[] => [
  {
    id: 'LB-FPA-MONTHLY',
    assessmentType: 'FPA',
    timeframe: 'monthly',
    status: 'Active',
    criteria: [
      {
        id: 'C1',
        name: 'Assessment Score',
        weight: 60,
        enabled: true,
        description: 'Average score across all FPA assessments',
        calculationType: 'score'
      },
      {
        id: 'C2',
        name: 'Completion Speed',
        weight: 20,
        enabled: true,
        description: 'Average time to complete assessments',
        calculationType: 'completion_time'
      },
      {
        id: 'C3',
        name: 'Certifications',
        weight: 20,
        enabled: true,
        description: 'Number of certifications earned',
        calculationType: 'certification_count'
      }
    ],
    minimumAssessments: 1,
    enableTies: true,
    showTop: 100,
    updatedAt: '2025-10-15T10:30:00Z',
    updatedBy: 'Admin User'
  },
  {
    id: 'LB-EEA-WEEKLY',
    assessmentType: 'EEA',
    timeframe: 'weekly',
    status: 'Active',
    criteria: [
      {
        id: 'C4',
        name: 'Assessment Score',
        weight: 70,
        enabled: true,
        description: 'Average score across all EEA assessments',
        calculationType: 'score'
      },
      {
        id: 'C5',
        name: 'Perfect Scores',
        weight: 30,
        enabled: true,
        description: 'Number of perfect scores achieved',
        calculationType: 'perfect_scores'
      }
    ],
    minimumAssessments: 2,
    enableTies: false,
    showTop: 50,
    updatedAt: '2025-10-20T14:20:00Z',
    updatedBy: 'Admin User'
  },
  {
    id: 'LB-GEB-ALLTIME',
    assessmentType: 'GEB',
    timeframe: 'all-time',
    status: 'Inactive',
    criteria: [
      {
        id: 'C6',
        name: 'Total Certifications',
        weight: 50,
        enabled: true,
        description: 'Total number of GEB certifications',
        calculationType: 'certification_count'
      },
      {
        id: 'C7',
        name: 'Average Score',
        weight: 50,
        enabled: true,
        description: 'Overall average score',
        calculationType: 'score'
      }
    ],
    minimumAssessments: 5,
    enableTies: true,
    showTop: 200,
    updatedAt: '2025-09-01T09:00:00Z',
    updatedBy: 'Admin User'
  }
];

const generateMockLeaderboard = (): LeaderboardEntry[] => [
  {
    rank: 1,
    userId: 'U001',
    userName: 'Sarah Johnson',
    score: 95.5,
    assessmentsCompleted: 12,
    averageScore: 94.2,
    certificationsEarned: 5
  },
  {
    rank: 2,
    userId: 'U002',
    userName: 'Michael Chen',
    score: 93.8,
    assessmentsCompleted: 10,
    averageScore: 92.5,
    certificationsEarned: 4
  },
  {
    rank: 3,
    userId: 'U003',
    userName: 'Emma Davis',
    score: 92.1,
    assessmentsCompleted: 15,
    averageScore: 91.8,
    certificationsEarned: 6
  },
  {
    rank: 4,
    userId: 'U004',
    userName: 'James Wilson',
    score: 90.5,
    assessmentsCompleted: 8,
    averageScore: 90.2,
    certificationsEarned: 3
  },
  {
    rank: 5,
    userId: 'U005',
    userName: 'Olivia Martinez',
    score: 89.3,
    assessmentsCompleted: 11,
    averageScore: 88.9,
    certificationsEarned: 4
  }
];

export const leaderboardService = {
  getAllConfigurations: async (): Promise<LeaderboardConfiguration[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateMockConfigurations();
  },
  
  getConfigurationById: async (id: string): Promise<LeaderboardConfiguration | null> => {
    const configs = generateMockConfigurations();
    return configs.find(c => c.id === id) || null;
  },
  
  updateConfiguration: async (
    id: string,
    updates: Partial<LeaderboardConfiguration>
  ): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Updated configuration:', id, updates);
  },
  
  getLeaderboardEntries: async (
    assessmentType: AssessmentType,
    timeframe: LeaderboardTimeframe
  ): Promise<LeaderboardEntry[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateMockLeaderboard();
  },
  
  recalculateLeaderboard: async (configId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Recalculated leaderboard:', configId);
  }
};
