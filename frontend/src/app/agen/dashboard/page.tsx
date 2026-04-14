import {
  Users,
  FileText,
  CreditCard,
  TrendingUp,
  BarChart3,
  DollarSign
} from 'lucide-react';
import ActionButton from '@/components/ui/ActionButton';
import StatCard from '@/components/ui/StatCard';
import RoleHero from '@/components/ui/RoleHero';
import SectionCard from '@/components/ui/SectionCard';
import ListRow from '@/components/ui/ListRow';

export default function AgenDashboard() {
  return (
    <>
      <RoleHero
        title="Agent Portal"
        description="Manage your customers and sales operations"
        accent="green"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Users className="h-8 w-8 text-blue-600" />}
          title="Total Customers"
          value="89"
          subtitle="+5 this month"
        />
        <StatCard
          icon={<DollarSign className="h-8 w-8 text-green-600" />}
          title="Monthly Revenue"
          value="Rp 15.450.000"
          subtitle="+12% from last month"
        />
        <StatCard
          icon={<FileText className="h-8 w-8 text-yellow-600" />}
          title="Pending Invoices"
          value="23"
          subtitle="Rp 5.750.000"
        />
        <StatCard
          icon={<TrendingUp className="h-8 w-8 text-purple-600" />}
          title="Active Subscriptions"
          value="76"
          subtitle="85% retention rate"
        />
      </div>

      <SectionCard title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ActionButton icon={<Users />} label="Manage Customers" accent="green" />
          <ActionButton icon={<FileText />} label="Create Invoice" accent="green" />
          <ActionButton icon={<CreditCard />} label="Record Payment" accent="green" />
          <ActionButton icon={<BarChart3 />} label="View Reports" accent="green" />
        </div>
      </SectionCard>

      <SectionCard title="Recent Customers" className="mt-6">
        <div className="space-y-4">
          <CustomerItem
            name="Ahmad Rizki"
            plan="Premium 50Mbps"
            status="Active"
            joined="2026-04-10"
          />
          <CustomerItem
            name="Siti Nurhaliza"
            plan="Standard 20Mbps"
            status="Active"
            joined="2026-04-08"
          />
          <CustomerItem
            name="Budi Santoso"
            plan="Basic 10Mbps"
            status="Pending"
            joined="2026-04-14"
          />
        </div>
      </SectionCard>
    </>
  );
}

function CustomerItem({ name, plan, status, joined }: {
  name: string;
  plan: string;
  status: string;
  joined: string;
}) {
  const statusColor = {
    Active: 'text-green-600 bg-green-50',
    Pending: 'text-yellow-600 bg-yellow-50',
    Inactive: 'text-red-600 bg-red-50',
  }[status] || 'text-gray-600 bg-gray-50';

  return (
    <ListRow
      left={
        <>
          <div className="flex items-center space-x-3 mb-1">
            <span className="text-sm font-semibold text-gray-900">{name}</span>
            <span className="text-sm text-gray-600">•</span>
            <span className="text-sm text-gray-600">{plan}</span>
          </div>
          <p className="text-sm text-gray-600">Joined: {joined}</p>
        </>
      }
      right={
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {status}
        </span>
      }
    />
  );
}
