'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
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
  X,
  RefreshCw,
  ChevronRight,
  LayoutGrid,
  List,
  Eye,
  Send,
  User,
  MessageCircle,
  Award,
  Zap,
  Target
} from 'lucide-react';
import api from '@/lib/api';

// Reward tiers configuration
const rewardTiers = [
  { name: 'Bronze', minPoints: 0, color: 'from-amber-600 to-amber-700', borderColor: 'border-amber-500', benefits: '5% bonus points' },
  { name: 'Silver', minPoints: 1000, color: 'from-slate-400 to-slate-500', borderColor: 'border-slate-400', benefits: '10% bonus points + Priority support' },
  { name: 'Gold', minPoints: 2500, color: 'from-yellow-500 to-yellow-600', borderColor: 'border-yellow-500', benefits: '15% bonus points + Free upgrades + Priority support' },
  { name: 'Platinum', minPoints: 5000, color: 'from-purple-500 to-purple-600', borderColor: 'border-purple-500', benefits: '20% bonus points + Exclusive offers + Dedicated support' },
];

type RewardStats = {
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  totalPointsOutstanding: number;
  activeMembers: number;
  redemptionRate: string;
  avgPointsPerCustomer: number;
};

type EarningRule = {
  id: string;
  action_name: string;
  points: number;
  description: string;
  is_active: boolean;
};

