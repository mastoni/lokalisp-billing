require('dotenv').config();
const pool = require('../src/config/database');

async function seedTickets() {
  try {
    console.log('Seeding support tickets...');
    
    // Get a customer and an admin user (for technician testing)
    const customers = await pool.query('SELECT id FROM customers LIMIT 5');
    const technicians = await pool.query('SELECT u.id FROM users u JOIN roles r ON u.role_id = r.id WHERE r.name = \'admin\' OR r.name = \'technician\' LIMIT 2');

    if (customers.rows.length === 0 || technicians.rows.length === 0) {
      console.log('Skipping seed: No customers or technicians found.');
      return;
    }

    const custId = customers.rows[0].id;
    const techId = technicians.rows[0].id;

    const tickets = [
      {
        customer_id: custId,
        technician_id: techId,
        category: 'koneksi',
        priority: 'high',
        status: 'in_progress',
        subject: 'Koneksi Sering Putus di Malam Hari',
        description: 'Pelanggan melaporkan koneksi tidak stabil setiap jam 7 malam sampai 10 malam.',
      },
      {
        customer_id: customers.rows[1]?.id || custId,
        technician_id: techId,
        category: 'perangkat',
        priority: 'critical',
        status: 'assigned',
        subject: 'ONT Terkena Petir',
        description: 'Perangkat mati total setelah ada petir sore tadi. Perlu penggantian unit.',
      },
      {
        customer_id: customers.rows[2]?.id || custId,
        technician_id: null,
        category: 'billing',
        priority: 'medium',
        status: 'open',
        subject: 'Voucher Tidak Bisa Digunakan',
        description: 'Sudah bayar tapi kode voucher muncul invalid di halaman login.',
      }
    ];

    for (const t of tickets) {
      await pool.query(
        'INSERT INTO support_tickets (customer_id, technician_id, category, priority, status, subject, description) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [t.customer_id, t.technician_id, t.category, t.priority, t.status, t.subject, t.description]
      );
    }

    console.log('Seeding maintenance logs...');
    await pool.query(
      'INSERT INTO maintenance_logs (technician_id, customer_id, action_type, description) VALUES ($1, $2, $3, $4)',
      [techId, custId, 'repair', 'Pengecekan kabel FO, konektor kotor dan sudah dibersihkan.']
    );

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seedTickets();
