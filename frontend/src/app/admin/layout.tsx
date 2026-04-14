'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Gift,
  TrendingUp,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Bell,
  Search,
  User,
  ChevronLeft,
  ChevronRight,
  Package,
  DollarSign,
  Activity,
  BarChart3,
  Shield,
  Clock,
  Star,
  Trophy,
  Coins
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    category: 'main'
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    category: 'main'
  },
];

const managementNav = [
  {
    name: 'Customers',
    href: '/admin/customers',
    icon: Users,
  },
  {
    name: 'Invoices',
    href: '/admin/invoices',
    icon: FileText,
  },
  {
    name: 'Payments',
    href: '/admin/payments',
    icon: CreditCard,
  },
  {
    name: 'Packages',
    href: '/admin/packages',
    icon: Package,
  },
];

const rewardNav = [
  {
    name: 'Reward Points',
    href: '/admin/rewards',
    icon: Gift,
  },
  {
    name: 'Redemptions',
    href: '/admin/rewards/redemptions',
    icon: TrendingUp,
  },
  {
    name: 'Leaderboard',
    href: '/admin/rewards/leaderboard',
    icon: Trophy,
  },
  {
    name: 'Reward Settings',
    href: '/admin/rewards/settings',
    icon: Settings,
  },
];

const settingsNav = [
  {
    name: 'General Settings',
    href: '/admin/settings',
    icon: Settings,
  },
  {
    name: 'User Management',
    href: '/admin/settings/users',
    icon: Shield,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rewardsExpanded, setRewardsExpanded] = useState(true);

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl ${
          sidebarOpen ? 'w-72' : 'w-20'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          {sidebarOpen && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">Billing Sembok</h1>
                <p className="text-xs md:text-sm text-slate-400">Billing System</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-4 h-4 text-slate-300" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-300" />
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-slate-300 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-6 space-y-6 overflow-y-auto h-[calc(100vh-180px)]">
          {/* Main Navigation */}
          <div>
            {sidebarOpen && (
              <p className="px-4 mb-3 text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wider">
                Main
              </p>
            )}
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                  {sidebarOpen && <span className="font-medium text-sm md:text-base">{item.name}</span>}
                  {sidebarOpen && isActive(item.href) && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-white" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Management */}
          <div>
            {sidebarOpen && (
              <p className="px-4 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Management
              </p>
            )}
            <div className="space-y-1">
              {managementNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                  {sidebarOpen && <span className="font-medium text-sm md:text-base">{item.name}</span>}
                </Link>
              ))}
            </div>
          </div>

          {/* Rewards & Loyalty */}
          <div>
            {sidebarOpen && (
              <button
                onClick={() => setRewardsExpanded(!rewardsExpanded)}
                className="flex items-center justify-between w-full px-4 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-400"
              >
                <span>Rewards & Loyalty</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${
                    rewardsExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>
            )}
            <div className={`space-y-1 ${rewardsExpanded || !sidebarOpen ? 'block' : 'hidden'}`}>
              {rewardNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                  {sidebarOpen && <span className="font-medium text-sm md:text-base">{item.name}</span>}
                  {sidebarOpen && isActive(item.href) && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-white" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div>
            {sidebarOpen && (
              <p className="px-4 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                System
              </p>
            )}
            <div className="space-y-1">
              {settingsNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                  {sidebarOpen && <span className="font-medium text-sm md:text-base">{item.name}</span>}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 to-transparent">
          <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'}`}>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
              <User className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm md:text-base font-semibold text-white truncate">Admin</p>
                <p className="text-xs md:text-sm text-slate-400 truncate">admin@lokalisp.id</p>
              </div>
            )}
            {sidebarOpen && (
              <button className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors">
                <LogOut className="w-4 h-4 text-slate-400 hover:text-red-400" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Menu className="w-6 h-6 text-slate-600" />
              </button>
              <div className="hidden md:flex items-center space-x-2 text-sm text-slate-600">
                <Clock className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:flex items-center px-4 py-2 bg-slate-100 rounded-xl">
                <Search className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-sm w-64"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-slate-700">Administrator</p>
                  <p className="text-xs text-slate-500">Super Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
