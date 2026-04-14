'use client';

import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
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
  AlertCircle,
  X
} from 'lucide-react';
import api from '@/lib/api';

type Redemption = {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  reward_id: string;
  reward_name: string;
  points_cost: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  created_at: string;
  processed_at?: string;
  processing_reason?: string;
};

export default function RedemptionsPage() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedRedemption, setSelectedRedemption] = useState<Redemption | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const fetchRedemptions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/rewards/redemptions');
      if (response.data.success) {
        setRedemptions(response.data.data.items || []);
      }
    } catch (error: any) {
      toast.error('Failed to fetch redemptions: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/rewards/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchRedemptions();
    fetchStats();
  }, []);

  const filteredRedemptions = useMemo(() => {
    return redemptions.filter((r) => {
      const matchesSearch =
        (r.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.reward_name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter ? r.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [redemptions, searchTerm, statusFilter]);

  const approveRedemption = async (id: string) => {
    try {
      const res = await api.patch(`/rewards/redemptions/${id}/process`, { status: 'approved' });
      if (res.data.success) {
        toast.success('Pencairan point disetujui!');
        setShowDetailModal(false);
        fetchRedemptions();
      }
    } catch (e: any) {
      toast.error('Gagal: ' + e.message);
    }
  };

  const rejectRedemption = async (id: string) => {
    const reason = prompt('Alasan penolakan:');
    if (reason === null) return;
    try {
      const res = await api.patch(`/rewards/redemptions/${id}/process`, { status: 'rejected', reason });
      if (res.data.success) {
        toast.success('Pencairan point ditolak.');
        setShowDetailModal(false);
        fetchRedemptions();
      }
    } catch (e: any) {
      toast.error('Gagal: ' + e.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg text-white font-black">
              <Gift className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Klaim Reward</h1>
              <p className="text-slate-500 font-medium">Review and process customer reward redemptions</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={fetchRedemptions}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex-shrink-0"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Klaim"
          value={redemptions.length.toString()}
          trend="up"
          change="+0"
          icon={Gift}
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Selesai"
          value={redemptions.filter(r => r.status === 'approved' || r.status === 'completed').length.toString()}
          trend="up"
          change="Sudah diproses"
          icon={CheckCircle}
          gradient="from-emerald-500 to-emerald-600"
        />
        <StatCard
          title="Menunggu"
          value={redemptions.filter(r => r.status === 'pending').length.toString()}
          trend="up"
          change="Perlu tindakan"
          icon={Clock}
          gradient="from-amber-500 to-amber-600"
        />
        <StatCard
          title="Total Points"
          value={stats ? Number(stats.totalPointsRedeemed).toLocaleString() : '0'}
          trend="up"
          change="Dikeluarkan"
          icon={Star}
          gradient="from-purple-500 to-purple-600"
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <h2 className="text-2xl font-black text-slate-900">Database Klaim</h2>
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
              <div className="flex items-center px-4 py-3 bg-slate-50 rounded-2xl border border-transparent focus-within:border-slate-200 transition-all">
                <Search className="w-5 h-5 text-slate-400 mr-3" />
                <input
                  type="text"
                  placeholder="Cari pelanggan atau reward..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm font-bold w-full md:w-64"
                />
              </div>
              <div className="flex items-center p-1 bg-slate-100 rounded-2xl">
                <button
                  onClick={() => setStatusFilter(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    !statusFilter ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  SEMUA
                </button>
                {['pending', 'approved', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all uppercase ${
                      statusFilter === status ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pelanggan</th>
                <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reward</th>
                <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Points</th>
                <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal</th>
                <th className="text-right py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                 [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={6} className="py-8 px-8"><div className="h-4 bg-slate-100 rounded-full animate-pulse w-3/4"></div></td></tr>
                ))
              ) : filteredRedemptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-24 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Data tidak ditemukan</td>
                </tr>
              ) : (
                filteredRedemptions.map((r) => (
                  <tr key={r.id} className="group hover:bg-slate-50/80 transition-all">
                    <td className="py-5 px-8">
                       <p className="text-sm font-black text-slate-900">{r.customer_name}</p>
                       <p className="text-[10px] font-medium text-slate-400">{r.customer_email}</p>
                    </td>
                    <td className="py-5 px-8 text-sm font-bold text-slate-700">{r.reward_name}</td>
                    <td className="py-5 px-8">
                       <div className="flex items-center text-purple-600">
                          <Star className="w-3 h-3 mr-1.5" />
                          <span className="text-sm font-black">{Number(r.points_cost).toLocaleString()}</span>
                       </div>
                    </td>
                    <td className="py-5 px-8">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="py-5 px-8 text-xs font-medium text-slate-500">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="py-5 px-8 text-right">
                       <button 
                        onClick={() => { setSelectedRedemption(r); setShowDetailModal(true); }}
                        className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                       >
                         <Eye size={18} />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRedemption && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-[3rem] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="p-8">
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Detail Klaim</h2>
                    <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                       <X className="w-6 h-6 text-slate-400" />
                    </button>
                 </div>

                 <div className="space-y-6">
                    <div className="p-6 bg-slate-50 rounded-[2rem]">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pelanggan</p>
                       <p className="text-lg font-black text-slate-900">{selectedRedemption.customer_name}</p>
                       <p className="text-sm font-medium text-slate-500">{selectedRedemption.customer_email}</p>
                    </div>

                    <div className="p-6 bg-purple-50 rounded-[2rem] border border-purple-100">
                       <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Reward</p>
                       <p className="text-lg font-black text-purple-600">{selectedRedemption.reward_name}</p>
                       <div className="flex items-center mt-2">
                          <Star className="w-4 h-4 text-purple-400 mr-2" />
                          <span className="text-sm font-black text-purple-600">{Number(selectedRedemption.points_cost).toLocaleString()} Points</span>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                       <div className="p-4 bg-slate-50 rounded-2xl">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">ID</p>
                          <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">#{selectedRedemption.id.split('-')[0]}</p>
                       </div>
                       <div className="p-4 bg-slate-50 rounded-2xl">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Tanggal</p>
                          <p className="text-xs font-bold text-slate-700">{new Date(selectedRedemption.created_at).toLocaleDateString()}</p>
                       </div>
                    </div>

                    {selectedRedemption.status === 'pending' ? (
                      <div className="flex gap-4 pt-4">
                        <button 
                          onClick={() => approveRedemption(selectedRedemption.id)}
                          className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                        >
                          SETUJUI
                        </button>
                        <button 
                          onClick={() => rejectRedemption(selectedRedemption.id)}
                          className="flex-1 bg-rose-600 text-white py-4 rounded-2xl font-black hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
                        >
                          TOLAK
                        </button>
                      </div>
                    ) : (
                      <div className="p-6 rounded-[2rem] bg-slate-100 text-center">
                         <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Klaim telah {selectedRedemption.status === 'approved' ? 'DISETUJUI' : 'DITOLAK'}</p>
                         {selectedRedemption.processing_reason && (
                           <p className="text-sm font-bold text-slate-600 mt-2">"{selectedRedemption.processing_reason}"</p>
                         )}
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

function StatCard({ title, value, change, trend, icon: Icon, gradient }: any) {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 hover:shadow-xl transition-all duration-500">
      <div className="flex items-center justify-between mb-6">
        <div className={`flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br ${gradient} shadow-lg text-white`}>
          <Icon className="w-8 h-8" />
        </div>
        <div className={`px-3 py-1 rounded-xl text-[10px] font-black ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {change}
        </div>
      </div>
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</h3>
      <p className="text-4xl font-black text-slate-900 tracking-tight">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: any = {
    approved: { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'DISETUJUI', icon: CheckCircle },
    completed: { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'SELESAI', icon: CheckCircle },
    pending: { bg: 'bg-amber-50', text: 'text-amber-600', label: 'PENDING', icon: Clock },
    rejected: { bg: 'bg-rose-50', text: 'text-rose-600', label: 'DITOLAK', icon: XCircle },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black tracking-widest ${config.bg} ${config.text}`}>
      <Icon className="w-3 h-3 mr-2" />
      {config.label}
    </span>
  );
}
