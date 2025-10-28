import { LeaderboardTimeframe } from '@/types/leaderboard';

export const getTimeframeLabel = (timeframe: LeaderboardTimeframe): string => {
  const labels = {
    'weekly': 'Weekly',
    'monthly': 'Monthly',
    'quarterly': 'Quarterly',
    'all-time': 'All Time'
  };
  return labels[timeframe] || timeframe;
};

export const getTimeframeVariant = (timeframe: LeaderboardTimeframe) => {
  const variants = {
    'weekly': 'default',
    'monthly': 'secondary',
    'quarterly': 'outline',
    'all-time': 'destructive'
  };
  return variants[timeframe] || 'outline';
};

export const getAssessmentTypeColor = (type: string): string => {
  const colors = {
    'FPA': 'hsl(var(--chart-1))',
    'EEA': 'hsl(var(--chart-2))',
    'GEB': 'hsl(var(--chart-3))'
  };
  return colors[type] || 'hsl(var(--muted))';
};
