'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Gift, RefreshCcw, Star } from 'lucide-react';
import api from '@/lib/api';
import RoleHero from '@/components/ui/RoleHero';
import SectionCard from '@/components/ui/SectionCard';

type RewardSummary = {
  customer_id: string;
  points_balance: number;
  total_points_earned: number;
  total_points_redeemed: number;
  redemption_count: number;
  tier: string;
  status: string;
  last_activity: string | null;
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
  const [tx, setTx] = useState<RewardTx[]>([]);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const [s, c, t] = await Promise.all([
        api.get('/portal/me/rewards'),
        api.get('/portal/me/rewards/catalog'),
        api.get('/portal/me/rewards/transactions', { params: { limit: 10 } }),
      ]);
      if (s.data.success) setSummary(s.data.data);
      if (c.data.success) setCatalog(c.data.data || []);
      if (t.data.success) setTx(t.data.data || []);
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
        toast.success('Request redeem dibuat. Tunggu approval admin.');
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

  return (
    <>
      <RoleHero
        title="Reward Points"
        description="Kumpulkan poin, tukarkan reward, dan pantau aktivitas kamu."
        accent="primary"
      />

      <div className="flex justify-end mb-6">
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition text-sm disabled:opacity-50"
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <SectionCard title="Ringkasan" className="mb-6">
        {loading ? (
          <div className="text-sm text-gray-600">Loading...</div>
        ) : !summary ? (
          <div className="text-sm text-gray-600">Data reward tidak tersedia.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Points Balance</div>
              <div className="text-2xl font-bold text-gray-900">{Number(summary.points_balance).toLocaleString()}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Tier</div>
              <div className="text-2xl font-bold text-gray-900">{summary.tier}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Total Redeem</div>
              <div className="text-2xl font-bold text-gray-900">{Number(summary.total_points_redeemed).toLocaleString()}</div>
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Katalog Reward" className="mb-6">
        {catalog.length === 0 ? (
          <div className="text-sm text-gray-600">Belum ada reward aktif.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {catalog.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-2xl p-4 bg-white">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-bold text-gray-900">{item.name}</div>
                  <span className="text-xs px-2 py-1 rounded-lg bg-primary-50 text-primary-700 border border-primary-100">
                    {item.category}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-3">{item.description}</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-900">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    <span className="font-bold">{Number(item.points_cost).toLocaleString()}</span>
                    <span className="text-xs text-gray-500 ml-1">points</span>
                  </div>
                  <button
                    onClick={() => redeem(item)}
                    disabled={!canRedeem(item) || redeemingId === item.id}
                    className="px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700 disabled:opacity-50"
                  >
                    {redeemingId === item.id ? '...' : 'Redeem'}
                  </button>
                </div>
                {!canRedeem(item) && (
                  <div className="text-xs text-gray-500 mt-2">Poin belum cukup.</div>
                )}
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Aktivitas Terakhir">
        {tx.length === 0 ? (
          <div className="text-sm text-gray-600">Belum ada transaksi.</div>
        ) : (
          <div className="space-y-3">
            {tx.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">{t.description}</div>
                  <div className="text-xs text-gray-500">{new Date(t.created_at).toLocaleString('id-ID')}</div>
                </div>
                <div className="flex items-center ml-4">
                  <Gift className="h-4 w-4 mr-2 text-gray-700" />
                  <span className="text-sm font-bold text-gray-900">{Number(t.points).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </>
  );
}

