const db = require('../config/database');

/**
 * Get dashboard statistics
 * Returns overview stats for revenue, customers, invoices, payments
 */
async function getDashboardStats() {
  const client = await db.connect();
  
  try {
    // Total revenue
    const revenueResult = await client.query(`
      SELECT COALESCE(SUM(amount), 0) as total_revenue
      FROM payments
      WHERE status = 'completed'
    `);
    
    // Monthly revenue
    const monthlyRevenueResult = await client.query(`
      SELECT COALESCE(SUM(amount), 0) as monthly_revenue
      FROM payments
      WHERE status = 'completed'
      AND EXTRACT(MONTH FROM payment_date) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM payment_date) = EXTRACT(YEAR FROM CURRENT_DATE)
    `);
    
    // Active customers
    const activeCustomersResult = await client.query(`
      SELECT COUNT(*) as active_customers
      FROM customers
      WHERE status = 'active'
    `);
    
    // Pending invoices
    const pendingInvoicesResult = await client.query(`
      SELECT COUNT(*) as pending_invoices
      FROM invoices
      WHERE status = 'pending'
    `);
    
    // Total payments
    const totalPaymentsResult = await client.query(`
      SELECT COUNT(*) as total_payments
      FROM payments
      WHERE status = 'completed'
    `);
    
    return {
      totalRevenue: parseInt(revenueResult.rows[0].total_revenue),
      monthlyRevenue: parseInt(monthlyRevenueResult.rows[0].monthly_revenue),
      activeCustomers: parseInt(activeCustomersResult.rows[0].active_customers),
      pendingInvoices: parseInt(pendingInvoicesResult.rows[0].pending_invoices),
      totalPayments: parseInt(totalPaymentsResult.rows[0].total_payments),
    };
  } finally {
    client.release();
  }
}

/**
 * Get recent transactions
 * Returns latest invoices/transactions
 */
async function getRecentTransactions(limit = 10) {
  const client = await db.connect();
  
  try {
    const result = await client.query(`
      SELECT 
        i.id,
        i.invoice_number,
        c.name as customer_name,
        i.amount,
        i.status,
        i.issue_date,
        i.due_date,
        p.package_name
      FROM invoices i
      JOIN customers c ON i.customer_id = c.id
      LEFT JOIN packages p ON i.package_id = p.id
      ORDER BY i.issue_date DESC
      LIMIT $1
    `, [limit]);
    
    return result.rows;
  } finally {
    client.release();
  }
}

/**
 * Get top customers by revenue
 * Returns customers with highest total payments
 */
async function getTopCustomers(limit = 5) {
  const client = await db.connect();
  
  try {
    const result = await client.query(`
      SELECT 
        c.id,
        c.name,
        c.email,
        COALESCE(SUM(p.amount), 0) as total_paid,
        COUNT(DISTINCT p.id) as payment_count,
        pk.package_name
      FROM customers c
      LEFT JOIN payments p ON c.id = p.customer_id AND p.status = 'completed'
      LEFT JOIN invoices i ON p.invoice_id = i.id
      LEFT JOIN packages pk ON i.package_id = pk.id
      GROUP BY c.id, pk.package_name
      ORDER BY total_paid DESC
      LIMIT $1
    `, [limit]);
    
    return result.rows;
  } finally {
    client.release();
  }
}

/**
 * Get package distribution
 * Returns customer count per package
 */
async function getPackageDistribution() {
  const client = await db.connect();
  
  try {
    const result = await client.query(`
      SELECT 
        p.package_name,
        p.price,
        COUNT(c.id) as customer_count
      FROM packages p
      LEFT JOIN customers c ON p.id = c.package_id AND c.status = 'active'
      GROUP BY p.id
      ORDER BY customer_count DESC
    `);
    
    return result.rows;
  } finally {
    client.release();
  }
}

/**
 * Get recent activity
 * Returns latest system activities
 */
async function getRecentActivity(limit = 10) {
  const client = await db.connect();
  
  try {
    const result = await client.query(`
      SELECT 
        activity_type,
        description,
        created_at
      FROM activities
      ORDER BY created_at DESC
      LIMIT $1
    `, [limit]);
    
    return result.rows;
  } finally {
    client.release();
  }
}

module.exports = {
  getDashboardStats,
  getRecentTransactions,
  getTopCustomers,
  getPackageDistribution,
  getRecentActivity,
};
