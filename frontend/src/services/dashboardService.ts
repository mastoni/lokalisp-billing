import api from '../lib/api';

export interface DashboardStats {
  totalRevenue: number;
  monthlyRevenue: number;
  activeCustomers: number;
  pendingInvoices: number;
  totalPayments: number;
}

export interface Transaction {
  id: string;
  invoice_number: string;
  customer_name: string;
  amount: number;
  status: string;
  issue_date: string;
  due_date: string;
  package_name: string;
}

export interface TopCustomer {
  id: string;
  name: string;
  email: string;
  total_paid: number;
  payment_count: number;
  package_name: string;
}

export interface PackageDistribution {
  package_name: string;
  price: number;
  customer_count: number;
}

export interface Activity {
  activity_type: string;
  description: string;
  created_at: string;
}

export const dashboardService = {
  // Get dashboard statistics
  async getStats(): Promise<DashboardStats> {
    const response = await api.get('/dashboard/stats');
    return response.data.data;
  },

  // Get recent transactions
  async getRecentTransactions(limit: number = 10): Promise<Transaction[]> {
    const response = await api.get('/dashboard/recent-transactions', {
      params: { limit },
    });
    return response.data.data;
  },

  // Get top customers by revenue
  async getTopCustomers(limit: number = 5): Promise<TopCustomer[]> {
    const response = await api.get('/dashboard/top-customers', {
      params: { limit },
    });
    return response.data.data;
  },

  // Get package distribution
  async getPackageDistribution(): Promise<PackageDistribution[]> {
    const response = await api.get('/dashboard/package-distribution');
    return response.data.data;
  },

  // Get recent activity
  async getRecentActivity(limit: number = 10): Promise<Activity[]> {
    const response = await api.get('/dashboard/recent-activity', {
      params: { limit },
    });
    return response.data.data;
  },
};
