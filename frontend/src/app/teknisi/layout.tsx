'use client';

import RoleGuard from '@/components/auth/RoleGuard';
import RoleShell from '@/components/layout/RoleShell';

export default function TeknisiLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['teknisi']}>
      <RoleShell title="Teknisi Dashboard" accent="orange">
        {children}
      </RoleShell>
    </RoleGuard>
  );
}
