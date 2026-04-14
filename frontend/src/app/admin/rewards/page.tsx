'use client';

import { useState } from 'react';
import {
  Gift,
  Star,
  TrendingUp,
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle,
  Clock,
  Info,
  Save,
  X
} from 'lucide-react';

// Mock data for reward points overview
const rewardStats = {
  totalPointsIssued: '1,245,600',
  totalPointsRedeemed: '892,340',
  totalPointsOutstanding: '353,260',
  activeMembers: '289',
  redemptionRate: '71.6%',
  avgPointsPerCustomer: '1,221',
};

// Mock data for customer points
const customerPoints = [
  { id: 1, name: 'Ahmad Rizki', email: 'ahmad@email.com', points: 4520, tier: 'Gold', status: 'active' as const, lastActivity: '2026-04-14' },
  { id: 2, name: 'Budi Santoso', email: 'budi@email.com', points: 3890, tier: 'Gold', status: 'active' as const, lastActivity: '2026-04-13' },
  { id: 3, name: 'Siti Nurhaliza', email: 'siti@email.com', points: 2750, tier: 'Silver', status: 'active' as const, lastActivity: '2026-04-12' },
  { id: 4, name: 'Dewi Lestari', email: 'dewi@email.com', points: 1980, tier: 'Silver', status: 'active' as const, lastActivity: '2026-04-11' },
  { id: 5, name: 'Eko Prasetyo', email: 'eko@email.com', points: 1650, tier: 'Bronze', status: 'active' as const, lastActivity: '2026-04-10' },
  { id: 6, name: 'Fitriani', email: 'fitri@email.com', points: 1200, tier: 'Bronze', status: 'active' as const, lastActivity: '2026-04-09' },
  { id: 7, name: 'Gunawan', email: 'gunawan@email.com', points: 890, tier: 'Bronze', status: 'inactive' as const, lastActivity: '2026-03-15' },
  { id: 8, name: 'Hana Pertiwi', email: 'hana@email.com', points: 560, tier: 'Bronze', status: 'inactive' as const, lastActivity: '2026-02-20' },
];

// Reward tiers configuration
const rewardTiers = [
  { name: 'Bronze', minPoints: 0, color: 'from-amber-600 to-amber-700', borderColor: 'border-amber-500', benefits: '5% bonus points' },
  { name: 'Silver', minPoints: 1000, color: 'from-slate-400 to-slate-500', borderColor: 'border-slate-400', benefits: '10% bonus points + Priority support' },
  { name: 'Gold', minPoints: 2500, color: 'from-yellow-500 to-yellow-600', borderColor: 'border-yellow-500', benefits: '15% bonus points + Free upgrades + Priority support' },
  { name: 'Platinum', minPoints: 5000, color: 'from-purple-500 to-purple-600', borderColor: 'border-purple-500', benefits: '20% bonus points + Exclusive offers + Dedicated support' },
];

// Earning rules
const earningRules = [
  { id: 1, action: 'Monthly subscription payment', points: 100, description: 'Points earned per Rp 10,000 spent' },
  { id: 2, action: 'On-time payment bonus', points: 50, description: 'Bonus for paying before due date' },
  { id: 3, action: 'Referral bonus', points: 500, description: 'When referred customer signs up' },
  { id: 4, action: 'Annual subscription', points: 1000, description: 'Bonus for yearly payment' },
  { id: 5, action: 'New service activation', points: 200, description: 'Activating additional services' },
];

