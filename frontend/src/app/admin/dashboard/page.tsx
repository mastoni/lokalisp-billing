'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
  BarChart3,
  Search,
  ChevronRight,
  Wifi
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
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
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [distribution, setDistribution] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');

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

  const chartData = useMemo(() => {
    if (timeframe === 'weekly') {
      return [
        { name: 'Sen', value: 400000 },
        { name: 'Sel', value: 300000 },
        { name: 'Rab', value: 600000 },
        { name: 'Kam', value: 450000 },
        { name: 'Jum', value: 900000 },
        { name: 'Sab', value: 1200000 },
        { name: 'Min', value: 1000000 },
      ];
    }
    return [
      { name: 'Week 1', value: 2400000 },
      { name: 'Week 2', value: 1800000 },
      { name: 'Week 3', value: 3200000 },
      { name: 'Week 4', value: 4500000 },
    ];
  }, [timeframe]);

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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1 font-medium">Real-time performance analytics for your ISP business.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchDashboardData}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm group"
          >
            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : 'group-active:rotate-180 transition-transform duration-500'}`} />
          </button>
          <button 
            onClick={() => router.push('/admin/analytics')}
            className="flex items-center px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all font-black shadow-xl shadow-slate-200"
          >
            <Activity className="w-5 h-5 mr-2" />
            Laporan Lengkap
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Pendapatan" value={formatCurrency(stats?.totalRevenue || 0)} change="+12.5%" trend="up" icon={DollarSign} color="from-purple-500 to-purple-600" />
        <StatCard title="Revenue Bulan Ini" value={formatCurrency(stats?.monthlyRevenue || 0)} change="+8.2%" trend="up" icon={TrendingUp} color="from-blue-500 to-blue-600" />
        <StatCard title="Pelanggan Aktif" value={(stats?.activeCustomers || 0).toLocaleString()} change="+15" trend="up" icon={Users} color="from-emerald-500 to-emerald-600" />
        <StatCard title="Invoice Pending" value={(stats?.pendingInvoices || 0).toString()} change="-5" trend="down" icon={FileText} color="from-rose-500 to-rose-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart with Recharts */}
        <div className="lg:col-span-2">
          <GlassCard className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-xl font-black text-slate-900">Revenue Statistics</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Growth overview last {timeframe === 'weekly' ? '7 days' : '30 days'}</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-2xl shadow-inner">
                <button 
                  onClick={() => setTimeframe('weekly')}
                  className={`px-6 py-2 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest ${timeframe === 'weekly' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500'}`}
                >
                  Weekly
                </button>
                <button 
                  onClick={() => setTimeframe('monthly')}
                  className={`px-6 py-2 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest ${timeframe === 'monthly' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500'}`}
                >
                  Monthly
                </button>
              </div>
            </div>
            
            <div className="flex-1 min-h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} 
                    dy={10}
                  />
                  <YAxis 
                    hide 
                    domain={['auto', 'auto']}
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', fontWeight: 900, fontSize: '12px'}}
                    formatter={(val: number) => [formatCurrency(val), 'Revenue']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8b5cf6" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Package Distribution Bar Chart */}
        <div>
          <GlassCard className="h-full">
            <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
               <Package className="text-purple-600" /> Package Split
            </h2>
            <div className="h-[250px] w-full mb-8">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={distribution}>
                    <XAxis dataKey="package_name" hide />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="customer_count" radius={[10, 10, 10, 10]} barSize={40}>
                       {distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'][index % 4]} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {distribution.map((pkg, idx) => (
                <div key={pkg.package_name} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                     <div className={`w-3 h-3 rounded-full ${['bg-purple-600', 'bg-blue-600', 'bg-emerald-600', 'bg-orange-600'][idx % 4]}`}></div>
                     <span className="text-xs font-black text-slate-700">{pkg.package_name}</span>
                  </div>
                  <span className="text-xs font-black text-slate-400">{pkg.customer_count} USERS</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions Table */}
        <div className="lg:col-span-2">
          <GlassCard className="p-0 overflow-hidden">
            <div className="flex items-center justify-between p-8">
              <h2 className="text-xl font-black text-slate-900">Recent Transactions</h2>
              <button 
                onClick={() => router.push('/admin/payments')}
                className="px-6 py-2 bg-slate-100 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
              >
                Lihat Semua
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="text-left py-4 px-8 text-[10px] uppercase font-black tracking-widest text-slate-400">Invoice</th>
                    <th className="text-left py-4 px-8 text-[10px] uppercase font-black tracking-widest text-slate-400">Customer</th>
                    <th className="text-left py-4 px-8 text-[10px] uppercase font-black tracking-widest text-slate-400">Amount</th>
                    <th className="text-left py-4 px-8 text-[10px] uppercase font-black tracking-widest text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.map((t) => (
                    <tr key={t.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-5 px-8 text-sm font-black text-slate-900">#{t.invoice_number}</td>
                      <td className="py-5 px-8">
                         <p className="text-sm font-bold text-slate-800">{t.customer_name}</p>
                         <p className="text-[10px] font-medium text-slate-400">{t.package_name}</p>
                      </td>
                      <td className="py-5 px-8 text-sm font-black text-slate-900">{formatCurrency(t.amount)}</td>
                      <td className="py-5 px-8">
                         <StatusChip status={t.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* System Activity Feed */}
        <div>
          <GlassCard>
            <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
               <Activity className="text-indigo-600" /> Live Activity
            </h2>
            <div className="space-y-8">
              {activities.map((act, index) => (
                <div key={index} className="flex gap-4 group">
                  <div className="relative flex flex-col items-center">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      {getActivityIcon(act.activity_type)}
                    </div>
                    {index !== activities.length - 1 && (
                      <div className="w-px h-full bg-slate-100 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-xs text-slate-800 font-black leading-tight group-hover:text-purple-700 transition-colors">{act.description}</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-bold flex items-center uppercase tracking-wider">
                      <Clock className="w-2.5 h-2.5 mr-1 text-slate-300" />
                      {new Date(act.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, trend, icon: Icon, color }: any) {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 group hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} text-white shadow-xl shadow-current/20 group-hover:scale-110 transition-transform duration-500`}>
          <Icon className="w-8 h-8" />
        </div>
        <div className={`flex items-center px-3 py-1 rounded-xl text-[10px] font-black ${
          trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        }`}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {change}
        </div>
      </div>
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</h3>
      <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
    </div>
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
    paid: { bg: 'bg-emerald-50 text-emerald-600', label: 'LUNAS', icon: CheckCircle },
    pending: { bg: 'bg-amber-50 text-amber-600', label: 'PENDING', icon: Clock },
    overdue: { bg: 'bg-rose-50 text-rose-600', label: 'OVERDUE', icon: XCircle },
  };
  const config = configs[status.toLowerCase()] || configs.pending;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${config.bg}`}>
       <Icon className="w-3 h-3 mr-2" /> {config.label}
    </span>
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
