const db = require('../config/database');
const CustomerService = require('../services/customer.service');

async function resolveCurrentCustomer(req) {
  return CustomerService.findCustomerForUser({
    email: req.user?.email,
    full_name: req.user?.full_name,
    phone: req.user?.phone,
  });
}

async function ensureRewardAccount(client, customerId) {
  await client.query(
    `INSERT INTO reward_points (customer_id)
     VALUES ($1)
     ON CONFLICT (customer_id) DO NOTHING`,
    [customerId]
  );
}

const getMyRewards = async (req, res) => {
  const client = await db.connect();
  try {
    const customer = await resolveCurrentCustomer(req);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer profile not found' });

    await ensureRewardAccount(client, customer.id);

    const rp = await client.query(
      `SELECT customer_id, points_balance, total_points_earned, total_points_redeemed, redemption_count, tier, status, last_activity
       FROM reward_points
       WHERE customer_id = $1`,
      [customer.id]
    );

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

    await ensureRewardAccount(client, customer.id);

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
  const client = await db.connect();
  try {
    const customer = await resolveCurrentCustomer(req);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer profile not found' });

    const { reward_id } = req.body || {};
    if (!reward_id) return res.status(400).json({ success: false, message: 'reward_id is required' });

    await client.query('BEGIN');

    await ensureRewardAccount(client, customer.id);

    const rewardRes = await client.query(
      `SELECT id, name, points_cost, is_active
       FROM reward_redemptions
       WHERE id = $1`,
      [reward_id]
    );
    const reward = rewardRes.rows[0];
    if (!reward || !reward.is_active) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Reward not available' });
    }

    const rpRes = await client.query(
      `SELECT points_balance
       FROM reward_points
       WHERE customer_id = $1
       FOR UPDATE`,
      [customer.id]
    );
    const balance = parseInt(rpRes.rows[0]?.points_balance || 0);
    const cost = parseInt(reward.points_cost);

    if (balance < cost) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Insufficient points' });
    }

    const reqRes = await client.query(
      `INSERT INTO redemption_requests (customer_id, reward_id, points_spent, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING *`,
      [customer.id, reward.id, cost]
    );
    const redemptionRequest = reqRes.rows[0];

    await client.query(
      `UPDATE reward_points
       SET points_balance = points_balance - $1,
           total_points_redeemed = total_points_redeemed + $1,
           redemption_count = redemption_count + 1,
           last_activity = NOW(),
           updated_at = NOW()
       WHERE customer_id = $2`,
      [cost, customer.id]
    );

    await client.query(
      `INSERT INTO reward_transactions (customer_id, transaction_type, points, description, reference_type, reference_id)
       VALUES ($1, 'redeem', $2, $3, 'redemption_request', $4)`,
      [customer.id, cost, `Redeem: ${reward.name}`, redemptionRequest.id]
    );

    await client.query('COMMIT');

    return res.json({ success: true, data: redemptionRequest });
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch {
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to redeem reward',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  } finally {
    client.release();
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
};

