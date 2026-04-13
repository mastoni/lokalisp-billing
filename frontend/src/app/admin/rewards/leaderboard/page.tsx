'use client';

import { useState } from 'react';
import {
  Trophy,
  Star,
  Medal,
  Crown,
  TrendingUp,
  Users,
  Gift,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  User,
  Mail,
  Calendar,
  Award,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';

// Mock leaderboard data
const leaderboardData = [
  { rank: 1, name: 'Ahmad Rizki', email: 'ahmad@email.com', points: 4520, tier: 'Platinum', totalSpent: 'Rp 12.500.000', monthsActive: 18, redemptions: 8, avatar: 'AR' },
  { rank: 2, name: 'Budi Santoso', email: 'budi@email.com', points: 3890, tier: 'Gold', totalSpent: 'Rp 10.800.000', monthsActive: 15, redemptions: 6, avatar: 'BS' },
  { rank: 3, name: 'Siti Nurhaliza', email: 'siti@email.com', points: 2750, tier: 'Gold', totalSpent: 'Rp 8.400.000', monthsActive: 12, redemptions: 5, avatar: 'SN' },
  { rank: 4, name: 'Eko Prasetyo', email: 'eko@email.com', points: 2650, tier: 'Gold', totalSpent: 'Rp 9.200.000', monthsActive: 14, redemptions: 7, avatar: 'EP' },
  { rank: 5, name: 'Dewi Lestari', email: 'dewi@email.com', points: 1980, tier: 'Silver', totalSpent: 'Rp 6.800.000', monthsActive: 10, redemptions: 4, avatar: 'DL' },
  { rank: 6, name: 'Fitriani', email: 'fitri@email.com', points: 1850, tier: 'Silver', totalSpent: 'Rp 7.200.000', monthsActive: 11, redemptions: 3, avatar: 'FN' },
  { rank: 7, name: 'Gunawan', email: 'gunawan@email.com', points: 1650, tier: 'Silver', totalSpent: 'Rp 5.900.000', monthsActive: 9, redemptions: 2, avatar: 'GW' },
  { rank: 8, name: 'Hana Pertiwi', email: 'hana@email.com', points: 1520, tier: 'Silver', totalSpent: 'Rp 6.100.000', monthsActive: 10, redemptions: 4, avatar: 'HP' },
  { rank: 9, name: 'Irfan Hakim', email: 'irfan@email.com', points: 1380, tier: 'Bronze', totalSpent: 'Rp 4.800.000', monthsActive: 8, redemptions: 2, avatar: 'IH' },
  { rank: 10, name: 'Jasmine Putri', email: 'jasmine@email.com', points: 1250, tier: 'Bronze', totalSpent: 'Rp 5.200.000', monthsActive: 9, redemptions: 3, avatar: 'JP' },
  { rank: 11, name: 'Kevin Anggara', email: 'kevin@email.com', points: 1120, tier: 'Bronze', totalSpent: 'Rp 4.500.000', monthsActive: 7, redemptions: 1, avatar: 'KA' },
  { rank: 12, name: 'Linda Susanti', email: 'linda@email.com', points: 980, tier: 'Bronze', totalSpent: 'Rp 3.900.000', monthsActive: 6, redemptions: 2, avatar: 'LS' },
  { rank: 13, name: 'Michael Tan', email: 'michael@email.com', points: 890, tier: 'Bronze', totalSpent: 'Rp 4.100.000', monthsActive: 7, redemptions: 1, avatar: 'MT' },
  { rank: 14, name: 'Nadia Rahma', email: 'nadia@email.com', points: 760, tier: 'Bronze', totalSpent: 'Rp 3.200.000', monthsActive: 5, redemptions: 1, avatar: 'NR' },
  { rank: 15, name: 'Oscar Pratama', email: 'oscar@email.com', points: 650, tier: 'Bronze', totalSpent: 'Rp 2.800.000', monthsActive: 4, redemptions: 0, avatar: 'OP' },
];

const tierDistribution = [
  { tier: 'Platinum', count: 2, percentage: 1, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-100', textColor: 'text-purple-700' },
  { tier: 'Gold', count: 45, percentage: 16, color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
  { tier: 'Silver', count: 98, percentage: 34, color: 'from-slate-400 to-slate-500', bgColor: 'bg-slate-100', textColor: 'text-slate-700' },
  { tier: 'Bronze', count: 144, percentage: 49, color: 'from-amber-600 to-amber-700', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
];

const topPerformers = [
  { metric: 'Most Active', name: 'Ahmad Rizki', value: '18 months', icon: Calendar },
  { metric: 'Highest Spender', name: 'Ahmad Rizki', value: 'Rp 12.5M', icon: TrendingUp },
  { metric: 'Most Redemptions', name: 'Eko Prasetyo', value: '7 times', icon: Gift },
  { metric: 'Fastest to Platinum', name: 'Ahmad Rizki', value: '8 months', icon: Zap },
];

export default function LeaderboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const filteredData = leaderboardData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter ? item.tier === tierFilter : true;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 shadow-lg">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Leaderboard</h1>
              <p className="text-slate-600">Top customers by reward points and engagement</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-white border border-slate-300 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 transition-colors ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 transition-colors ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {topPerformers.map((performer, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
              <performer.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-slate-600 mb-1">{performer.metric}</p>
            <p className="text-lg font-bold text-slate-900 mb-1">{performer.name}</p>
            <p className="text-sm text-blue-600 font-semibold">{performer.value}</p>
          </div>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-2xl shadow-lg p-8 border border-purple-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">🏆 Top 3 Champions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* 2nd Place */}
          <div className="order-2 md:order-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-slate-300">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 mx-auto mb-4">
                <Medal className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-slate-400 mb-2">#2</p>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{leaderboardData[1].name}</h3>
                <div className="flex items-center justify-center text-yellow-500 mb-3">
                  <Star className="w-4 h-4 mr-1" />
                  <span className="text-2xl font-bold">{leaderboardData[1].points.toLocaleString()}</span>
                </div>
                <TierBadge tier={leaderboardData[1].tier} />
              </div>
            </div>
          </div>

          {/* 1st Place */}
          <div className="order-1 md:order-2">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-yellow-400 transform md:-translate-y-4">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 mx-auto mb-4">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <div className="text-center">
                <p className="text-5xl font-bold text-yellow-500 mb-2">#1</p>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">{leaderboardData[0].name}</h3>
                <div className="flex items-center justify-center text-yellow-500 mb-3">
                  <Star className="w-5 h-5 mr-1" />
                  <span className="text-3xl font-bold">{leaderboardData[0].points.toLocaleString()}</span>
                </div>
                <TierBadge tier={leaderboardData[0].tier} />
              </div>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="order-3">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-amber-600">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-amber-600 mb-2">#3</p>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{leaderboardData[2].name}</h3>
                <div className="flex items-center justify-center text-yellow-500 mb-3">
                  <Star className="w-4 h-4 mr-1" />
                  <span className="text-2xl font-bold">{leaderboardData[2].points.toLocaleString()}</span>
                </div>
                <TierBadge tier={leaderboardData[2].tier} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Distribution */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Tier Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {tierDistribution.map((tier) => (
            <div
              key={tier.tier}
              className={`p-6 rounded-xl bg-gradient-to-br ${tier.color} text-white`}
            >
              <h3 className="text-xl font-bold mb-2">{tier.tier}</h3>
              <p className="text-4xl font-bold mb-2">{tier.count}</p>
              <p className="text-white/80 text-sm">{tier.percentage}% of customers</p>
            </div>
          ))}
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Full Leaderboard</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center px-4 py-2 bg-slate-100 rounded-xl">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-64"
              />
            </div>
            <div className="flex items-center space-x-2">
              {['Platinum', 'Gold', 'Silver', 'Bronze'].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setTierFilter(tierFilter === tier ? null : tier)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    tierFilter === tier
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Rank</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Customer</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Points</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Tier</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Total Spent</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Redemptions</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Months</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((item) => (
                  <tr key={item.rank} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <RankBadge rank={item.rank} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                          <span className="text-white font-bold text-sm">{item.avatar}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-purple-600">
                        <Star className="w-4 h-4 mr-1" />
                        <span className="text-sm font-bold">{item.points.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <TierBadge tier={item.tier} />
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-slate-900">{item.totalSpent}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{item.redemptions}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{item.monthsActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map((item) => (
              <div
                key={item.rank}
                className="p-6 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <RankBadge rank={item.rank} />
                  <TierBadge tier={item.tier} />
                </div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                    <span className="text-white font-bold">{item.avatar}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                    <p className="text-xs text-slate-500">{item.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-purple-600">
                    <Star className="w-5 h-5 mr-1" />
                    <span className="text-xl font-bold">{item.points.toLocaleString()}</span>
                  </div>
                  <span className="text-sm text-slate-500">points</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200">
                  <div>
                    <p className="text-xs text-slate-500">Total Spent</p>
                    <p className="text-sm font-semibold text-slate-900">{item.totalSpent}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Redemptions</p>
                    <p className="text-sm font-semibold text-slate-900">{item.redemptions}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Rank Badge Component
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500">
        <span className="text-white font-bold">#{rank}</span>
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-500">
        <span className="text-white font-bold">#{rank}</span>
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-700">
        <span className="text-white font-bold">#{rank}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200">
      <span className="text-slate-700 font-bold">#{rank}</span>
    </div>
  );
}

// Tier Badge Component
function TierBadge({ tier }: { tier: string }) {
  const tierConfig = {
    Platinum: { bg: 'bg-purple-100', text: 'text-purple-700', gradient: 'from-purple-500 to-purple-600' },
    Gold: { bg: 'bg-yellow-100', text: 'text-yellow-700', gradient: 'from-yellow-500 to-yellow-600' },
    Silver: { bg: 'bg-slate-100', text: 'text-slate-700', gradient: 'from-slate-400 to-slate-500' },
    Bronze: { bg: 'bg-amber-100', text: 'text-amber-700', gradient: 'from-amber-600 to-amber-700' },
  };

  const config = tierConfig[tier as keyof typeof tierConfig];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
    >
      <Star className="w-3 h-3 mr-1" />
      {tier}
    </span>
  );
}
