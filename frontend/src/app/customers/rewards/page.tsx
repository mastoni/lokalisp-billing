'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { 
  Gift, 
  RefreshCcw, 
  Star, 
  Send, 
  History, 
  TrendingUp, 
  Wallet,
  Crown,
  ChevronRight,
  X,
  ArrowRight,
  UserPlus,
  Copy,
  Check
} from 'lucide-react';
import api from '@/lib/api';
import RoleHero from '@/components/ui/RoleHero';

type RewardSummary = {
  customer_id: string;
  points_balance: number;
  total_points_earned: number;
  total_points_redeemed: number;
  redemption_count: number;
  tier: string;
  status: string;
  last_activity: string | null;
  referral_code: string;
};

type RewardCatalogItem = {
  id: string;
  name: string;
  description: string;
  points_cost: number;
  category: string;
};

type RewardTx = {
  id: string;
  transaction_type: string;
  points: number;
  description: string;
  created_at: string;
};

export default function CustomerRewardsPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<RewardSummary | null>(null);
  const [catalog, setCatalog] = useState<RewardCatalogItem[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [tx, setTx] = useState<RewardTx[]>([]);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showReferModal, setShowReferModal] = useState(false);
  const [transferData, setTransferData] = useState({ target: '', amount: '', note: '' });
  const [referData, setReferData] = useState({ name: '', phone: '', email: '', address: '', package_id: '' });
  const [submittingTransfer, setSubmittingTransfer] = useState(false);
  const [submittingRefer, setSubmittingRefer] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const [s, c, t, p] = await Promise.all([
        api.get('/portal/me/rewards'),
        api.get('/portal/me/rewards/catalog'),
        api.get('/portal/me/rewards/transactions', { params: { limit: 10 } }),
        api.get('/packages')
      ]);
      if (s.data.success) setSummary(s.data.data);
      if (c.data.success) setCatalog(c.data.data || []);
      if (t.data.success) setTx(t.data.data || []);
      if (p.data.success) setPackages(p.data.data || []);
    } catch (e: any) {
      toast.error(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const canRedeem = useMemo(() => {
    const balance = summary?.points_balance ?? 0;
    return (item: RewardCatalogItem) => balance >= item.points_cost;
  }, [summary?.points_balance]);

  const redeem = async (item: RewardCatalogItem) => {
    try {
      setRedeemingId(item.id);
      const res = await api.post('/portal/me/rewards/redeem', { reward_id: item.id });
      if (res.data.success) {
        toast.success('Pesan diterima! Admin akan segera memproses penukaran Anda.');
        await load();
      } else {
        toast.error(res.data.message || 'Gagal redeem');
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || e.message);
    } finally {
      setRedeemingId(null);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferData.target || !transferData.amount) return;
    
    try {
      setSubmittingTransfer(true);
      const res = await api.post('/portal/me/rewards/transfer', {
        target: transferData.target,
        amount: parseInt(transferData.amount),
        note: transferData.note
      });
      
      if (res.data.success) {
        toast.success(res.data.message || `Berhasil mengirim poin!`);
        setShowTransferModal(false);
        setTransferData({ target: '', amount: '', note: '' });
        await load();
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Gagal transfer poin');
    } finally {
      setSubmittingTransfer(false);
    }
  };

  const handleRefer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmittingRefer(true);
      const res = await api.post('/portal/me/rewards/refer', referData);
      if (res.data.success) {
        toast.success(res.data.message || 'Pendaftaran berhasil!');
        setShowReferModal(false);
        setReferData({ name: '', phone: '', email: '', address: '', package_id: '' });
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Gagal mendaftarkan teman');
    } finally {
      setSubmittingRefer(false);
    }
  };

  const copyToClipboard = () => {
    if (summary?.referral_code) {
      navigator.clipboard.writeText(summary.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Referral code copied!');
    }
  };

  return (
    <div className="pb-20">
      <RoleHero
        title="Reward & Loyalty"
        description="Nikmati benefit eksklusif dan kumpulkan poin setiap transaksi."
        accent="primary"
      />

      <div className="px-4 -mt-10 mb-8 overflow-x-auto h-auto scrollbar-hide flex gap-4 pb-2">
        <div className="min-w-[280px] bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl shadow-purple-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 opacity-80 mb-1">
              <Wallet size={16} />
              <span className="text-xs font-medium uppercase tracking-wider">Saldo Poin</span>
            </div>
            <h3 className="text-4xl font-black">{summary?.points_balance?.toLocaleString() || 0}</h3>
          </div>
          <div className="mt-6 flex gap-3">
             <button 
              onClick={() => setShowTransferModal(true)}
              className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center transition-all"
            >
              <Send size={16} className="mr-2 rotate-[-20deg]" /> Transfer
            </button>
            <button 
              onClick={load}
              className="w-12 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 rounded-xl flex items-center justify-center transition-all"
            >
              <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        <div className="min-w-[200px] bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Crown size={16} className="text-amber-500" />
            <span className="text-xs font-bold uppercase">Membership Tier</span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800">{summary?.tier || 'BRONZE'}</h3>
            <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
               <div className="bg-amber-500 h-full w-[40%]"></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Upgrade ke Silver untuk benefit lebih!</p>
          </div>
        </div>
      </div>

      {/* Referral Code Box */}
      <div className="px-4 mb-8">
        <div className="bg-purple-50 rounded-3xl p-6 border border-purple-100 flex items-center justify-between">
          <div>
            <div className="text-xs font-black text-purple-600 uppercase tracking-widest mb-1">Kode Referral Anda</div>
            <div className="text-2xl font-black text-slate-900 tracking-widest">{summary?.referral_code || '......'}</div>
          </div>
          <button 
            onClick={copyToClipboard}
            className="p-4 bg-white rounded-2xl text-purple-600 shadow-sm hover:shadow-md transition-all active:scale-90"
          >
            {copied ? <Check size={24} /> : <Copy size={24} />}
          </button>
        </div>
      </div>

      {/* Promo Banners */}
      <div className="px-4 mb-8">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center">
          <TrendingUp size={16} className="mr-2 text-primary-600" />
          Promo Special
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          <div 
            onClick={() => setShowReferModal(true)}
            className="min-w-[300px] h-40 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl p-6 text-white relative flex items-center overflow-hidden cursor-pointer active:scale-95 transition-all"
          >
            <div className="relative z-10 w-2/3">
              <h4 className="font-black text-xl leading-tight">Ajak Teman, Untung Bareng!</h4>
              <p className="text-xs opacity-90 mt-2">Dapatkan bonus poin untuk setiap teman yang mendaftar melalui Anda.</p>
              <div className="mt-4 flex items-center text-xs font-bold bg-white/20 w-fit px-3 py-1.5 rounded-lg border border-white/20">
                Daftarkan Sekarang <ArrowRight size={12} className="ml-1" />
              </div>
            </div>
            <UserPlus className="absolute -right-4 -bottom-4 opacity-20 rotate-12" size={140} />
          </div>
          
          <div className="min-w-[300px] h-40 bg-gradient-to-r from-orange-400 to-rose-400 rounded-3xl p-6 text-white relative flex items-center overflow-hidden">
            <div className="relative z-10 w-2/3">
              <h4 className="font-black text-xl leading-tight">Double Points Weekend!</h4>
              <p className="text-xs opacity-90 mt-2">Dapatkan poin 2x lipat setiap pembayaran tagihan di hari Sabtu & Minggu.</p>
            </div>
            <Gift className="absolute -right-4 -bottom-4 opacity-20 rotate-12" size={140} />
          </div>
        </div>
      </div>

      {/* Rewards Catalog */}
      <div className="px-4 mb-10">
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center">
            <Gift size={16} className="mr-2 text-primary-600" />
            Tukar Reward
          </h3>
          <button className="text-xs font-bold text-primary-600 flex items-center">
            Lihat Semua <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {catalog.length === 0 ? (
            <div className="p-10 bg-slate-50 rounded-3xl text-center border-2 border-dashed border-slate-200">
               <p className="text-sm text-slate-400">Belum ada reward yang tersedia saat ini.</p>
            </div>
          ) : (
            catalog.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary-500">
                  <Gift size={32} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-primary-600 uppercase mb-0.5">{item.category}</div>
                  <h4 className="text-sm font-bold text-slate-800 truncate">{item.name}</h4>
                  <div className="flex items-center mt-1 text-slate-500">
                    <Star size={12} className="text-amber-500 mr-1 fill-amber-500" />
                    <span className="text-xs font-bold text-slate-700">{item.points_cost.toLocaleString()} Poin</span>
                  </div>
                </div>
                <button
                  onClick={() => redeem(item)}
                  disabled={!canRedeem(item) || redeemingId === item.id}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    canRedeem(item) 
                    ? 'bg-slate-900 text-white hover:bg-slate-800' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {redeemingId === item.id ? '...' : 'TUKAR'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="px-4 mb-10">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center">
          <History size={16} className="mr-2 text-primary-600" />
          Aktivitas Terakhir
        </h3>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {tx.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">Belum ada riwayat poin.</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {tx.map((t) => (
                <div key={t.id} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800">{t.description}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{new Date(t.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <div className={`text-sm font-black ${t.transaction_type === 'earn' ? 'text-green-600' : 'text-rose-600'}`}>
                    {t.transaction_type === 'earn' ? '+' : '-'}{t.points}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-slate-800">Transfer Poin</h3>
                <button 
                  onClick={() => setShowTransferModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleTransfer} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Penerima (HP / Email)</label>
                  <input 
                    type="text"
                    required
                    value={transferData.target}
                    onChange={(e) => setTransferData({ ...transferData, target: e.target.value })}
                    placeholder="Contoh: 0812xxx atau email@domain.com"
                    className="w-full mt-1 px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-primary-500 rounded-2xl outline-none transition-all text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Jumlah Poin</label>
                  <input 
                    type="number"
                    required
                    min="1"
                    value={transferData.amount}
                    onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                    placeholder="Minimal 1 poin"
                    className="w-full mt-1 px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-primary-500 rounded-2xl outline-none transition-all text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Catatan (Optional)</label>
                  <input 
                    type="text"
                    value={transferData.note}
                    onChange={(e) => setTransferData({ ...transferData, note: e.target.value })}
                    placeholder="Untuk jajan, dll..."
                    className="w-full mt-1 px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-primary-500 rounded-2xl outline-none transition-all text-sm font-medium"
                  />
                </div>

                <div className="pt-4">
                  <button
                    disabled={submittingTransfer}
                    type="submit"
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center hover:bg-slate-800 transition-all disabled:opacity-50"
                  >
                    {submittingTransfer ? (
                      <RefreshCcw size={20} className="animate-spin mr-2" />
                    ) : (
                      <><Send size={18} className="mr-2 rotate-[-20deg]" /> KIRIM SEKARANG</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Refer Modal */}
      {showReferModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="p-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-slate-800">Daftarkan Teman</h3>
                <button 
                  onClick={() => setShowReferModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleRefer} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nama Teman</label>
                  <input 
                    type="text"
                    required
                    value={referData.name}
                    onChange={(e) => setReferData({ ...referData, name: e.target.value })}
                    placeholder="Nama lengkap"
                    className="w-full mt-1 px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-primary-500 rounded-2xl outline-none transition-all text-sm font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">No. HP</label>
                    <input 
                      type="text"
                      required
                      value={referData.phone}
                      onChange={(e) => setReferData({ ...referData, phone: e.target.value })}
                      placeholder="0812xxxx"
                      className="w-full mt-1 px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-primary-500 rounded-2xl outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
                    <input 
                      type="email"
                      value={referData.email}
                      onChange={(e) => setReferData({ ...referData, email: e.target.value })}
                      placeholder="Optional"
                      className="w-full mt-1 px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-primary-500 rounded-2xl outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Alamat Pemasangan</label>
                  <textarea 
                    value={referData.address}
                    required
                    onChange={(e) => setReferData({ ...referData, address: e.target.value })}
                    placeholder="Alamat lengkap teman Anda"
                    className="w-full mt-1 px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-primary-500 rounded-2xl outline-none transition-all text-sm font-medium h-20 resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Pilihan Paket</label>
                  <select
                    required
                    value={referData.package_id}
                    onChange={(e) => setReferData({ ...referData, package_id: e.target.value })}
                    className="w-full mt-1 px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-primary-500 rounded-2xl outline-none transition-all text-sm font-bold appearance-none bg-no-repeat bg-[right_1rem_center]"
                  >
                    <option value="">Pilih Paket Internet</option>
                    {packages.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>{pkg.package_name} - Rp {pkg.price.toLocaleString()}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 pb-2">
                  <button
                    disabled={submittingRefer}
                    type="submit"
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center hover:bg-slate-800 transition-all disabled:opacity-50"
                  >
                    {submittingRefer ? (
                      <RefreshCcw size={20} className="animate-spin mr-2" />
                    ) : (
                      <><UserPlus size={18} className="mr-2" /> DAFTARKAN SEKARANG</>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-slate-400 mt-4 leading-relaxed px-4">
                    Dengan mendaftarkan teman, Anda setuju bahwa poin akan diberikan <b>setelah pemasangan aktif</b> di lokasi teman Anda.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
