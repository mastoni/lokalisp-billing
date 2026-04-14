require('dotenv').config();
const pool = require('../src/config/database');

async function seedAgents() {
  try {
    console.log('Seeding agent data...');
    
    // Get an agent user
    const agents = await pool.query('SELECT u.id FROM users u JOIN roles r ON u.role_id = r.id WHERE r.name = \'agen\' LIMIT 1');
    
    if (agents.rows.length === 0) {
      console.log('Skipping seed: No agent users found. Create one first.');
      return;
    }

    const agentId = agents.rows[0].id;

    // Get some customers and assign them to the agent
    const customers = await pool.query('SELECT id FROM customers LIMIT 5');
    
    for (const c of customers.rows) {
      await pool.query('UPDATE customers SET agent_id = $1 WHERE id = $2', [agentId, c.id]);
    }

    // Add some commissions
    console.log('Seeding commissions...');
    const payments = await pool.query('SELECT p.id, p.customer_id, p.amount FROM payments p LIMIT 3');
    
    for (const p of payments.rows) {
      await pool.query(
        'INSERT INTO agent_commissions (agent_id, customer_id, payment_id, amount, status) VALUES ($1, $2, $3, $4, $5)',
        [agentId, p.customer_id, p.id, Math.floor(p.amount * 0.1), 'earned']
      );
    }

    // Add some withdrawals
    console.log('Seeding withdrawals...');
    await pool.query(
      'INSERT INTO agent_withdrawals (agent_id, amount, bank_name, account_number, account_name, status) VALUES ($1, $2, $3, $4, $5, $6)',
      [agentId, 50000, 'BCA', '8877665544', 'Sembok Agent Account', 'processed']
    );

    console.log('Agent seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Agent seeding failed:', err);
    process.exit(1);
  }
}

seedAgents();
