import {
  FileText,
  CreditCard,
  Settings,
  Package,
  Activity,
  Wifi,
  Gift
} from 'lucide-react';
import ActionButton from '@/components/ui/ActionButton';
import StatCard from '@/components/ui/StatCard';
import RoleHero from '@/components/ui/RoleHero';
import SectionCard from '@/components/ui/SectionCard';

export default function CustomerDashboard() {
  return (
    <>
      <RoleHero
        title="Welcome Back!"
        description="Manage your subscription, invoices, and payments"
        accent="primary"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<FileText className="h-8 w-8 text-blue-600" />}
          title="Active Invoice"
          value="Rp 350.000"
          subtitle="Due in 5 days"
        />
        <StatCard
          icon={<CreditCard className="h-8 w-8 text-green-600" />}
          title="Total Paid"
          value="Rp 2.450.000"
          subtitle="This year"
        />
        <StatCard
          icon={<Package className="h-8 w-8 text-purple-600" />}
          title="Current Plan"
          value="Premium 50Mbps"
          subtitle="Active until Dec 2026"
        />
      </div>

      <SectionCard title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ActionButton icon={<FileText />} label="View Invoices" accent="primary" href="/invoices" />
          <ActionButton icon={<CreditCard />} label="Make Payment" accent="primary" href="/payments" />
          <ActionButton icon={<Wifi />} label="Modem & WiFi" accent="primary" href="/customers/modem" />
          <ActionButton icon={<Gift />} label="Reward Points" accent="primary" href="/customers/rewards" />
        </div>
      </SectionCard>
    </>
  );
}
