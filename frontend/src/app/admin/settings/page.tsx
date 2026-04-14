'use client';

import { useState, useEffect } from 'react';
import {
  Settings,
  Globe,
  MessageSquare,
  Cpu,
  Activity,
  Save,
  RefreshCcw,
  ShieldCheck,
  Server,
  Smartphone,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

type Setting = {
  key: string;
  value: string;
  category: string;
  description: string;
};

type GroupedSettings = {
  [category: string]: Setting[];
};

type Customer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  ont_serial_number?: string;
  acs_device_id?: string;
  last_seen?: string;
};

const categories = [
  { id: 'general', name: 'General', icon: Settings },
  { id: 'mikrotik', name: 'MikroTik', icon: Server },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare },
  { id: 'genieacs', name: 'GenieACS', icon: Globe },
  { id: 'radius', name: 'RADIUS', icon: ShieldCheck },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<GroupedSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState('general');
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [testing, setTesting] = useState(false);
  const [webhookDeviceId, setWebhookDeviceId] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [acsEdits, setAcsEdits] = useState<Record<string, string>>({});
  const [savingCustomerId, setSavingCustomerId] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (activeCategory !== 'genieacs') return;
    fetchCustomers('');
  }, [activeCategory]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/settings');
      if (response.data.success) {
        setSettings(response.data.data);

        // Initialize form data
        const initialForm: { [key: string]: string } = {};
        Object.values(response.data.data).flat().forEach((s: any) => {
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

  const fetchCustomers = async (search: string) => {
    try {
      setCustomersLoading(true);
      const resp = await api.get('/customers', { params: { search } });
      if (resp.data.success) {
        const items: Customer[] = resp.data.data || [];
        setCustomers(items);
        setAcsEdits((prev) => {
          const next = { ...prev };
          for (const c of items) {
            if (next[c.id] === undefined) {
              next[c.id] = c.acs_device_id || '';
            }
          }
          return next;
        });
      }
    } catch (error: any) {
      toast.error('Failed to fetch customers: ' + (error.response?.data?.message || error.message));
    } finally {
      setCustomersLoading(false);
    }
  };

  const saveCustomerMapping = async (id: string) => {
    try {
      setSavingCustomerId(id);
      const value = acsEdits[id] || '';
      const resp = await api.put(`/customers/${id}`, { acs_device_id: value });
      if (resp.data.success) {
        toast.success('Mapping saved');
        setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, acs_device_id: value } : c)));
      } else {
        toast.error(resp.data.message || 'Failed to save mapping');
      }
    } catch (error: any) {
      toast.error('Failed to save mapping: ' + (error.response?.data?.message || error.message));
    } finally {
      setSavingCustomerId(null);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (category: string) => {
    try {
      setSaving(true);
      const categorySettings = settings[category] || [];
      if (categorySettings.length === 0) {
        toast.error('No settings found for this category');
        return;
      }
      const settingsToUpdate = categorySettings.map(s => ({
        key: s.key,
        value: formData[s.key]
      }));

      const response = await api.patch('/settings', { settings: settingsToUpdate });

      if (response.data.success) {
        toast.success(`${category.charAt(0).toUpperCase() + category.slice(1)} settings updated!`);
      }
    } catch (error: any) {
      toast.error('Update failed: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async (category: string) => {
    try {
      setTesting(true);
      const response = await api.post(`/integrations/test/${category}`);
      if (response.data.success) {
        toast.success(response.data.message || 'Test successful');
        return;
      }
      toast.error(response.data.message || 'Test failed');
    } catch (error: any) {
      toast.error('Test failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setTesting(false);
    }
  };

  const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api').replace(/\/$/, '');
  const webhookUrl = `${apiBase}/webhooks/genieacs`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCcw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">General Settings</h1>
          <p className="text-slate-500">Manage your system configurations and integrations</p>
        </div>
        <button
          onClick={fetchSettings}
          className="flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              <cat.icon className="w-5 h-5 mr-3" />
              <span className="font-medium text-sm">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg mr-3">
                  {categories.find(c => c.id === activeCategory)?.icon && (
                    <div className="text-blue-600">
                      {(() => {
                        const Icon = categories.find(c => c.id === activeCategory)!.icon;
                        return <Icon className="w-5 h-5" />;
                      })()}
                    </div>
                  )}
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  {categories.find(c => c.id === activeCategory)?.name} Configuration
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {settings[activeCategory]?.map((setting) => (
                  <div key={setting.key} className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center">
                      {setting.key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      <div className="group relative ml-2 text-slate-400 cursor-help">
                        <Info className="w-3.5 h-3.5" />
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                          {setting.description}
                        </div>
                      </div>
                    </label>

                    {setting.key.includes('password') || setting.key.includes('key') || setting.key.includes('secret') ? (
                      <input
                        type="password"
                        value={formData[setting.key]}
                        onChange={(e) => handleInputChange(setting.key, e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                        placeholder={`Enter ${setting.key.replace(/_/g, ' ')}`}
                      />
                    ) : setting.key.includes('status') ? (
                      <select
                        value={formData[setting.key]}
                        onChange={(e) => handleInputChange(setting.key, e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                      >
                        <option value="enabled">Enabled</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={formData[setting.key]}
                        onChange={(e) => handleInputChange(setting.key, e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                        placeholder={`Enter ${setting.key.replace(/_/g, ' ')}`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => handleSave(activeCategory)}
                  disabled={saving}
                  className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50"
                >
                  {saving ? (
                    <RefreshCcw className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5 mr-2" />
                  )}
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Connection Test */}
          {activeCategory !== 'general' && (
            <div className="mt-6 bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="w-6 h-6 mr-4 text-blue-400" />
                  <div>
                    <h3 className="font-bold">Test Integration</h3>
                    <p className="text-xs text-slate-400">Validate your connection settings with the {activeCategory} service</p>
                  </div>
                </div>
                <button
                  onClick={() => handleTest(activeCategory)}
                  disabled={testing}
                  className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/30 rounded-lg text-xs font-bold transition-all"
                >
                  {testing ? 'Testing...' : 'Run Test'}
                </button>
              </div>
            </div>
          )}

          {activeCategory === 'genieacs' && (
            <>
              <div className="mt-6 bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-green-500/20 transition-all"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center">
                    <RefreshCcw className="w-6 h-6 mr-4 text-green-400" />
                    <div>
                      <h3 className="font-bold">Sync last_seen</h3>
                      <p className="text-xs text-slate-400">Tarik data lastInform dari GenieACS untuk update status semua perangkat</p>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        const toastId = toast.loading('Syncing with GenieACS...');
                        const res = await api.post('/integrations/sync/genieacs');
                        toast.success(`Sync complete! Updated ${res.data.details.updated_customers} customers.`, { id: toastId });
                      } catch (error: any) {
                        toast.error(error.response?.data?.message || error.message);
                      }
                    }}
                    className="px-4 py-2 bg-green-500/20 hover:bg-green-500/40 border border-green-500/30 rounded-lg text-xs font-bold transition-all"
                  >
                    Sync Now
                  </button>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-50 rounded-lg mr-3">
                      <Activity className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Webhook ACS (Realtime)</h3>
                      <p className="text-xs text-slate-500">Receiver untuk event GenieACS agar last_seen ter-update realtime</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Webhook URL</label>
                    <input
                      readOnly
                      value={webhookUrl}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                    <p className="text-[11px] text-slate-500">
                      Set header: <span className="font-mono">x-webhook-secret</span> = value dari <span className="font-mono">acs_webhook_secret</span>.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Test Device ID</label>
                    <input
                      type="text"
                      value={webhookDeviceId}
                      onChange={(e) => setWebhookDeviceId(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                      placeholder="Isi acs_device_id yang ada di customer"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={async () => {
                        try {
                          const secret = formData['acs_webhook_secret'] || '';
                          const payload = { deviceId: webhookDeviceId || 'test-device' };
                          const resp = await fetch(webhookUrl, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'x-webhook-secret': secret,
                            },
                            body: JSON.stringify(payload),
                          });
                          const data = await resp.json().catch(() => null);
                          if (resp.ok && data?.success) toast.success('Webhook received');
                          else toast.error(data?.message || 'Webhook failed');
                        } catch (error: any) {
                          toast.error('Webhook failed: ' + error.message);
                        }
                      }}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all"
                    >
                      Send Test Webhook
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">GenieACS Device Mapping</h3>
                    <p className="text-xs text-slate-500">Set acs_device_id per customer untuk update last_seen realtime via webhook.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Cari nama/email/ONT SN..."
                    />
                    <button
                      onClick={() => fetchCustomers(customerSearch)}
                      disabled={customersLoading}
                      className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
                    >
                      {customersLoading ? 'Loading...' : 'Search'}
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {customers.length === 0 && !customersLoading && (
                    <div className="text-sm text-slate-500">Tidak ada data customer.</div>
                  )}

                  {customers.map((c) => (
                    <div key={c.id} className="border border-slate-200 rounded-2xl p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-900 truncate">{c.name}</div>
                          <div className="text-xs text-slate-500 truncate">
                            {c.email || '-'} • {c.phone || '-'}
                          </div>
                          <div className="text-xs text-slate-500">
                            ONT SN: <span className="font-mono">{c.ont_serial_number || '-'}</span>
                          </div>
                          <div className="text-xs text-slate-500">
                            Last seen: {c.last_seen ? new Date(c.last_seen).toLocaleString('id-ID') : '-'}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 w-full sm:w-[22rem]">
                          <label className="text-xs font-semibold text-slate-700">acs_device_id</label>
                          <input
                            type="text"
                            value={acsEdits[c.id] ?? (c.acs_device_id || '')}
                            onChange={(e) => setAcsEdits((prev) => ({ ...prev, [c.id]: e.target.value }))}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Contoh: 65f0a1... (ID dari GenieACS)"
                          />
                          <button
                            onClick={() => saveCustomerMapping(c.id)}
                            disabled={savingCustomerId === c.id}
                            className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 disabled:opacity-50"
                          >
                            {savingCustomerId === c.id ? 'Saving...' : 'Save Mapping'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
