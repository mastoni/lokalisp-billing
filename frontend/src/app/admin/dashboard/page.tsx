'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  CreditCard,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Star,
  Gift,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Zap,
  RefreshCcw,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

type DashboardStats = {
  totalRevenue: number;
  monthlyRevenue: number;
  activeCustomers: number;
  pendingInvoices: number;
  totalPayments: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [distribution, setDistribution] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, transRes, actRes, distRes, topRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/recent-transactions'),
        api.get('/dashboard/recent-activity'),
        api.get('/dashboard/package-distribution'),
        api.get('/dashboard/top-customers'),
      ]);

      setStats(statsRes.data.data);
      setTransactions(transRes.data.data);
      setActivities(actRes.data.data);
      setDistribution(distRes.data.data);
      setTopCustomers(topRes.data.data);
    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Gagal mengambil data dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 border-t-purple-600 animate-spin"></div>
          <div className="absolute inset-4 rounded-full border-4 border-blue-500/20 border-b-blue-600 animate-spin-slow"></div>
        </div>
        <p className="mt-6 text-slate-500 font-medium animate-pulse">Menyiapkan Dashboard...</p>
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Pantau performa bisnis ISP Anda secara real-time.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchDashboardData}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm group"
          >
            <RefreshCcw className="w-5 h-5 group-active:rotate-180 transition-transform duration-500" />
          </button>
          <button className="flex items-center px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all font-bold shadow-lg shadow-purple-500/25">
            <Activity className="w-4 h-4 mr-2" />
            Laporan Lengkap
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Pendapatan"
          value={formatCurrency(stats?.totalRevenue || 0)}
          change="+12.5%"
          trend="up"
          icon={DollarSign}
          color="bg-purple-600"
          bgLight="bg-purple-50"
        />
        <StatCard
          title="Pendapatan Bulan Ini"
          value={formatCurrency(stats?.monthlyRevenue || 0)}
          change="+8.2%"
          trend="up"
          icon={TrendingUp}
          color="bg-blue-600"
          bgLight="bg-blue-50"
        />
        <StatCard
          title="Pelanggan Aktif"
          value={(stats?.activeCustomers || 0).toString()}
          change="+15"
          trend="up"
          icon={Users}
          color="bg-emerald-600"
          bgLight="bg-emerald-50"
        />
        <StatCard
          title="Tagihan Pending"
          value={(stats?.pendingInvoices || 0).toString()}
          change="-5"
          trend="down"
          icon={FileText}
          color="bg-rose-600"
          bgLight="bg-rose-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart Placeholder */}
        <div className="lg:col-span-2 group">
          <GlassCard className="h-full overflow-hidden">
            <div className="flex items-center justify-between mb-8 p-1">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Statistik Pendapatan</h2>
                <p className="text-sm text-slate-500">Perbandingan harian dalam 7 hari terakhir</p>
              </div>
              <div className="flex bg-slate-100/80 p-1 rounded-xl">
                <button className="px-4 py-1.5 text-xs font-bold bg-white text-purple-600 rounded-lg shadow-sm">Mingguan</button>
                <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors">Bulanan</button>
              </div>
            </div>
            
            <div className="h-72 bg-gradient-to-br from-purple-50/50 to-blue-50/50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 relative group-hover:from-purple-50 group-hover:to-blue-50 transition-all duration-500">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:20px_20px]"></div>
              <BarChart3 className="w-16 h-16 text-purple-400 mb-4 animate-bounce-slow" />
              <p className="text-slate-900 font-bold z-10">Revenue Data Visualization</p>
              <p className="text-xs text-slate-500 z-10 max-w-xs text-center px-4">Modul grafik akan ditarik dari integrasi library Chart.js atau Recharts.</p>
            </div>
          </GlassCard>
        </div>

        {/* Package Distribution */}
        <div>
          <GlassCard className="h-full">
            <h2 className="text-xl font-bold text-slate-900 mb-8 border-l-4 border-purple-600 pl-4">Distribusi Paket</h2>
            <div className="space-y-6">
              {distribution.length > 0 ? (
                distribution.map((pkg, idx) => {
                  const colors = ['bg-purple-600', 'bg-blue-600', 'bg-emerald-600', 'bg-orange-600'];
                  const percentage = stats?.activeCustomers ? Math.round((pkg.customer_count / stats.activeCustomers) * 100) : 0;
                  return (
                    <div key={pkg.package_name} className="group/item">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-700 group-hover/item:text-purple-600 transition-colors">{pkg.package_name}</span>
                        <span className="text-xs font-black bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">{pkg.customer_count} Akun</span>
                      </div>
                      <div className="relative h-2.5 w-full bg-slate-200/50 rounded-full overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${colors[idx % colors.length]}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{percentage}% dari total</p>
                    </div>
                  );
                })
              ) : (
                <EmptyState message="Belum ada data paket" />
              )}
            </div>
            
            <div className="mt-10 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl border border-purple-100 shadow-inner">
                <span className="text-sm font-bold text-purple-700">Total Pelanggan</span>
                <span className="text-2xl font-black text-purple-900">{stats?.activeCustomers || 0}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <GlassCard className="p-0 overflow-hidden">
            <div className="flex items-center justify-between p-6 pb-4">
              <h2 className="text-xl font-bold text-slate-900">Transaksi Terbaru</h2>
              <button className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-all">Lihat Semua</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500">
                    <th className="text-left py-4 px-6 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">Invoice</th>
                    <th className="text-left py-4 px-6 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">Pelanggan</th>
                    <th className="text-left py-4 px-6 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">Nominal</th>
                    <th className="text-left py-4 px-6 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.map((t) => (
                    <tr key={t.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 text-sm font-bold text-slate-900">#{t.invoice_number}</td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800">{t.customer_name}</span>
                          <span className="text-[10px] font-medium text-slate-400">{t.package_name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm font-black text-slate-900">{formatCurrency(t.amount)}</td>
                      <td className="py-4 px-6">
                        <StatusChip status={t.status} />
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-slate-400 italic">Tidak ada transaksi baru</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Activity Feed */}
        <div>
          <GlassCard>
            <h2 className="text-xl font-bold text-slate-900 mb-8 border-l-4 border-indigo-600 pl-4">Aktivitas Sistem</h2>
            <div className="space-y-6">
              {activities.length > 0 ? (
                activities.map((act, index) => (
                  <div key={index} className="flex gap-4 group">
                    <div className="relative flex flex-col items-center">
                      <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-sm">
                        {getActivityIcon(act.activity_type)}
                      </div>
                      {index !== activities.length - 1 && (
                        <div className="w-px h-full bg-slate-100 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-6 min-w-0">
                      <p className="text-sm text-slate-800 font-bold leading-tight decoration-purple-500 group-hover:underline">{act.description}</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold flex items-center uppercase tracking-wider">
                        <Clock className="w-2.5 h-2.5 mr-1" />
                        {new Date(act.created_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState message="Riwayat aktivitas kosong" />
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Top Customers Section */}
      <GlassCard className="relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Star className="w-32 h-32" />
        </div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900 underline decoration-purple-500 decoration-4 underline-offset-8">Top Revenue Customers</h2>
            <p className="text-sm text-slate-500 mt-3 pt-1">Pelanggan paling loyal dengan kontribusi pendapatan tertinggi.</p>
          </div>
          <Star className="w-8 h-8 text-amber-400 fill-amber-400 animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {topCustomers.map((customer, idx) => (
            <div 
              key={customer.id} 
              className="relative p-6 bg-white border border-slate-100 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm"
            >
              <div className="absolute top-4 right-4 text-slate-100 text-6xl font-black italic select-none">#{idx + 1}</div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg mb-4">
                  {customer.name.substring(0, 2).toUpperCase()}
                </div>
                <h3 className="text-sm font-black text-slate-900 truncate mb-1">{customer.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{customer.package_name || 'No Package'}</p>
                <div className="mt-4 pt-4 border-t border-slate-50">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total Paid</p>
                  <p className="text-lg font-black text-purple-600">{formatCurrency(parseInt(customer.total_paid || '0'))}</p>
                </div>
              </div>
            </div>
          ))}
          {topCustomers.length === 0 && <div className="col-span-full py-12 text-center text-slate-400 italic">Belum ada peringkat pelanggan</div>}
        </div>
      </GlassCard>
    </div>
  );
}

// Reusable Components
function StatCard({ title, value, change, trend, icon: Icon, color, bgLight }: any) {
  return (
    <GlassCard className="group hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className={`p-4 rounded-3xl ${color} text-white shadow-xl shadow-current/20 group-hover:scale-110 transition-transform duration-500`}>
          <Icon className="w-8 h-8" />
        </div>
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-black ${
          trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
        }`}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </div>
      </div>
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{title}</h3>
      <p className="text-2xl font-black text-slate-900 leading-none">{value}</p>
    </GlassCard>
  );
}

function GlassCard({ children, className = "" }: any) {
  return (
    <div className={`bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 ${className}`}>
      {children}
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  const configs: any = {
    paid: { bg: 'bg-emerald-100 text-emerald-700', label: 'Lunas' },
    pending: { bg: 'bg-amber-100 text-amber-700', label: 'Pending' },
    overdue: { bg: 'bg-rose-100 text-rose-700', label: 'Terlambat' },
  };
  const config = configs[status.toLowerCase()] || configs.pending;
  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${config.bg}`}>
      {config.label}
    </span>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-8 flex flex-col items-center justify-center opacity-40">
      <Activity className="w-10 h-10 mb-2" />
      <span className="text-xs font-black uppercase tracking-tighter">{message}</span>
    </div>
  );
}

function getActivityIcon(type: string) {
  switch (type.toLowerCase()) {
    case 'payment': return <CreditCard className="w-5 h-5" />;
    case 'invoice': return <FileText className="w-5 h-5" />;
    case 'customer': return <Users className="w-5 h-5" />;
    case 'reward': return <Gift className="w-5 h-5" />;
    default: return <Activity className="w-5 h-5" />;
  }
}
