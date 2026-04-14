const db = require('../config/database');
const CustomerService = require('../services/customer.service');
const RewardService = require('../services/reward.service');

async function resolveCurrentCustomer(req) {
  return CustomerService.findCustomerForUser({
    email: req.user?.email,
    full_name: req.user?.full_name,
    phone: req.user?.phone,
  });
}

const getMyRewards = async (req, res) => {
  const client = await db.connect();
  try {
    const customer = await resolveCurrentCustomer(req);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer profile not found' });

    // Include referral_code from customers table
    const rp = await client.query(
      `SELECT rp.*, c.referral_code
       FROM reward_points rp
       JOIN customers c ON rp.customer_id = c.id
       WHERE rp.customer_id = $1`,
      [customer.id]
    );

    if (rp.rows.length === 0) {
      // Initialize if missing
      await client.query('INSERT INTO reward_points (customer_id) VALUES ($1)', [customer.id]);
      const newRp = await client.query(
        `SELECT rp.*, c.referral_code
         FROM reward_points rp
         JOIN customers c ON rp.customer_id = c.id
         WHERE rp.customer_id = $1`, 
        [customer.id]
      );
      return res.json({ success: true, data: newRp.rows[0] });
    }

    return res.json({ success: true, data: rp.rows[0] });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to load rewards',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  } finally {
    client.release();
  }
};

const getMyRewardTransactions = async (req, res) => {
  const client = await db.connect();
  try {
    const customer = await resolveCurrentCustomer(req);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer profile not found' });

    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = parseInt(req.query.offset) || 0;

    const tx = await client.query(
      `SELECT id, transaction_type, points, description, reference_type, reference_id, created_at
       FROM reward_transactions
       WHERE customer_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [customer.id, limit, offset]
    );

    return res.json({ success: true, data: tx.rows });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to load reward transactions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  } finally {
    client.release();
  }
};

const getRewardCatalog = async (req, res) => {
  const client = await db.connect();
  try {
    const rewards = await client.query(
      `SELECT id, name, description, points_cost, category, is_active, created_at
       FROM reward_redemptions
       WHERE is_active = true
       ORDER BY points_cost ASC`
    );
    return res.json({ success: true, data: rewards.rows });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to load reward catalog',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  } finally {
    client.release();
  }
};

const redeemReward = async (req, res) => {
  try {
    const customer = await resolveCurrentCustomer(req);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer profile not found' });

    const { reward_id } = req.body || {};
    if (!reward_id) return res.status(400).json({ success: false, message: 'reward_id is required' });

    const result = await RewardService.requestRedemption(customer.id, reward_id);
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const transferPoints = async (req, res) => {
  try {
    const customer = await resolveCurrentCustomer(req);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer profile not found' });

    const { target, amount, note } = req.body || {};
    if (!target || !amount) {
      return res.status(400).json({ success: false, message: 'Target and amount are required' });
    }

    const result = await RewardService.transferPoints(customer.id, target, parseInt(amount), note);
    return res.json({ 
      success: true, 
      message: `Berhasil mengirim ${amount} poin ke ${result.targetName}` 
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const referCustomer = async (req, res) => {
  try {
    const customer = await resolveCurrentCustomer(req);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer profile not found' });

    const result = await RewardService.referCustomer(customer.id, req.body);
    return res.json({ 
      success: true, 
      message: 'Pelanggan baru berhasil didaftarkan. Poin akan diberikan setelah aktivasi.',
      data: result 
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyRedemptions = async (req, res) => {
  const client = await db.connect();
  try {
    const customer = await resolveCurrentCustomer(req);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer profile not found' });

    const rows = await client.query(
      `SELECT rd.id, rd.redemption_number, rd.status, rd.request_date, rd.completed_date, rd.rejection_reason,
              rr.name as reward_name, rr.points_cost, rr.category
       FROM redemption_requests rd
       JOIN reward_redemptions rr ON rd.reward_id = rr.id
       WHERE rd.customer_id = $1
       ORDER BY rd.request_date DESC
       LIMIT 50`,
      [customer.id]
    );

    return res.json({ success: true, data: rows.rows });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to load redemptions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  } finally {
    client.release();
  }
};

module.exports = {
  getMyRewards,
  getMyRewardTransactions,
  getRewardCatalog,
  redeemReward,
  getMyRedemptions,
  transferPoints,
  referCustomer
};
