'use client';

import { useState, useEffect } from 'react';
import {
  Gift,
  Save,
  RefreshCcw,
  Info,
  ChevronLeft,
  Settings,
  Coins,
  Send,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';

type Setting = {
  key: string;
  value: string;
  category: string;
  description: string;
};

export default function RewardSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/rewards/settings');
      if (response.data.success) {
        setSettings(response.data.data);

        // Initialize form data
        const initialForm: { [key: string]: string } = {};
        response.data.data.forEach((s: any) => {
          initialForm[s.key] = s.value || '';
        });
        setFormData(initialForm);
      }
    } catch (error: any) {
      toast.error('Failed to fetch settings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const settingsToUpdate = Object.entries(formData).map(([key, value]) => ({
        key,
        value
      }));

      const response = await api.post('/rewards/settings', { settings: settingsToUpdate });

      if (response.data.success) {
        toast.success(`Reward settings updated!`);
        fetchSettings();
      }
    } catch (error: any) {
      toast.error('Update failed: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCcw className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  const getIcon = (key: string) => {
    if (key.includes('payment') || key.includes('points')) return <Coins className="w-5 h-5" />;
    if (key.includes('transfer')) return <Send className="w-5 h-5" />;
    if (key.includes('holiday') || key.includes('window')) return <Calendar className="w-5 h-5" />;
    return <Settings className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <Link href="/admin/rewards" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Reward Configuration</h1>
            <p className="text-slate-500">Manage rules, fees, and redemption windows</p>
          </div>
        </div>
        <button
          onClick={fetchSettings}
          className="p-3 text-slate-600 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors"
        >
          <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {settings.map((setting) => (
              <div key={setting.key} className="space-y-3">
                <label className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center">
                  <span className="p-2 bg-purple-50 text-purple-600 rounded-lg mr-2">
                    {getIcon(setting.key)}
                  </span>
                  {setting.key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  <div className="group relative ml-2 text-slate-400 cursor-help">
                    <Info className="w-4 h-4" />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50">
                      {setting.description}
                    </div>
                  </div>
                </label>

                {setting.key === 'points_transfer_enabled' || setting.key === 'redemption_window' ? (
                  <select
                    value={formData[setting.key]}
                    onChange={(e) => handleInputChange(setting.key, e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-purple-500 rounded-2xl outline-none transition-all text-sm font-bold"
                  >
                    {setting.key === 'points_transfer_enabled' ? (
                      <>
                        <option value="true">Enabled</option>
                        <option value="false">Disabled</option>
                      </>
                    ) : (
                      <>
                        <option value="always">Always Open</option>
                        <option value="holiday_only">Holiday Only</option>
                        <option value="disabled">Completely Disabled</option>
                      </>
                    )}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData[setting.key]}
                    onChange={(e) => handleInputChange(setting.key, e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-purple-500 rounded-2xl outline-none transition-all text-sm font-bold"
                    placeholder={`Enter ${setting.key.replace(/_/g, ' ')}`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center px-10 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
            >
              {saving ? (
                <RefreshCcw className="w-5 h-5 mr-3 animate-spin" />
              ) : (
                <Save className="w-5 h-5 mr-3" />
              )}
              SIMPAN PERUBAHAN
            </button>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex items-start gap-4">
        <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
          <Info className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-amber-900">Tips Konfigurasi</h4>
          <p className="text-sm text-amber-800 mt-1 leading-relaxed">
            Gunakan <b>Points Per 1000 Payment</b> untuk mengatur cashback otomatis. Contoh: jika diisi "5", maka pembayaran Rp 100.000 akan menghasilkan 500 poin. 
            Pastikan <b>Redemption Holiday Start/End</b> diisi dengan format MM-DD jika memilih mode 'Holiday Only'.
          </p>
        </div>
      </div>
    </div>
  );
}
