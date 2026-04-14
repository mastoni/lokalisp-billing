import {
  Users,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Wrench
} from 'lucide-react';
import ActionButton from '@/components/ui/ActionButton';
import StatCard from '@/components/ui/StatCard';
import RoleHero from '@/components/ui/RoleHero';
import SectionCard from '@/components/ui/SectionCard';
import ListRow from '@/components/ui/ListRow';

export default function TeknisiDashboard() {
  return (
    <>
      <RoleHero
        title="Technical Operations"
        description="Manage devices, installations, and maintenance tasks"
        accent="orange"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<AlertTriangle className="h-8 w-8 text-red-600" />}
          title="Pending Issues"
          value="12"
          subtitle="3 urgent"
        />
        <StatCard
          icon={<Clock className="h-8 w-8 text-yellow-600" />}
          title="Scheduled Tasks"
          value="8"
          subtitle="For this week"
        />
        <StatCard
          icon={<Users className="h-8 w-8 text-blue-600" />}
          title="Assigned Customers"
          value="45"
          subtitle="Under maintenance"
        />
        <StatCard
          icon={<CheckCircle className="h-8 w-8 text-green-600" />}
          title="Completed Tasks"
          value="156"
          subtitle="This month"
        />
      </div>

      <SectionCard title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ActionButton icon={<AlertTriangle />} label="View Issues" accent="orange" />
          <ActionButton icon={<Wrench />} label="Manage Devices" accent="orange" />
          <ActionButton icon={<Users />} label="Customer List" accent="orange" />
          <ActionButton icon={<FileText />} label="Maintenance Logs" accent="orange" />
        </div>
      </SectionCard>

      <SectionCard title="Recent Support Tickets" className="mt-6">
        <div className="space-y-4">
          <TicketItem
            id="TK-001"
            customer="Ahmad Rizki"
            issue="Connection timeout issues"
            priority="High"
            status="Open"
          />
          <TicketItem
            id="TK-002"
            customer="Siti Nurhaliza"
            issue="Slow internet speed"
            priority="Medium"
            status="In Progress"
          />
          <TicketItem
            id="TK-003"
            customer="Budi Santoso"
            issue="Router configuration"
            priority="Low"
            status="Scheduled"
          />
        </div>
      </SectionCard>
    </>
  );
}

function TicketItem({ id, customer, issue, priority, status }: {
  id: string;
  customer: string;
  issue: string;
  priority: string;
  status: string;
}) {
  const priorityColor = {
    High: 'text-red-600 bg-red-50',
    Medium: 'text-yellow-600 bg-yellow-50',
    Low: 'text-green-600 bg-green-50',
  }[priority] || 'text-gray-600 bg-gray-50';

  const statusColor = {
    Open: 'text-blue-600 bg-blue-50',
    'In Progress': 'text-orange-600 bg-orange-50',
    Scheduled: 'text-purple-600 bg-purple-50',
  }[status] || 'text-gray-600 bg-gray-50';

  return (
    <ListRow
      left={
        <>
          <div className="flex items-center space-x-3 mb-1">
            <span className="text-sm font-semibold text-gray-900">{id}</span>
            <span className="text-sm text-gray-600">•</span>
            <span className="text-sm font-medium text-gray-700">{customer}</span>
          </div>
          <p className="text-sm text-gray-600">{issue}</p>
        </>
      }
      right={
        <>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColor}`}>
            {priority}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {status}
          </span>
        </>
      }
    />
  );
}
