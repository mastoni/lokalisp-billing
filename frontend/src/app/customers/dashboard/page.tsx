'use client';

import { useEffect, useState } from 'react';
import {
  FileText,
  CreditCard,
  Settings,
  Package,
  Activity,
  Wifi,
  Gift,
  AlertCircle
} from 'lucide-react';
import ActionButton from '@/components/ui/ActionButton';
import StatCard from '@/components/ui/StatCard';
import RoleHero from '@/components/ui/RoleHero';
import SectionCard from '@/components/ui/SectionCard';
import api from '@/lib/api';

import { useRouter } from 'next/navigation';

export default function CustomerDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/portal/me/summary');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const activeInvoice = data?.activeInvoice;
  const customer = data?.customer;

  return (
    <>
      <RoleHero
        title={`Halo, ${customer?.name || 'Pelanggan'}!`}
        description="Pantau layanan internet dan tagihan Anda di sini."
        accent="primary"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 group-hover:transition-all">
        <StatCard
          icon={<FileText className="h-8 w-8 text-blue-600" />}
          title="Tagihan Aktif"
          value={activeInvoice ? `Rp ${Number(activeInvoice.amount).toLocaleString()}` : 'Rp 0'}
          subtitle={activeInvoice ? `Jatuh tempo: ${new Date(activeInvoice.due_date).toLocaleDateString()}` : 'Tidak ada tagihan'}
          accent={activeInvoice ? 'warning' : 'success'}
        />
        <StatCard
          icon={<Gift className="h-8 w-8 text-purple-600" />}
          title="Reward Points"
          value={`${Number(data?.rewardPoints || 0).toLocaleString()} pts`}
          subtitle="Tukarkan dengan promo menarik"
          accent="primary"
        />
        <StatCard
          icon={<Package className="h-8 w-8 text-indigo-600" />}
          title="Paket Layanan"
          value={customer?.package_name || 'Standar'}
          subtitle={`Status: ${customer?.status || 'Active'}`}
          accent="primary"
        />
      </div>

      {activeInvoice && (
        <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-3xl flex items-center gap-4">
           <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0" />
           <div>
              <p className="font-black text-amber-900 leading-tight">Jangan Lupa Bayar Tagihan!</p>
              <p className="text-sm text-amber-700 font-medium">Anda memiliki tagihan yang belum dibayar sebesar Rp {Number(activeInvoice.amount).toLocaleString()}</p>
           </div>
           <button 
             onClick={() => router.push('/customers/payments')}
             className="ml-auto px-6 py-2.5 bg-amber-600 text-white rounded-2xl font-black text-sm hover:bg-amber-700 transition-all shadow-lg shadow-amber-200"
           >
             BAYAR SEKARANG
           </button>
        </div>
      )}

      <SectionCard title="Aksi Cepat">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ActionButton icon={<FileText />} label="Tagihan" accent="primary" href="/customers/invoices" />
          <ActionButton icon={<CreditCard />} label="Pembayaran" accent="primary" href="/customers/payments" />
          <ActionButton icon={<Wifi />} label="Wi-Fi" accent="primary" href="/customers/modem" />
          <ActionButton icon={<Gift />} label="Rewards" accent="primary" href="/customers/rewards" />
        </div>
      </SectionCard>
    </>
  );
}
