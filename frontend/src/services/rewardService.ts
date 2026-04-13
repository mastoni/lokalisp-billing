import api from '../lib/api';

export interface RewardStats {
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  totalPointsOutstanding: number;
  activeMembers: number;
  redemptionRate: string;
  avgPointsPerCustomer: number;
}

export interface CustomerPoints {
  id: string;
  name: string;
  email: string;
  phone: string;
  points_balance: number;
  tier: string;
  status: string;
  last_activity: string;
  created_at: string;
}

export interface EarningRule {
  id: number;
  action_name: string;
  points: number;
  description: string;
  is_active: boolean;
}

export interface RedemptionReward {
  id: number;
  name: string;
  description: string;
  points_cost: number;
  category: string;
  is_active: boolean;
}

export interface RedemptionRequest {
  id: string;
  redemption_number: string;
  customer_name: string;
  customer_email: string;
  reward_name: string;
  points_spent: number;
  status: string;
  request_date: string;
  completed_date: string;
  rejection_reason: string;
  category: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
  points_balance: number;
  tier: string;
  total_points_earned: number;
  total_points_redeemed: number;
  redemption_count: number;
  join_date: string;
  months_active: number;
  rank: number;
}

export interface TierDistribution {
  tier: string;
  count: number;
}

export const rewardService = {
  // Get reward statistics
  async getStats(): Promise<RewardStats> {
    const response = await api.get('/rewards/stats');
    return response.data.data;
  },

  // Get customer points
  async getCustomerPoints(page: number = 1, limit: number = 20, search: string = '') {
    const response = await api.get('/rewards/customers', {
      params: { page, limit, search },
    });
    return response.data.data;
  },

  // Get earning rules
  async getEarningRules(): Promise<EarningRule[]> {
    const response = await api.get('/rewards/earning-rules');
    return response.data.data;
  },

  // Create earning rule
  async createEarningRule(ruleData: {
    action_name: string;
    points: number;
    description: string;
    is_active?: boolean;
  }) {
    const response = await api.post('/rewards/earning-rules', ruleData);
    return response.data.data;
  },

  // Get redemption rewards
  async getRedemptionRewards(): Promise<RedemptionReward[]> {
    const response = await api.get('/rewards/rewards');
    return response.data.data;
  },

  // Create redemption reward
  async createRedemptionReward(rewardData: {
    name: string;
    description: string;
    points_cost: number;
    category: string;
    is_active?: boolean;
  }) {
    const response = await api.post('/rewards/rewards', rewardData);
    return response.data.data;
  },

  // Get redemption requests
  async getRedemptions(page: number = 1, limit: number = 20, status?: string) {
    const response = await api.get('/rewards/redemptions', {
      params: { page, limit, status },
    });
    return response.data.data;
  },

  // Process redemption (approve/reject)
  async processRedemption(
    redemptionId: string,
    status: 'approved' | 'rejected',
    reason?: string
  ) {
    const response = await api.patch(`/rewards/redemptions/${redemptionId}/process`, {
      status,
      reason,
    });
    return response.data.data;
  },

  // Get leaderboard
  async getLeaderboard(page: number = 1, limit: number = 50, tier?: string) {
    const response = await api.get('/rewards/leaderboard', {
      params: { page, limit, tier },
    });
    return response.data.data;
  },

  // Get tier distribution
  async getTierDistribution(): Promise<TierDistribution[]> {
    const response = await api.get('/rewards/tier-distribution');
    return response.data.data;
  },

  // Adjust customer points
  async adjustCustomerPoints(
    customerId: string,
    points: number,
    reason: string
  ) {
    const response = await api.post(`/rewards/customers/${customerId}/adjust`, {
      points,
      reason,
    });
    return response.data.data;
  },
};
