'use client';

import { useState } from 'react';
import {
  Gift,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  Star,
  User,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

// Mock redemption data
const redemptions = [
  {
    id: 'RED-001',
    customer: 'Ahmad Rizki',
    email: 'ahmad@email.com',
    reward: '1 Month Free Premium',
    pointsCost: 10000,
    status: 'completed' as const,
    requestDate: '2026-04-14',
    completedDate: '2026-04-14',
    category: 'Service Credit',
  },
  {
    id: 'RED-002',
    customer: 'Budi Santoso',
    email: 'budi@email.com',
    reward: 'Speed Upgrade (1 month)',
    pointsCost: 3000,
    status: 'pending' as const,
    requestDate: '2026-04-14',
    completedDate: null,
    category: 'Upgrade',
  },
  {
    id: 'RED-003',
    customer: 'Siti Nurhaliza',
    email: 'siti@email.com',
    reward: 'Bill Discount Rp 100K',
    pointsCost: 4000,
    status: 'completed' as const,
    requestDate: '2026-04-13',
    completedDate: '2026-04-13',
    category: 'Discount',
  },
  {
    id: 'RED-004',
    customer: 'Dewi Lestari',
    email: 'dewi@email.com',
    reward: 'Router Upgrade',
    pointsCost: 8000,
    status: 'processing' as const,
    requestDate: '2026-04-13',
    completedDate: null,
    category: 'Equipment',
  },
  {
    id: 'RED-005',
    customer: 'Eko Prasetyo',
    email: 'eko@email.com',
    reward: '1 Month Free Basic',
    pointsCost: 5000,
    status: 'rejected' as const,
    requestDate: '2026-04-12',
    completedDate: null,
    category: 'Service Credit',
    rejectionReason: 'Insufficient points balance',
  },
  {
    id: 'RED-006',
    customer: 'Fitriani',
    email: 'fitri@email.com',
    reward: 'Bill Discount Rp 250K',
    pointsCost: 9000,
    status: 'completed' as const,
    requestDate: '2026-04-12',
    completedDate: '2026-04-12',
    category: 'Discount',
  },
  {
    id: 'RED-007',
    customer: 'Gunawan',
    email: 'gunawan@email.com',
    reward: 'Free Installation',
    pointsCost: 6000,
    status: 'pending' as const,
    requestDate: '2026-04-11',
    completedDate: null,
    category: 'Service',
  },
  {
    id: 'RED-008',
    customer: 'Hana Pertiwi',
    email: 'hana@email.com',
    reward: 'Data Recovery Service',
    pointsCost: 2000,
    status: 'completed' as const,
    requestDate: '2026-04-10',
    completedDate: '2026-04-10',
    category: 'Service',
  },
];

const redemptionStats = {
  totalRedemptions: 156,
  completedRedemptions: 128,
  pendingRedemptions: 18,
  processingRedemptions: 7,
  rejectedRedemptions: 3,
  totalPointsRedeemed: 892340,
  avgProcessingTime: '2.3 hours',
  completionRate: '82.1%',
};

const categoryDistribution = [
  { category: 'Service Credit', count: 58, percentage: 37, color: 'bg-blue-500' },
  { category: 'Discount', count: 45, percentage: 29, color: 'bg-green-500' },
  { category: 'Upgrade', count: 32, percentage: 21, color: 'bg-purple-500' },
  { category: 'Equipment', count: 12, percentage: 8, color: 'bg-orange-500' },
  { category: 'Service', count: 9, percentage: 5, color: 'bg-teal-500' },
];

export default function RedemptionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedRedemption, setSelectedRedemption] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredRedemptions = redemptions.filter((r) => {
    const matchesSearch =
      r.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reward.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? r.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 shadow-lg">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Redemptions</h1>
              <p className="text-slate-600">Track and manage reward point redemptions</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors font-medium">
            <Download className="w-4 h-4 inline mr-2" />
            Export
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition-all font-medium shadow-lg shadow-green-500/30">
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Redemptions"
          value={redemptionStats.totalRedemptions.toString()}
          change="+23"
          trend="up"
          icon={Gift}
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Completed"
          value={redemptionStats.completedRedemptions.toString()}
          change="+18"
          trend="up"
          icon={CheckCircle}
          gradient="from-green-500 to-green-600"
        />
        <StatCard
          title="Pending"
          value={redemptionStats.pendingRedemptions.toString()}
          change="-3"
          trend="down"
          icon={Clock}
          gradient="from-orange-500 to-orange-600"
        />
        <StatCard
          title="Completion Rate"
          value={redemptionStats.completionRate}
          change="+5.2%"
          trend="up"
          icon={ArrowUpRight}
          gradient="from-purple-500 to-purple-600"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Processing"
          value={redemptionStats.processingRedemptions.toString()}
          change="7"
          trend="up"
          icon={RefreshCw}
          gradient="from-teal-500 to-teal-600"
          small
        />
        <StatCard
          title="Rejected"
          value={redemptionStats.rejectedRedemptions.toString()}
          change="-2"
          trend="down"
          icon={XCircle}
          gradient="from-red-500 to-red-600"
          small
        />
        <StatCard
          title="Avg. Processing Time"
          value={redemptionStats.avgProcessingTime}
          change="-0.5h"
          trend="down"
          icon={Calendar}
          gradient="from-pink-500 to-pink-600"
          small
        />
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Redemption by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {categoryDistribution.map((cat) => (
            <div
              key={cat.category}
              className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-700">{cat.category}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                <div
                  className={`${cat.color} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${cat.percentage}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{cat.percentage}%</span>
                <span className="text-sm font-bold text-slate-900">{cat.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Redemptions Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Redemption Requests</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center px-4 py-2 bg-slate-100 rounded-xl">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Search redemptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-64"
              />
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setStatusFilter(null)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !statusFilter
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {['pending', 'processing', 'completed', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">ID</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Reward</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Points</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRedemptions.map((redemption) => (
                <tr key={redemption.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-semibold text-slate-900">{redemption.id}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{redemption.customer}</p>
                      <p className="text-xs text-slate-500">{redemption.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{redemption.reward}</p>
                      <p className="text-xs text-slate-500">{redemption.category}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center text-purple-600">
                      <Star className="w-4 h-4 mr-1" />
                      <span className="text-sm font-bold">{redemption.pointsCost.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <RedemptionStatusBadge status={redemption.status} />
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{redemption.requestDate}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRedemption(redemption);
                          setShowDetailModal(true);
                        }}
                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {redemption.status === 'pending' && (
                        <>
                          <button className="p-2 rounded-lg hover:bg-green-100 transition-colors text-green-600">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-red-100 transition-colors text-red-600">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRedemption && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Redemption Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Status */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Status</span>
                    <RedemptionStatusBadge status={selectedRedemption.status} />
                  </div>
                </div>

                {/* Customer Info */}
                <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{selectedRedemption.customer}</h3>
                      <p className="text-sm text-slate-600">{selectedRedemption.email}</p>
                    </div>
                  </div>
                </div>

                {/* Redemption Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Redemption ID</p>
                    <p className="text-lg font-bold text-slate-900">{selectedRedemption.id}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Points Cost</p>
                    <div className="flex items-center text-purple-600">
                      <Star className="w-5 h-5 mr-1" />
                      <p className="text-lg font-bold">{selectedRedemption.pointsCost.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Request Date</p>
                    <p className="text-lg font-bold text-slate-900">{selectedRedemption.requestDate}</p>
                  </div>
                  {selectedRedemption.completedDate && (
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-500 mb-1">Completed Date</p>
                      <p className="text-lg font-bold text-slate-900">{selectedRedemption.completedDate}</p>
                    </div>
                  )}
                </div>

                {/* Reward Details */}
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <div className="flex items-center space-x-3 mb-3">
                    <Gift className="w-6 h-6 text-purple-600" />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{selectedRedemption.reward}</h3>
                      <p className="text-sm text-slate-600">{selectedRedemption.category}</p>
                    </div>
                  </div>
                </div>

                {/* Rejection Reason */}
                {selectedRedemption.rejectionReason && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="text-sm font-semibold text-red-900">Rejection Reason</p>
                        <p className="text-sm text-red-700">{selectedRedemption.rejectionReason}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {selectedRedemption.status === 'pending' && (
                  <div className="flex items-center space-x-3 pt-4">
                    <button className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-medium shadow-lg">
                      <CheckCircle className="w-5 h-5 inline mr-2" />
                      Approve
                    </button>
                    <button className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium shadow-lg">
                      <XCircle className="w-5 h-5 inline mr-2" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
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
  small = false,
}: {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
  gradient: string;
  small?: boolean;
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
      <h3 className={`font-semibold text-slate-600 mb-1 ${small ? 'text-sm' : 'text-base'}`}>{title}</h3>
      <p className={`font-bold text-slate-900 ${small ? 'text-xl' : 'text-2xl'}`}>{value}</p>
    </div>
  );
}

// Redemption Status Badge Component
function RedemptionStatusBadge({ status }: { status: 'pending' | 'processing' | 'completed' | 'rejected' }) {
  const statusConfig = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending', icon: Clock },
    processing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Processing', icon: RefreshCw },
    completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed', icon: CheckCircle },
    rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected', icon: XCircle },
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
