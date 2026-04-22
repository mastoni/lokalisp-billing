'use client';

import { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download,
  Calendar,
  ChevronRight,
  Zap,
  DollarSign,
  Activity,
  BarChart3,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const revenueData = [
  { name: 'Jan', revenue: 45000000 },
  { name: 'Feb', revenue: 52000000 },
  { name: 'Mar', revenue: 48000000 },
  { name: 'Apr', revenue: 61000000 },
  { name: 'May', revenue: 55000000 },
  { name: 'Jun', revenue: 67000000 },
];

const customerGrowthData = [
  { name: 'Jan', count: 400 },
  { name: 'Feb', count: 420 },
  { name: 'Mar', count: 450 },
  { name: 'Apr', count: 480 },
  { name: 'May', count: 510 },
  { name: 'Jun', count: 545 },
];

const packageDistData = [
  { name: 'Basic', value: 40, color: '#6366f1' },
  { name: 'Family', value: 35, color: '#8b5cf6' },
  { name: 'Premium', value: 25, color: '#ec4899' },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6M');

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 shadow-lg flex items-center justify-center text-white">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analytics Dashboard</h1>
            <p className="text-slate-500 font-medium tracking-tight">Wawasan mendalam tentang performa bisnis Anda</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
            {['1M', '3M', '6M', '1Y'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${timeRange === range ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 shadow-sm">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticStat 
          label="Total Revenue" 
          value="Rp 328,4M" 
          change="+12.5%" 
          trend="up" 
          icon={DollarSign} 
        />
        <AnalyticStat 
          label="Active Users" 
          value="545" 
          change="+4.3%" 
          trend="up" 
          icon={Users} 
        />
        <AnalyticStat 
          label="Avg. ARPU" 
          value="Rp 245K" 
          change="-1.2%" 
          trend="down" 
          icon={Activity} 
        />
        <AnalyticStat 
          label="Points Redemption" 
          value="1.2k" 
          change="+24%" 
          trend="up" 
          icon={Zap} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Performance */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Revenue Performance</h2>
            <TrendingUp size={20} className="text-emerald-500" />
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#94a3b8'}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  formatter={(value: any) => [`Rp ${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Growth */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Customer Growth</h2>
            <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">+45 THIS MONTH</div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerGrowthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#94a3b8'}} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Package Distribution */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm lg:col-span-1">
          <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8">Package Distribution</h2>
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={packageDistData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {packageDistData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {packageDistData.map((pkg) => (
              <div key={pkg.name} className="flex items-center justify-between">
                <div className="flex items-center text-xs font-bold text-slate-600">
                  <div className="w-3 h-3 rounded-full mr-3" style={{backgroundColor: pkg.color}}></div>
                  {pkg.name} Package
                </div>
                <span className="text-xs font-black text-slate-900">{pkg.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm lg:col-span-2">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Top Performance Agents</h2>
              <button className="text-xs font-black text-indigo-600 hover:text-indigo-700">View All Account</button>
           </div>
           <div className="space-y-6">
              {[
                { name: 'Sembok Global', customers: 124, revenue: 15450000, trend: '+8%' },
                { name: 'Jaya Mandiri', customers: 89, revenue: 9840000, trend: '+12%' },
                { name: 'Putra Tech', customers: 76, revenue: 8200000, trend: '-2%' },
                { name: 'Mega Nusantara', customers: 54, revenue: 6100000, trend: '+5%' },
              ].map((agent, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-black text-xs text-slate-900">{agent.name.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-black text-slate-900 leading-tight">{agent.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{agent.customers} Customers</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">Rp {agent.revenue.toLocaleString()}</p>
                    <p className={`text-[10px] font-black ${agent.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{agent.trend}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticStat({ label, value, change, trend, icon: Icon }: any) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
          <Icon size={24} />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {change}
        </div>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
    </div>
  );
}
