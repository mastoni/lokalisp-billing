'use client';

import { useState, useEffect } from 'react';
import { 
  Network, 
  RefreshCw, 
  Activity, 
  Cpu, 
  HardDrive, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  Settings,
  Shield,
  Zap,
  Users,
  Search,
  Filter,
  UserCheck,
  Globe,
  List,
  Layers
} from 'lucide-react';

type TabType = 'overview' | 'pppoe' | 'hotspot' | 'profiles';

export default function MikrotikStatsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<any>(null);
  const [pppoeData, setPppoeData] = useState<any[]>([]);
  const [activePppoe, setActivePppoe] = useState<any[]>([]);
  const [hotspotData, setHotspotData] = useState<any[]>([]);
  const [activeHotspot, setActiveHotspot] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchMikrotikData = async (type: string) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8081/api/integrations/mikrotik/data?type=${type}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        return data.data;
      }
      return null;
    } catch (err: any) {
      console.error(`Error fetching ${type}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentTab = async () => {
    setLoading(true);
    if (activeTab === 'overview') {
      try {
        const res = await fetch('http://localhost:8081/api/integrations/test/mikrotik', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.details);
          setError(null);
        } else {
          setError(data.message || 'Failed to connect');
        }
      } catch (err: any) {
        setError(err.message);
      }
    } else if (activeTab === 'pppoe') {
      const [secrets, active] = await Promise.all([
        fetchMikrotikData('pppoe'),
        fetchMikrotikData('active')
      ]);
      setPppoeData(secrets || []);
      setActivePppoe(active || []);
    } else if (activeTab === 'hotspot') {
      const [users, active] = await Promise.all([
        fetchMikrotikData('hotspot'),
        fetchMikrotikData('active-hotspot')
      ]);
      setHotspotData(users || []);
      setActiveHotspot(active || []);
    } else if (activeTab === 'profiles') {
      const data = await fetchMikrotikData('profiles');
      setProfiles(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (mounted) loadCurrentTab();
  }, [activeTab, mounted]);

  const filteredData = (data: any[]) => {
    if (!searchTerm) return data;
    return data.filter(item => 
      (item.name || item.user || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.comment || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Network className="w-8 h-8 text-blue-600" />
            MikroTik Gateway
          </h1>
          <p className="text-slate-500 mt-1 uppercase text-xs font-bold tracking-widest">RouterOS Management System</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadCurrentTab}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
            <Settings className="w-4 h-4 mr-2" />
            Config
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center p-1 bg-slate-100 rounded-2xl w-fit">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'pppoe', label: 'PPPoE', icon: Globe },
          { id: 'hotspot', label: 'Hotspot', icon: Zap },
          { id: 'profiles', label: 'Profiles', icon: Layers },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/50' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {error ? (
              <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-900">Connection Error</h3>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* CPU Card */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-md transition-shadow">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">CPU Load</p>
                    <div className="flex items-baseline gap-2">
                       <h3 className="text-3xl font-black text-slate-900">{stats?.cpu_load || '0%'}</h3>
                       <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
                    </div>
                  </div>
                  {/* Model Card */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Device Model</p>
                    <h3 className="text-xl font-bold text-slate-900 truncate">{stats?.model || '---'}</h3>
                  </div>
                  {/* Uptime Card */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Uptime</p>
                    <h3 className="text-xl font-bold text-slate-900">{stats?.uptime || '---'}</h3>
                  </div>
                  {/* Version Card */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">OS Version</p>
                    <h3 className="text-xl font-bold text-slate-900">{stats?.version || '---'}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                      <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        Quick Maintenance
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button className="flex flex-col items-start p-4 bg-blue-50/50 hover:bg-blue-50 rounded-xl border border-blue-100 transition-colors text-left group">
                          <span className="font-bold text-blue-900 group-hover:text-blue-600">Sync PPPoE Secrets</span>
                          <span className="text-xs text-blue-700/70 mt-1">Updates secrets from database</span>
                        </button>
                        <button className="flex flex-col items-start p-4 bg-purple-50/50 hover:bg-purple-50 rounded-xl border border-purple-100 transition-colors text-left group">
                          <span className="font-bold text-purple-900 group-hover:text-purple-600">Flush ARPs</span>
                          <span className="text-xs text-purple-700/70 mt-1">Clear neighbor table cache</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 rounded-3xl p-8 text-white">
                    <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-6">Connection Info</h3>
                    <div className="space-y-6">
                      <div>
                        <p className="text-slate-500 text-xs">API Status</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="font-bold">CONNECTED</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Host Address</p>
                        <p className="font-mono text-sm mt-1">192.168.2.1:2620</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'pppoe' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search secrets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                />
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
                  Total: {pppoeData.length}
                </span>
                <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100">
                  Active: {activePppoe.length}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Service</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Profile</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Remote Address</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Comment</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredData(pppoeData).map((user, idx) => {
                      const isActive = activePppoe.find(a => a.name === user.name);
                      return (
                        <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-900">{user.name}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{user.service || 'any'}</td>
                          <td className="px-6 py-4 text-sm font-medium text-blue-600">{user.profile}</td>
                          <td className="px-6 py-4 text-sm font-mono text-slate-500">{user['remote-address'] || '---'}</td>
                          <td className="px-6 py-4 text-sm text-slate-500 italic max-w-xs truncate">{user.comment}</td>
                          <td className="px-6 py-4">
                            {isActive ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded border border-green-200">
                                <Activity className="w-3 h-3" />
                                Active
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-bold uppercase">Offline</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hotspot' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search hotspot users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-medium"
                />
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-100">
                  Users: {hotspotData.length}
                </span>
                <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-full border border-orange-100">
                  Online: {activeHotspot.length}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Username</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Profile</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Server</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Limit Uptime</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredData(hotspotData).map((user, idx) => {
                      const isActive = activeHotspot.find(a => a.user === user.name);
                      return (
                        <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-900">{user.name}</span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-purple-600">{user.profile}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{user.server || 'all'}</td>
                          <td className="px-6 py-4 text-sm font-mono text-slate-500">{user['limit-uptime'] || 'Unlimited'}</td>
                          <td className="px-6 py-4">
                            {isActive ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-700 text-[10px] font-black uppercase rounded border border-orange-200">
                                <Zap className="w-3 h-3" />
                                Online
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-bold uppercase">Disconnected</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profiles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
               <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">PPPoE Profiles</h3>
                  <Layers className="w-4 h-4 text-blue-500" />
               </div>
               <div className="p-4 space-y-2">
                 {profiles?.ppp?.map((p: any, idx: number) => (
                   <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      <div>
                        <p className="font-bold text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-500">Local: {p['local-address'] || '---'} | Remote: {p['remote-address'] || '---'}</p>
                      </div>
                      <span className="text-xs font-mono text-slate-400">{p['rate-limit'] || 'No Limit'}</span>
                   </div>
                 ))}
               </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
               <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">Hotspot User Profiles</h3>
                  <UserCheck className="w-4 h-4 text-purple-500" />
               </div>
               <div className="p-4 space-y-2">
                 {profiles?.hotspot?.map((p: any, idx: number) => (
                   <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      <div>
                        <p className="font-bold text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-500">Shared: {p['shared-users'] || '1'} | Session: {p['session-timeout'] || '---'}</p>
                      </div>
                      <span className="text-xs font-mono text-slate-400">{p['rate-limit'] || 'No Limit'}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
