'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Wallet, 
  TrendingUp, 
  UserCheck, 
  ChevronRight, 
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Activity,
  Filter,
  MoreVertical,
  Clock,
  RefreshCw,
  LogOut,
  CreditCard,
  History
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

type SubCustomer = {
  id: string;
  name: string;
  phone: string;
  status: 'active' | 'expired' | 'pending' | 'isolated';
  package_name: string;
  package_price: number;
  created_at: string;
};

type Commission = {
  id: string;
  amount: number;
  status: 'pending' | 'earned' | 'withdrawn';
  customer_name: string;
  payment_number: string;
  created_at: string;
};

export default function AgentDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalCustomers: 0, activeCustomers: 0, totalCommission: 0, pendingCommission: 0 });
  const [customers, setCustomers] = useState<SubCustomer[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/agent/dashboard');
      if (res.data.success) {
        setStats(res.data.data.stats);
        setCustomers(res.data.data.customers);
      }
      
      const commRes = await api.get('/agent/commissions');
      if (commRes.data.success) {
        setCommissions(commRes.data.data);
      }
    } catch (e: any) {
      toast.error('Gagal mengambil data keagenan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || parseInt(withdrawAmount) <= 0) return;

    try {
      toast.loading('Memproses penarikan...', { id: 'withdraw' });
      const res = await api.post('/agent/withdraw', {
        amount: parseInt(withdrawAmount),
        bank_name: 'BCA', // Placeholder
        account_number: '1234567890', // Placeholder
        account_name: 'Agen Sembok' // Placeholder
      });
      if (res.data.success) {
        toast.success('Permintaan penarikan dikirim!', { id: 'withdraw' });
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        fetchData();
      }
    } catch (e) {
      toast.error('Gagal memproses penarikan', { id: 'withdraw' });
    }
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans selection:bg-purple-100">
      {/* Header Area */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 pt-16 pb-32 px-6 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-[120px]"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500 rounded-full blur-[150px]"></div>
         </div>
         
         <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div>
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center shadow-2xl"><Users size={24} /></div>
                  <h1 className="text-3xl font-black text-white tracking-tight italic uppercase">Agent <span className="text-purple-400">Portal</span></h1>
               </div>
               <p className="text-slate-300 font-medium">Monitoring performa penjualan dan komisi Anda.</p>
            </div>
            <div className="flex items-center gap-3">
               <button 
                onClick={() => setShowWithdrawModal(true)}
                className="px-8 py-4 bg-white text-indigo-900 rounded-[2rem] font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-white/10 hover:scale-105 active:scale-95 transition-all"
               >
                 TARIK KOMISI
               </button>
               <button onClick={fetchData} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all">
                  <RefreshCw className={loading ? 'animate-spin' : ''} size={20} />
               </button>
            </div>
         </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-16">
         {/* Stats Grid */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard icon={UserCheck} label="Partner Total" value={stats.totalCustomers} subText="Pelanggan" color="bg-indigo-500" />
            <StatCard icon={Activity} label="Aktif" value={stats.activeCustomers} subText="Connected" color="bg-emerald-500" />
            <StatCard icon={Wallet} label="Komersial" value={formatIDR(stats.totalCommission)} subText="Pendapatan" color="bg-purple-500" />
            <StatCard icon={Clock} label="Pending" value={formatIDR(stats.pendingCommission)} subText="Akan Datang" color="bg-amber-500" />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Recent Customers */}
            <div className="lg:col-span-2 space-y-8">
               <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
                  <div className="p-10 flex items-center justify-between border-b border-slate-50">
                     <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Pelanggan Anda</h2>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Daftar klien dalam jaringan anda</p>
                     </div>
                     <button className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all"><Search size={20} /></button>
                  </div>
                  
                  <div className="p-4 md:p-10 space-y-4">
                     {loading ? (
                       [...Array(3)].map((_, i) => <div key={i} className="h-24 bg-slate-50 rounded-3xl animate-pulse"></div>)
                     ) : customers.length === 0 ? (
                       <p className="text-center py-10 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Belum ada pelanggan terdaftar</p>
                     ) : (
                        customers.map((c) => (
                           <div key={c.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] hover:bg-white hover:shadow-xl hover:border-indigo-100 border border-transparent transition-all group">
                              <div className="flex items-center gap-6">
                                 <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-white shadow-inner flex items-center justify-center text-indigo-600 font-black text-lg">
                                    {c.name.charAt(0)}
                                 </div>
                                 <div>
                                    <h4 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase italic">{c.name}</h4>
                                    <div className="flex items-center gap-3 mt-1">
                                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{c.package_name}</span>
                                       <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                       <span className={`text-[10px] font-black uppercase ${c.status === 'active' ? 'text-emerald-500' : 'text-rose-500'}`}>{c.status}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="text-right hidden sm:block">
                                 <p className="text-sm font-black text-slate-900">{formatIDR(c.package_price)}</p>
                                 <p className="text-[10px] font-black text-slate-400 uppercase">{new Date(c.created_at).toLocaleDateString()}</p>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
               </div>
            </div>

            {/* Right Column: Commissions */}
            <div className="space-y-8">
               <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-20 blur-3xl -mr-10 -mt-10"></div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 opacity-60">Komisi Tersedia</h3>
                  <div className="flex items-end gap-2 mb-8">
                     <span className="text-4xl font-black tracking-tighter italic">{formatIDR(stats.totalCommission).replace('Rp', '')}</span>
                     <span className="text-sm font-bold opacity-60 pb-1.5 ml-1">IDR</span>
                  </div>
                  <button 
                    onClick={() => setShowWithdrawModal(true)}
                    className="w-full py-5 bg-indigo-500 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-white hover:text-indigo-900 transition-all shadow-xl shadow-indigo-900/50"
                  >
                    CAIRKAN SEKARANG
                  </button>
               </div>

               <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
                  <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                     <h3 className="text-lg font-black text-slate-900 tracking-tight italic uppercase">History <span className="text-indigo-600">Earnings</span></h3>
                     <History size={18} className="text-slate-300" />
                  </div>
                  <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                     {loading ? (
                       [...Array(4)].map((_, i) => <div key={i} className="h-16 bg-slate-50 rounded-2xl animate-pulse"></div>)
                     ) : commissions.length === 0 ? (
                        <p className="text-center py-6 text-slate-400 text-[10px] font-black uppercase tracking-widest">Belum ada riwayat komisi</p>
                     ) : (
                        commissions.map((comm) => (
                           <div key={comm.id} className="p-4 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-between group border border-transparent hover:border-slate-100">
                              <div className="flex items-center gap-4">
                                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${comm.status === 'earned' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                    {comm.status === 'earned' ? <ArrowUpRight size={18} /> : <Clock size={18} />}
                                 </div>
                                 <div className="min-w-0">
                                    <h5 className="font-black text-slate-900 text-xs truncate uppercase italic">{comm.customer_name}</h5>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{comm.payment_number}</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-xs font-black text-slate-900">+{formatIDR(comm.amount)}</p>
                                 <p className="text-[9px] font-bold text-slate-300 uppercase">{new Date(comm.created_at).toLocaleDateString()}</p>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
           <div className="bg-white rounded-[3rem] shadow-2xl max-w-sm w-full p-10 animate-in fade-in zoom-in duration-300">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">Tarik <span className="text-indigo-600">Komisi</span></h2>
                 <button onClick={() => setShowWithdrawModal(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><DollarSign size={24} /></button>
              </div>

              <div className="space-y-8">
                 <div className="text-center">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Maksimal Penarikan</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">{formatIDR(stats.totalCommission)}</p>
                 </div>

                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Jumlah Penarikan (IDR)</label>
                    <input 
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full px-6 py-5 bg-slate-50 border-none rounded-[2rem] font-black text-lg focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner text-center"
                      placeholder="0"
                    />
                 </div>

                 <div className="p-6 rounded-3xl bg-indigo-50 border border-indigo-100">
                    <p className="text-[10px] font-bold text-indigo-900 leading-relaxed text-center italic">
                       Dana akan ditransfer ke rekening terdaftar dalam 1x24 jam setelah verifikasi admin.
                    </p>
                 </div>

                 <div className="grid grid-cols-2 gap-4 pt-2">
                    <button className="py-5 bg-slate-50 text-slate-400 rounded-[2.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-100" onClick={() => setShowWithdrawModal(false)}>BATAL</button>
                    <button 
                      className={`py-5 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-widest shadow-xl transition-all ${!withdrawAmount ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-indigo-600 shadow-indigo-100 hover:bg-slate-900'}`} 
                      disabled={!withdrawAmount}
                      onClick={handleWithdraw}
                    >
                      KONFIRMASI
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, subText, color }: any) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col items-center">
       <div className={`w-12 h-12 rounded-2xl ${color} text-white flex items-center justify-center mb-4 shadow-lg shadow-current/20`}><Icon size={22} /></div>
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center leading-tight h-8 flex items-center">{label}</p>
       <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter truncate w-full text-center">{value}</p>
       <p className="text-[9px] font-bold text-slate-300 uppercase tracking-wider mt-1">{subText}</p>
    </div>
  );
}