// Redemption rewards
const redemptionRewards = [
  { id: 1, name: '1 Month Free Basic', pointsCost: 5000, category: 'Service Credit', description: 'Get one month of Basic plan free' },
  { id: 2, name: '1 Month Free Premium', pointsCost: 10000, category: 'Service Credit', description: 'Get one month of Premium plan free' },
  { id: 3, name: 'Speed Upgrade (1 month)', pointsCost: 3000, category: 'Upgrade', description: 'Upgrade your speed tier for one month' },
  { id: 4, name: 'Data Recovery Service', pointsCost: 2000, category: 'Service', description: 'One-time data recovery assistance' },
  { id: 5, name: 'Router Upgrade', pointsCost: 8000, category: 'Equipment', description: 'Free router upgrade and installation' },
  { id: 6, name: 'Bill Discount Rp 100K', pointsCost: 4000, category: 'Discount', description: 'Rp 100,000 discount on next bill' },
  { id: 7, name: 'Bill Discount Rp 250K', pointsCost: 9000, category: 'Discount', description: 'Rp 250,000 discount on next bill' },
  { id: 8, name: 'Free Installation', pointsCost: 6000, category: 'Service', description: 'Free new installation service' },
];

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'rules' | 'rewards'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);

  const filteredCustomers = customerPoints.filter(
    (c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
              <Gift className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Reward Points</h1>
              <p className="text-slate-600">Manage customer loyalty rewards and incentives</p>
            </div>
          </div>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-medium shadow-lg shadow-purple-500/30">
          <Plus className="w-4 h-4 inline mr-2" />
          New Reward
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-200 pb-4">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'customers', label: 'Customers', icon: Users },
          { id: 'rules', label: 'Earning Rules', icon: Star },
          { id: 'rewards', label: 'Redemption Rewards', icon: Gift },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-4 py-2 rounded-xl transition-all font-medium ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Total Points Issued"
              value={rewardStats.totalPointsIssued}
              change="+12.5%"
              trend="up"
              icon={Star}
              gradient="from-blue-500 to-blue-600"
            />
            <StatCard
              title="Total Points Redeemed"
              value={rewardStats.totalPointsRedeemed}
              change="+8.3%"
              trend="up"
              icon={Gift}
              gradient="from-green-500 to-green-600"
            />
            <StatCard
              title="Points Outstanding"
              value={rewardStats.totalPointsOutstanding}
              change="-2.1%"
              trend="down"
              icon={TrendingUp}
              gradient="from-orange-500 to-orange-600"
            />
            <StatCard
              title="Active Members"
              value={rewardStats.activeMembers}
              change="+5"
              trend="up"
              icon={Users}
              gradient="from-purple-500 to-purple-600"
            />
            <StatCard
              title="Redemption Rate"
              value={rewardStats.redemptionRate}
              change="+3.2%"
              trend="up"
              icon={ArrowUpRight}
              gradient="from-teal-500 to-teal-600"
            />
            <StatCard
              title="Avg Points/Customer"
              value={rewardStats.avgPointsPerCustomer}
              change="+15"
              trend="up"
              icon={Star}
              gradient="from-pink-500 to-pink-600"
            />
          </div>

          {/* Reward Tiers */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Reward Tiers</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {rewardTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`p-6 rounded-xl border-2 ${tier.borderColor} bg-gradient-to-br ${tier.color} text-white`}
                >
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-white/80 text-sm mb-4">{tier.benefits}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Min Points</span>
                    <span className="text-xl font-bold">{tier.minPoints.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickActionCard
              title="Adjust Customer Points"
              description="Manually add or deduct points from customer accounts"
              icon={Edit}
              gradient="from-blue-500 to-blue-600"
              action="Adjust Points"
            />
            <QuickActionCard
              title="Create New Reward"
              description="Add new redemption options for customers"
              icon={Gift}
              gradient="from-purple-500 to-purple-600"
              action="Create Reward"
            />
            <QuickActionCard
              title="View Analytics"
              description="Detailed insights into reward program performance"
              icon={TrendingUp}
              gradient="from-green-500 to-green-600"
              action="View Analytics"
            />
          </div>
        </>
      )}

      {/* Customers Tab */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Customer Points</h2>
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
              <button className="px-4 py-2 bg-slate-100 rounded-xl text-slate-700 hover:bg-slate-200 transition-colors">
                <Filter className="w-4 h-4 inline mr-2" />
                Filter
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Customer</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Points Balance</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Tier</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Last Activity</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{customer.name}</p>
                        <p className="text-xs text-slate-500">{customer.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-2" />
                        <span className="text-sm font-bold text-slate-900">{customer.points.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <TierBadge tier={customer.tier} />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={customer.status} />
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{customer.lastActivity}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600">
                          <Info className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Earning Rules Tab */}
      {activeTab === 'rules' && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Earning Rules</h2>
            <button
              onClick={() => setShowAddRuleModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg shadow-blue-500/30"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Add Rule
            </button>
          </div>
          <div className="space-y-4">
            {earningRules.map((rule) => (
              <div
                key={rule.id}
                className="p-6 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{rule.action}</h3>
                        <p className="text-sm text-slate-600">{rule.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-xs text-slate-500 mb-1">Points Awarded</p>
                      <p className="text-2xl font-bold text-blue-600">{rule.points}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Redemption Rewards Tab */}
      {activeTab === 'rewards' && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Redemption Rewards</h2>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-medium shadow-lg shadow-purple-500/30">
              <Plus className="w-4 h-4 inline mr-2" />
              Add Reward
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {redemptionRewards.map((reward) => (
              <div
                key={reward.id}
                className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg">
                    {reward.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{reward.name}</h3>
                <p className="text-sm text-slate-600 mb-4">{reward.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-purple-200">
                  <div className="flex items-center text-purple-600">
                    <Star className="w-4 h-4 mr-1" />
                    <span className="text-lg font-bold">{reward.pointsCost.toLocaleString()}</span>
                  </div>
                  <span className="text-xs text-slate-500">points</span>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <button className="flex-1 px-3 py-2 bg-white border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium">
                    <Edit className="w-4 h-4 inline mr-1" />
                    Edit
                  </button>
                  <button className="px-3 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Rule Modal */}
      {showAddRuleModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Add Earning Rule</h2>
              <button
                onClick={() => setShowAddRuleModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Action Name</label>
                <input
                  type="text"
                  placeholder="e.g., Monthly subscription payment"
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Points to Award</label>
                <input
                  type="number"
                  placeholder="100"
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  placeholder="Describe when and how points are earned..."
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddRuleModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium"
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  Save Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  gradient,
}: {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
  gradient: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div
          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
            trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {trend === 'up' ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {change}
        </div>
      </div>
      <h3 className="text-sm font-semibold text-slate-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

// Tier Badge Component
function TierBadge({ tier }: { tier: string }) {
  const tierConfig = {
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

// Status Badge Component
function StatusBadge({ status }: { status: 'active' | 'inactive' }) {
  const statusConfig = {
    active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active', icon: CheckCircle },
    inactive: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Inactive', icon: XCircle },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
}

// Quick Action Card Component
function QuickActionCard({
  title,
  description,
  icon: Icon,
  gradient,
  action,
}: {
  title: string;
  description: string;
  icon: any;
  gradient: string;
  action: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all">
      <div className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg mb-4`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 mb-4">{description}</p>
      <button className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium">
        {action}
      </button>
    </div>
  );
}