type RedemptionReward = {
  id: string;
  name: string;
  description: string;
  points_cost: number;
  category: string;
  is_active: boolean;
};

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'rules' | 'rewards'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  // Modal States
  const [modalType, setModalType] = useState<'add_rule' | 'edit_rule' | 'add_reward' | 'edit_reward' | 'adjust_points' | 'message' | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [stats, setStats] = useState<RewardStats | null>(null);
  const [rules, setRules] = useState<EarningRule[]>([]);
  const [rewards, setRewards] = useState<RedemptionReward[]>([]);
  const [customerData, setCustomerData] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formRule, setFormRule] = useState({ action_name: '', points: '0', description: '', is_active: true });
  const [formReward, setFormReward] = useState({ name: '', points_cost: '0', category: '', description: '', is_active: true });
  const [formAdjust, setFormAdjust] = useState({ customerId: '', points: '0', reason: 'Manual Adjustment' });
  const [message, setMessage] = useState('');

  const loadStats = async () => {
    try {
      const res = await api.get('/rewards/stats');
      if (res.data.success) setStats(res.data.data);
    } catch (e: any) {}
  };

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/rewards/customers');
      if (res.data.success) setCustomerData(res.data.data.items || []);
    } catch (e: any) {
      toast.error('Gagal mengambil data pelanggan');
    } finally {
      setLoading(false);
    }
  };

  const loadRules = async () => {
    try {
      setLoading(true);
      const res = await api.get('/rewards/earning-rules');
      if (res.data.success) setRules(res.data.data || []);
    } catch (e: any) {
      toast.error('Gagal mengambil data aturan');
    } finally {
      setLoading(false);
    }
  };

  const loadRewardsData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/rewards/rewards');
      if (res.data.success) setRewards(res.data.data || []);
    } catch (e: any) {
      toast.error('Gagal mengambil data reward');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'customers') loadCustomers();
    if (activeTab === 'rules') loadRules();
    if (activeTab === 'rewards') loadRewardsData();
  }, [activeTab]);

  const filteredCustomers = useMemo(() => {
    return customerData.filter((c) => {
      const matchesSearch = (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (c.email || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTier = tierFilter ? c.tier === tierFilter : true;
      return matchesSearch && matchesTier;
    });
  }, [customerData, searchTerm, tierFilter]);

  // Actions
  const handleDeleteRule = async (id: string) => {
    if (!confirm('Yakin ingin menghapus aturan ini?')) return;
    try {
      await api.delete(`/rewards/earning-rules/${id}`);
      toast.success('Aturan dihapus');
      loadRules();
    } catch (err: any) {
      toast.error('Gagal menghapus aturan');
    }
  };

  const handleDeleteReward = async (id: string) => {
    if (!confirm('Yakin ingin menghapus reward ini?')) return;
    try {
      await api.delete(`/rewards/rewards/${id}`);
      toast.success('Reward dihapus');
      loadRewardsData();
    } catch (err: any) {
      toast.error('Gagal menghapus reward');
    }
  };

  const handleEditRule = (rule: EarningRule) => {
    setSelectedItem(rule);
    setFormRule({
      action_name: rule.action_name,
      points: rule.points.toString(),
      description: rule.description,
      is_active: rule.is_active
    });
    setModalType('edit_rule');
  };

  const handleEditReward = (reward: RedemptionReward) => {
    setSelectedItem(reward);
    setFormReward({
      name: reward.name,
      points_cost: reward.points_cost.toString(),
      category: reward.category,
      description: reward.description,
      is_active: reward.is_active
    });
    setModalType('edit_reward');
  };

  const handleOpenChat = (customer: any) => {
    setSelectedItem(customer);
    setModalType('message');
  };

  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const body = { ...formRule, points: Number(formRule.points) };
      if (modalType === 'add_rule') {
        await api.post('/rewards/earning-rules', body);
        toast.success('Aturan baru dibuat');
      } else {
        await api.put(`/rewards/earning-rules/${selectedItem.id}`, body);
        toast.success('Aturan diperbarui');
      }
      setModalType(null);
      loadRules();
    } catch (err: any) {
      toast.error('Gagal menyimpan aturan');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveReward = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const body = { ...formReward, points_cost: Number(formReward.points_cost) };
      if (modalType === 'add_reward') {
        await api.post('/rewards/rewards', body);
        toast.success('Reward baru dibuat');
      } else {
        await api.put(`/rewards/rewards/${selectedItem.id}`, body);
        toast.success('Reward diperbarui');
      }
      setModalType(null);
      loadRewardsData();
    } catch (err: any) {
      toast.error('Gagal menyimpan reward');
    } finally {
      setSaving(false);
    }
  };

  const handleAdjustPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.post('/rewards/adjust-points', {
        customerId: formAdjust.customerId,
        points: Number(formAdjust.points),
        reason: formAdjust.reason
      });
      toast.success('Poin berhasil disesuaikan');
      setModalType(null);
      if (activeTab === 'customers') loadCustomers();
      loadStats();
    } catch (err: any) {
      toast.error('Gagal menyesuaikan poin');
    } finally {
      setSaving(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    toast.loading('Mengirim pesan...', { id: 'send-msg' });
    setTimeout(() => {
       toast.success(`Pesan terkirim ke ${selectedItem?.name}`, { id: 'send-msg' });
       setMessage('');
       setModalType(null);
    }, 1000);
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
              <Gift className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Reward Points</h1>
              <p className="text-slate-600 font-medium tracking-tight">Manage customer loyalty rewards and incentives</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => { setActiveTab('rewards'); setModalType('add_reward'); }}
          className="px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all font-black flex items-center shadow-xl shadow-slate-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Reward
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center p-1 bg-slate-100 rounded-2xl w-fit">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'customers', label: 'Customers', icon: Users },
          { id: 'rules', label: 'Rules', icon: Star },
          { id: 'rewards', label: 'Rewards', icon: Gift },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-6 py-2.5 rounded-xl transition-all font-black text-xs uppercase tracking-widest ${
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Points Issued" value={stats?.totalPointsIssued ? Number(stats.totalPointsIssued).toLocaleString() : '0'} change="+12%" trend="up" icon={Star} gradient="from-blue-500 to-blue-600" />
            <StatCard title="Redeemed" value={stats?.totalPointsRedeemed ? Number(stats.totalPointsRedeemed).toLocaleString() : '0'} change="+8%" trend="up" icon={Gift} gradient="from-purple-500 to-purple-600" />
            <StatCard title="Members" value={stats?.activeMembers ? stats.activeMembers.toLocaleString() : '0'} change="+5" trend="up" icon={Users} gradient="from-pink-500 to-pink-600" />
            <StatCard title="Rate" value={stats?.redemptionRate || '0%'} change="+3%" trend="up" icon={TrendingUp} gradient="from-emerald-500 to-emerald-600" />
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
              <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
                 <Star className="text-yellow-500" /> Upgradeable Tiers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {rewardTiers.map((tier) => (
                  <div key={tier.name} className={`p-6 rounded-[2rem] bg-gradient-to-br ${tier.color} text-white shadow-lg relative group overflow-hidden`}>
                     <Star className="absolute -bottom-4 -right-4 w-20 h-20 text-white/10 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
                     <h3 className="text-xl font-black mb-1">{tier.name}</h3>
                     <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-4">Min {tier.minPoints.toLocaleString()} Pts</p>
                     <p className="text-xs font-medium leading-relaxed opacity-90">{tier.benefits}</p>
                  </div>
                ))}
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickActionCard 
              title="Adjust Points" description="Manual correction of customer point balances" icon={Edit} color="bg-blue-600" 
              onClick={() => { setModalType('adjust_points'); loadCustomers(); }} 
            />
            <QuickActionCard 
              title="Add Reward" description="Create new redemption options for customers" icon={Plus} color="bg-purple-600" 
              onClick={() => { setActiveTab('rewards'); setModalType('add_reward'); }} 
            />
            <QuickActionCard 
              title="View Insights" description="Deep dive into program performance analytics" icon={TrendingUp} color="bg-pink-600" 
              onClick={() => window.location.href = '/admin/rewards/leaderboard'} 
            />
          </div>
        </div>
      )}

      {/* Customers Tab */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
             <div className="flex items-center p-1 bg-slate-100 rounded-2xl w-fit">
                <button onClick={() => setTierFilter(null)} className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase ${!tierFilter ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>SEMUA</button>
                {['Platinum', 'Gold', 'Silver', 'Bronze'].map(t => (
                  <button key={t} onClick={() => setTierFilter(t)} className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase ${tierFilter === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
                    {t}
                  </button>
                ))}
             </div>
             <div className="flex items-center gap-3">
                <div className="flex items-center px-4 py-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <Search className="w-4 h-4 text-slate-400 mr-2" />
                    <input type="text" placeholder="Cari pelanggan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none text-xs font-bold w-48" />
                </div>
                <div className="flex items-center bg-white border border-slate-200 rounded-2xl overflow-hidden p-1 shadow-sm">
                  <button onClick={() => setViewMode('list')} className={`p-2 transition-all rounded-xl ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>
                    <List size={18} />
                  </button>
                  <button onClick={() => setViewMode('grid')} className={`p-2 transition-all rounded-xl ${viewMode === 'grid' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>
                    <LayoutGrid size={18} />
                  </button>
                </div>
             </div>
          </div>

          {viewMode === 'list' ? (
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                      <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Points</th>
                      <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tier</th>
                      <th className="text-right py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                       [...Array(5)].map((_, i) => <tr key={i}><td colSpan={5} className="py-8 px-8"><div className="h-4 bg-slate-100 rounded-full animate-pulse w-3/4"></div></td></tr>)
                    ) : filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-slate-50 group transition-all">
                        <td className="py-5 px-8">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-xs text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-all uppercase">{customer.name.substring(0, 2)}</div>
                              <div><p className="text-sm font-black text-slate-900 leading-tight">{customer.name}</p></div>
                           </div>
                        </td>
                        <td className="py-5 px-8">
                           <div className="flex items-center text-slate-900 font-black">
                             <Star className="w-4 h-4 text-yellow-500 mr-2" /> {Number(customer.points).toLocaleString()}
                           </div>
                        </td>
                        <td className="py-5 px-8"><TierBadge tier={customer.tier} /></td>
                        <td className="py-5 px-8 text-right">
                           <div className="flex items-center justify-end gap-2 opacity-30 group-hover:opacity-100 transition-all">
                              <button onClick={() => { setModalType('adjust_points'); setFormAdjust({...formAdjust, customerId: customer.id}); }} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"><Edit size={14} /></button>
                              <button onClick={() => handleOpenChat(customer)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><MessageCircle size={14} /></button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {loading ? (
                 [...Array(4)].map((_, i) => <div key={i} className="h-64 bg-slate-100 rounded-[2.5rem] animate-pulse"></div>)
               ) : filteredCustomers.map((customer) => (
                 <div key={customer.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center text-center">
                    <TierBadge tier={customer.tier} />
                    <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-400 my-4 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
                       <User size={40} />
                    </div>
                    <h3 className="text-base font-black text-slate-900 line-clamp-1">{customer.name}</h3>
                    <div className="bg-purple-50 px-6 py-2 rounded-2xl flex items-center my-6">
                       <Star className="w-4 h-4 text-purple-600 mr-2" />
                       <span className="text-xl font-black text-purple-600">{Number(customer.points).toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2 w-full">
                       <button onClick={() => { setModalType('adjust_points'); setFormAdjust({...formAdjust, customerId: customer.id}); }} className="flex-1 py-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all font-black text-[10px] tracking-widest uppercase">EDIT</button>
                       <button onClick={() => handleOpenChat(customer)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all"><MessageCircle size={16} /></button>
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>
      )}

      {/* Rules Tab */}
      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button 
            onClick={() => { setModalType('add_rule'); setFormRule({ action_name: '', points: '0', description: '', is_active: true }); }}
            className="p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-all bg-slate-50/50"
          >
            <Plus size={48} className="mb-4" />
            <p className="font-black text-sm uppercase tracking-widest">New Earning Rule</p>
          </button>
          {rules.map(rule => (
            <div key={rule.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm group relative">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center"><Star size={24} /></div>
                  <div className="flex gap-2">
                     <button onClick={() => handleEditRule(rule)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"><Edit size={14} /></button>
                     <button onClick={() => handleDeleteRule(rule.id)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-600 hover:text-white transition-all shadow-sm"><Trash2 size={14} /></button>
                  </div>
               </div>
               <h3 className="text-lg font-black text-slate-900 mb-2">{rule.action_name}</h3>
               <p className="text-xs font-medium text-slate-500 leading-relaxed mb-6 line-clamp-2">{rule.description}</p>
               <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${rule.is_active ? 'text-emerald-500' : 'text-slate-300'}`}>{rule.is_active ? 'ACTIVE' : 'DISABLED'}</span>
                  <p className="text-2xl font-black text-blue-600">+{rule.points}</p>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button 
            onClick={() => { setModalType('add_reward'); setFormReward({ name: '', points_cost: '0', category: '', description: '', is_active: true }); }}
            className="p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-purple-500 hover:text-purple-500 transition-all bg-slate-50/50"
          >
            <Plus size={48} className="mb-4" />
            <p className="font-black text-sm uppercase tracking-widest text-center">New Reward</p>
          </button>
          {rewards.map(reward => (
            <div key={reward.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative group overflow-hidden">
               <div className={`absolute top-0 right-0 w-2 h-full ${reward.is_active ? 'bg-purple-500' : 'bg-slate-200'}`}></div>
               <div className="flex justify-between items-start mb-6">
                  <div className="px-3 py-1 rounded-lg bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest">{reward.category}</div>
                  <div className="flex gap-2">
                     <button onClick={() => handleEditReward(reward)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white shadow-sm transition-all"><Edit size={14} /></button>
                     <button onClick={() => handleDeleteReward(reward.id)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-600 hover:text-white shadow-sm transition-all"><Trash2 size={14} /></button>
                  </div>
               </div>
               <h3 className="text-lg font-black text-slate-900 mb-2 truncate">{reward.name}</h3>
               <p className="text-xs font-medium text-slate-500 leading-relaxed h-12 overflow-hidden mb-6">{reward.description}</p>
               <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <Star className="text-yellow-500 w-4 h-4 fill-yellow-500" />
                  <span className="text-2xl font-black text-purple-600">{Number(reward.points_cost).toLocaleString()} <span className="text-[10px] text-slate-400 uppercase tracking-widest">Pts</span></span>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALS */}
      {modalType && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
           {/* Rule Modal */}
           {(modalType === 'add_rule' || modalType === 'edit_rule') && (
              <div className="bg-white rounded-[3rem] shadow-2xl max-w-lg w-full p-10 animate-in fade-in zoom-in duration-300">
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900">{modalType === 'add_rule' ? 'Create Rule' : 'Edit Rule'}</h2>
                    <button onClick={() => setModalType(null)} className="p-2 hover:bg-slate-50 rounded-full"><X size={24} /></button>
                 </div>
                 <form onSubmit={handleSaveRule} className="space-y-5">
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Action Name</label>
                       <input required type="text" value={formRule.action_name} onChange={(e) => setFormRule({...formRule, action_name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm" placeholder="e.g. Early Payment" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Points</label>
                          <input required type="number" value={formRule.points} onChange={(e) => setFormRule({...formRule, points: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm" />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Status</label>
                          <select value={formRule.is_active ? '1' : '0'} onChange={(e) => setFormRule({...formRule, is_active: e.target.value === '1'})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm">
                             <option value="1">ACTIVE</option>
                             <option value="0">DISABLED</option>
                          </select>
                       </div>
                    </div>
                    <button type="submit" disabled={saving} className="w-full bg-slate-900 text-white py-5 rounded-[2.5rem] font-black text-lg hover:bg-blue-600 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 mt-4">
                       <Save size={20} /> {saving ? 'SAVING...' : 'SAVE RULE'}
                    </button>
                 </form>
              </div>
           )}

           {/* Reward Modal */}
           {(modalType === 'add_reward' || modalType === 'edit_reward') && (
              <div className="bg-white rounded-[3rem] shadow-2xl max-w-lg w-full p-10 animate-in fade-in zoom-in duration-300">
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900">{modalType === 'add_reward' ? 'Create Reward' : 'Edit Reward'}</h2>
                    <button onClick={() => setModalType(null)} className="p-2 hover:bg-slate-50 rounded-full"><X size={24} /></button>
                 </div>
                 <form onSubmit={handleSaveReward} className="space-y-5">
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Reward Name</label>
                       <input required type="text" value={formReward.name} onChange={(e) => setFormReward({...formReward, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm" placeholder="e.g. Monthly Discount" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Point Cost</label>
                          <input required type="number" value={formReward.points_cost} onChange={(e) => setFormReward({...formReward, points_cost: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm" />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Category</label>
                          <input required type="text" value={formReward.category} onChange={(e) => setFormReward({...formReward, category: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm" placeholder="VOUCHER / GIFT" />
                       </div>
                    </div>
                    <button type="submit" disabled={saving} className="w-full bg-slate-900 text-white py-5 rounded-[2.5rem] font-black text-lg hover:bg-purple-600 transition-all shadow-xl shadow-purple-100 flex items-center justify-center gap-2 mt-4">
                       <Save size={20} /> {saving ? 'SAVING...' : 'SAVE REWARD'}
                    </button>
                 </form>
              </div>
           )}

           {/* Adjust Points Modal */}
           {modalType === 'adjust_points' && (
              <div className="bg-white rounded-[3rem] shadow-2xl max-w-lg w-full p-10 animate-in fade-in zoom-in duration-300">
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900">Adjust Points</h2>
                    <button onClick={() => setModalType(null)} className="p-2 hover:bg-slate-50 rounded-full"><X size={24} /></button>
                 </div>
                 <form onSubmit={handleAdjustPoints} className="space-y-5">
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Select Customer</label>
                       <select required value={formAdjust.customerId} onChange={(e) => setFormAdjust({...formAdjust, customerId: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm appearance-none">
                          <option value="">-- SELECT --</option>
                          {customerData.map(c => <option key={c.id} value={c.id}>{c.name} ({Number(c.points).toLocaleString()} Pts)</option>)}
                       </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Amount (+/-)</label>
                          <input required type="number" value={formAdjust.points} onChange={(e) => setFormAdjust({...formAdjust, points: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm" />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Reason</label>
                          <input required type="text" value={formAdjust.reason} onChange={(e) => setFormAdjust({...formAdjust, reason: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm" />
                       </div>
                    </div>
                    <button type="submit" disabled={saving} className="w-full bg-slate-900 text-white py-5 rounded-[2.5rem] font-black text-lg hover:bg-pink-600 transition-all shadow-xl shadow-pink-100 flex items-center justify-center gap-2 mt-4">
                       <TrendingUp size={20} /> ADJUST POINTS
                    </button>
                 </form>
              </div>
           )}

           {/* Message Modal */}
           {modalType === 'message' && selectedItem && (
             <div className="bg-white rounded-[3rem] shadow-2xl max-w-md w-full p-10 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-2xl font-black text-slate-900">Send Message</h2>
                   <button onClick={() => setModalType(null)} className="p-2 hover:bg-slate-50 rounded-full"><X size={24} /></button>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl mb-6 flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black">{selectedItem.name.charAt(0)}</div>
                   <div><p className="text-sm font-black text-slate-900">{selectedItem.name}</p><p className="text-[10px] font-bold text-slate-400">{selectedItem.tier}</p></div>
                </div>
                <form onSubmit={handleSendMessage} className="space-y-6">
                   <textarea required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm resize-none" placeholder="Type your message..." />
                   <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-[2.5rem] font-black text-lg hover:bg-purple-600 transition-all shadow-xl shadow-purple-200 flex items-center justify-center gap-2"><Send size={20} /> SEND MESSAGE</button>
                </form>
             </div>
           )}
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, change, trend, icon: Icon, gradient }: any) {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg text-white`}>
          <Icon className="w-7 h-7" />
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {change}
        </div>
      </div>
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</h3>
      <p className="text-3xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const tierConfig: any = {
    Gold: { bg: 'bg-yellow-50', text: 'text-yellow-600', icon: Star },
    Silver: { bg: 'bg-slate-50', text: 'text-slate-400', icon: Star },
    Bronze: { bg: 'bg-amber-50', text: 'text-amber-700', icon: Target },
    Platinum: { bg: 'bg-purple-50', text: 'text-purple-600', icon: Crown },
  };
  const config = tierConfig[tier] || tierConfig.Bronze;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase ${config.bg} ${config.text}`}>
      <Icon className="w-3 h-3 mr-2" />
      {tier || 'BRONZE'}
    </span>
  );
}

function QuickActionCard({ title, description, icon: Icon, color, onClick }: any) {
  return (
    <button onClick={onClick} className="w-full text-left p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
       <div className={`absolute top-0 right-0 w-2 h-full ${color}`}></div>
       <div className={`w-12 h-12 rounded-2xl ${color} text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
       </div>
       <h3 className="text-lg font-black text-slate-900 mb-2">{title}</h3>
       <p className="text-xs font-medium text-slate-500 leading-relaxed mb-4">{description}</p>
       <div className="flex items-center text-[10px] font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-widest transition-colors">
          Action Now <ChevronRight size={14} className="ml-1" />
       </div>
    </button>
  );
}
