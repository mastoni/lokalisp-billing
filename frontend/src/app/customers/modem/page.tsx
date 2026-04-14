'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { RefreshCcw, Router, Wifi } from 'lucide-react';
import api from '@/lib/api';
import RoleHero from '@/components/ui/RoleHero';
import SectionCard from '@/components/ui/SectionCard';

type ModemInfo = {
  acs_device_id: string;
  serial_number: string | null;
  manufacturer: string | null;
  product_class: string | null;
  model: string | null;
  uptime_seconds: number | string | null;
  wan_ip: string | null;
  ssid_1: string | null;
  ssid_2: string | null;
  last_inform: string | null;
  wifi_profile?: string;
};

type PortalResponse = {
  success: boolean;
  data: {
    customer: {
      id: string;
      name: string;
      email?: string;
      ont_serial_number?: string;
      acs_device_id?: string;
      last_seen?: string;
    };
    modem: ModemInfo | null;
    message?: string;
  };
};

export default function CustomerModemPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PortalResponse['data'] | null>(null);

  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [connectionRequest, setConnectionRequest] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get<PortalResponse>('/portal/me/modem');
      if (res.data.success) {
        setData(res.data.data);
      } else {
        toast.error('Gagal memuat data modem');
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload: any = {
        password,
        connection_request: connectionRequest,
      };
      if (ssid.trim()) payload.ssid = ssid.trim();
      const res = await api.post('/portal/me/modem/wifi/password', payload);
      if (res.data.success) {
        toast.success('Perintah dikirim. Modem akan apply saat inform berikutnya.');
        setPassword('');
      } else {
        toast.error(res.data.message || 'Gagal mengirim perintah');
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const modem = data?.modem || null;

  return (
    <>
      <RoleHero
        title="Modem & WiFi"
        description="Lihat perangkat yang terpasang, status jaringan, dan kelola WiFi."
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

      <SectionCard title="Perangkat Terpasang" className="mb-6">
        {loading ? (
          <div className="text-sm text-gray-600">Loading...</div>
        ) : !data ? (
          <div className="text-sm text-gray-600">Data tidak tersedia.</div>
        ) : !modem ? (
          <div className="text-sm text-gray-600">
            {data.message || 'Perangkat belum terhubung ke ACS atau acs_device_id belum di-set.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start">
              <Router className="h-5 w-5 text-gray-700 mt-0.5 mr-2" />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">{modem.model || modem.product_class || 'Modem'}</div>
                <div className="text-xs text-gray-600 truncate">{modem.manufacturer || '-'}</div>
                <div className="text-xs text-gray-600">
                  Serial: <span className="font-mono">{modem.serial_number || '-'}</span>
                </div>
                <div className="text-xs text-gray-600">
                  ACS ID: <span className="font-mono">{modem.acs_device_id}</span>
                </div>
                <div className="text-xs text-gray-600">
                  Profile: <span className="font-mono">{modem.wifi_profile || '-'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-semibold text-gray-900 flex items-center">
                <Wifi className="h-5 w-5 text-gray-700 mr-2" />
                Status Jaringan
              </div>
              <div className="text-xs text-gray-600">WAN IP: {modem.wan_ip || '-'}</div>
              <div className="text-xs text-gray-600">SSID 1: {modem.ssid_1 || '-'}</div>
              <div className="text-xs text-gray-600">SSID 2: {modem.ssid_2 || '-'}</div>
              <div className="text-xs text-gray-600">
                Last Inform: {modem.last_inform ? new Date(modem.last_inform).toLocaleString('id-ID') : '-'}
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Ganti Password WiFi">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">SSID (opsional)</label>
            <input
              value={ssid}
              onChange={(e) => setSsid(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
              placeholder="Biarkan kosong untuk tidak mengubah SSID"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Password baru</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
              placeholder="Minimal 8 karakter"
            />
          </div>

          <label className="flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              checked={connectionRequest}
              onChange={(e) => setConnectionRequest(e.target.checked)}
              className="mr-2"
            />
            Jalankan segera (connection request)
          </label>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !password}
              className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 disabled:opacity-50 text-sm"
            >
              {submitting ? 'Mengirim...' : 'Kirim Perintah'}
            </button>
          </div>
        </form>
      </SectionCard>
    </>
  );
}
