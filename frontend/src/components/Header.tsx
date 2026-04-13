'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary-600">
            LokalISP Billing
          </Link>
          <div className="flex space-x-4">
            <Link href="/customers" className="hover:text-primary-600">
              Customers
            </Link>
            <Link href="/invoices" className="hover:text-primary-600">
              Invoices
            </Link>
            <Link href="/payments" className="hover:text-primary-600">
              Payments
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
