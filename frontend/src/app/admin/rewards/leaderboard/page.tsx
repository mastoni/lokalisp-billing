'use client';

import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
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
  BarChart3,
  RefreshCw,
  LayoutGrid,
  List,
  Eye,
  Send,
  MessageCircle,
  ChevronRight,
  X,
  Phone,
  MapPin,
  Package
} from 'lucide-react';
import api from '@/lib/api';

type LeaderboardItem = {
  rank: number;
  id: string;
  name: string;
  email: string;
  points: number;
  tier: string;
  total_spent?: number;
  months_active?: number;
  redemption_count?: number;
  phone?: string;
  address?: string;
};

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // New Modal States
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<LeaderboardItem | null>(null);
  const [message, setMessage] = useState('');

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/rewards/leaderboard');
      if (response.data.success) {
        setData(response.data.data.items || []);
      }
    } catch (error: any) {
      toast.error('Gagal mengambil data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.email || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTier = tierFilter ? item.tier === tierFilter : true;
      return matchesSearch && matchesTier;
    });
  }, [data, searchTerm, tierFilter]);

  const handleViewProfile = (user: LeaderboardItem) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const handleOpenChat = (user: LeaderboardItem) => {
    setSelectedUser(user);
    setShowMessageModal(true);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    toast.loading('Mengirim pesan...', { id: 'send-msg' });
    setTimeout(() => {
       toast.success(`Pesan terkirim ke ${selectedUser?.name}`, { id: 'send-msg' });
       setMessage('');
       setShowMessageModal(false);
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 shadow-lg text-white font-black">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Leaderboard</h1>
              <p className="text-slate-500 font-medium tracking-tight">Pelanggan terbaik berdasarkan point dan loyalitas</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchLeaderboard}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 shadow-sm hover:bg-slate-50 transition-all font-bold"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl overflow-hidden p-1 shadow-sm">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-all rounded-xl ${
                viewMode === 'list' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-all rounded-xl ${
                viewMode === 'grid' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <LayoutGrid size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Tier Filters UI */}
      <div className="flex items-center p-1 bg-slate-100 rounded-2xl w-fit">
         <button onClick={() => setTierFilter(null)} className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase ${!tierFilter ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>SEMUA</button>
         {['Platinum', 'Gold', 'Silver', 'Bronze'].map(t => (
           <button key={t} onClick={() => setTierFilter(t)} className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase ${tierFilter === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
             {t}
           </button>
         ))}
      </div>

      {/* Podium Section */}
      {!loading && !tierFilter && searchTerm === '' && data.length >= 3 && viewMode === 'list' && (
        <div className="bg-slate-50 rounded-[3rem] p-12 border border-slate-100 relative overflow-hidden shadow-inner">
           <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
           <div className="flex flex-col md:flex-row items-end justify-center gap-8 md:gap-4 lg:gap-12 relative z-10">
              {/* 2nd Place */}
              <div className="order-2 md:order-1 flex-1 max-w-[280px]">
                 <PodiumCard 
                   rank={2} name={data[1].name} points={data[1].points} tier={data[1].tier}
                   color="border-slate-300" icon={<Medal className="w-10 h-10 text-slate-400" />}
                   onClick={() => handleViewProfile(data[1])}
                 />
              </div>
              {/* 1st Place */}
              <div className="order-1 md:order-2 flex-1 max-w-[320px] transform md:-translate-y-8">
                 <PodiumCard 
                   rank={1} name={data[0].name} points={data[0].points} tier={data[0].tier}
                   color="border-yellow-400 scale-110 shadow-2xl shadow-yellow-200" icon={<Crown className="w-12 h-12 text-yellow-500" />}
                   onClick={() => handleViewProfile(data[0])}
                 />
              </div>
              {/* 3rd Place */}
              <div className="order-3 flex-1 max-w-[280px]">
                 <PodiumCard 
                   rank={3} name={data[2].name} points={data[2].points} tier={data[2].tier}
                   color="border-amber-500" icon={<Award className="w-10 h-10 text-amber-600" />}
                   onClick={() => handleViewProfile(data[2])}
                 />
              </div>
           </div>
        </div>
      )}

      {/* List / Grid Toggle */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
          <div className="p-8 pb-4">
             <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <h2 className="text-2xl font-black text-slate-900">Database Leaderboard</h2>
                <div className="flex items-center px-4 py-3 bg-slate-50 rounded-2xl border border-transparent focus-within:border-slate-200 transition-all shadow-sm">
                    <Search className="w-5 h-5 text-slate-400 mr-3" />
                    <input type="text" placeholder="Cari pelanggan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none text-sm font-bold w-full md:w-64" />
                </div>
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
               <thead>
                 <tr className="bg-slate-50/50">
                    <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rank</th>
                    <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pelanggan</th>
                    <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Point</th>
                    <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tier</th>
                    <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aktivitas</th>
                    <th className="text-right py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aksi</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {loading ? (
                     [...Array(5)].map((_, i) => <tr key={i}><td colSpan={6} className="py-8 px-8"><div className="h-4 bg-slate-100 rounded-full animate-pulse w-3/4"></div></td></tr>)
                  ) : filteredData.length === 0 ? (
                    <tr><td colSpan={6} className="py-24 text-center font-bold text-slate-300 uppercase tracking-widest text-xs">Data tidak ditemukan</td></tr>
                  ) : (
                    filteredData.map((item, idx) => (
                      <tr key={item.id} className="group hover:bg-slate-50 transition-all">
                         <td className="py-5 px-8"><RankIcon rank={item.rank || idx + 1} /></td>
                         <td className="py-5 px-8">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 font-black text-xs uppercase group-hover:bg-purple-600 group-hover:text-white transition-all">{item.name.substring(0, 2)}</div>
                               <div><p className="text-sm font-black text-slate-900 group-hover:text-purple-700 transition-colors leading-tight">{item.name}</p><p className="text-[10px] font-medium text-slate-400">{item.email}</p></div>
                            </div>
                         </td>
                         <td className="py-5 px-8 font-black text-purple-600 text-base">{Number(item.points).toLocaleString()}</td>
                         <td className="py-5 px-8"><TierBadge tier={item.tier} /></td>
                         <td className="py-5 px-8 text-xs font-bold text-slate-500 uppercase tracking-tight">{item.months_active || 0} bln aktif</td>
                         <td className="py-5 px-8 text-right">
                            <div className="flex items-center justify-end space-x-2 opacity-30 group-hover:opacity-100 transition-all">
                               <button onClick={() => handleViewProfile(item)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"><Eye size={16} /></button>
                               <button onClick={() => handleOpenChat(item)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><MessageCircle size={16} /></button>
                            </div>
                         </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            [...Array(8)].map((_, i) => <div key={i} className="h-64 bg-slate-100 rounded-[2.5rem] animate-pulse"></div>)
          ) : filteredData.map((item, idx) => (
            <div key={item.id} className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center">
               <div className="flex justify-between items-center w-full mb-6">
                  <RankIcon rank={item.rank || idx + 1} />
                  <TierBadge tier={item.tier} />
               </div>
               <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-400 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 shadow-inner">
                  <User size={40} />
               </div>
               <h3 className="text-lg font-black text-slate-900 mb-1 line-clamp-1">{item.name}</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{item.tier}</p>
               <div className="bg-purple-50 px-6 py-2 rounded-2xl flex items-center mb-8 border border-purple-100">
                  <Star className="w-4 h-4 text-purple-600 mr-2 fill-purple-600" />
                  <span className="text-xl font-black text-purple-600">{Number(item.points).toLocaleString()}</span>
               </div>
               <div className="grid grid-cols-2 gap-3 w-full">
                  <button onClick={() => handleViewProfile(item)} className="py-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all font-black text-[10px] tracking-widest uppercase flex items-center justify-center gap-2">
                     <Eye size={14} /> PROFILE
                  </button>
                  <button onClick={() => handleOpenChat(item)} className="py-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all font-black text-[10px] tracking-widest uppercase flex items-center justify-center gap-2">
                     <MessageCircle size={14} /> CHAT
                  </button>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-[3rem] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="relative h-24 bg-gradient-to-r from-purple-600 to-indigo-700 p-6 flex justify-end">
                 <button onClick={() => setShowProfileModal(false)} className="p-2 bg-white/20 text-white rounded-full"><X size={20} /></button>
              </div>
              <div className="px-10 pb-10">
                 <div className="relative -mt-12 mb-6">
                    <div className="w-24 h-24 rounded-[2rem] bg-white p-1 shadow-xl">
                       <div className="w-full h-full rounded-[1.8rem] bg-slate-50 flex items-center justify-center text-3xl font-black text-slate-900">{selectedUser.name.charAt(0)}</div>
                    </div>
                 </div>
                 <h2 className="text-3xl font-black text-slate-900 mb-1 tracking-tight">{selectedUser.name}</h2>
                 <div className="flex items-center gap-2 mb-10">
                    <TierBadge tier={selectedUser.tier} />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{selectedUser.id}</span>
                 </div>

                 <div className="grid grid-cols-1 gap-6 mb-10">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400"><Mail size={20} /></div>
                       <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EMAIL ADDRESS</p><p className="text-sm font-bold text-slate-700">{selectedUser.email}</p></div>
                    </div>
                    {selectedUser.phone && (
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400"><Phone size={20} /></div>
                         <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PHONE NUMBER</p><p className="text-sm font-bold text-slate-700">{selectedUser.phone}</p></div>
                      </div>
                    )}
                 </div>

                 <div className="grid grid-cols-3 gap-4">
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">PTS</p>
                       <p className="text-lg font-black text-purple-600">{Number(selectedUser.points).toLocaleString()}</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">REDEEM</p>
                       <p className="text-lg font-black text-blue-600">{selectedUser.redemption_count || 0}</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">MONTHS</p>
                       <p className="text-lg font-black text-emerald-600">{selectedUser.months_active || 1}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
           <div className="bg-white rounded-[3rem] shadow-2xl max-w-md w-full p-10 animate-in fade-in zoom-in duration-300">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-black text-slate-900 tracking-tight">Kirim Pesan</h2>
                 <button onClick={() => setShowMessageModal(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><X size={24} /></button>
              </div>
              <div className="flex items-center gap-3 mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-xs">{selectedUser.name.charAt(0)}</div>
                 <div><p className="text-sm font-black text-slate-900">{selectedUser.name}</p><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedUser.tier}</p></div>
              </div>
              <form onSubmit={handleSendMessage} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Isi Pesan</label>
                    <textarea 
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm resize-none focus:ring-2 focus:ring-purple-500 transition-all shadow-inner"
                      placeholder="Masukkan pesan ke pelanggan..."
                    />
                 </div>
                 <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-[2.5rem] font-black text-lg hover:bg-purple-600 transition-all shadow-xl shadow-purple-100 flex items-center justify-center gap-2">
                    <Send size={20} /> KIRIM SEKARANG
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

function PodiumCard({ rank, name, points, tier, color, icon, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full bg-white rounded-[2.5rem] p-8 border-2 ${color} text-center flex flex-col items-center transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-2 group`}>
       <div className="mb-6 group-hover:scale-110 transition-transform duration-500">{icon}</div>
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Rank #{rank}</p>
       <h3 className="text-xl font-black text-slate-900 leading-tight mb-4 group-hover:text-purple-600 transition-colors">{name}</h3>
       <div className="bg-purple-50 px-6 py-2 rounded-2xl flex items-center mb-4 border border-purple-100/50">
          <Star className="w-4 h-4 text-purple-600 mr-2 fill-purple-600" />
          <span className="text-xl font-black text-purple-600">{points.toLocaleString()}</span>
       </div>
       <TierBadge tier={tier} />
    </button>
  );
}

function RankIcon({ rank }: { rank: number }) {
  const styles: any = {
    1: 'bg-yellow-500 text-white shadow-yellow-200 ring-2 ring-yellow-400/20',
    2: 'bg-slate-400 text-white shadow-slate-100 ring-2 ring-slate-300/20',
    3: 'bg-amber-600 text-white shadow-amber-100 ring-2 ring-amber-500/20',
  };
  return (
    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow-xl ${styles[rank] || 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
       #{rank}
    </div>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const tiers: any = {
    Platinum: { bg: 'bg-purple-50', text: 'text-purple-600', icon: Crown },
    Gold: { bg: 'bg-yellow-50', text: 'text-yellow-600', icon: Star },
    Silver: { bg: 'bg-slate-50', text: 'text-slate-400', icon: Medal },
    Bronze: { bg: 'bg-amber-50', text: 'text-amber-700', icon: Target },
  };
  const config = tiers[tier] || tiers.Bronze;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase ${config.bg} ${config.text}`}>
      <Icon className="w-3 h-3 mr-2" />
      {tier}
    </span>
  );
}
