const db = require('../config/database');
const SettingService = require('../services/setting.service');


/**
 * Get reward points statistics
 */
async function getRewardStats() {
  const client = await db.connect();
  
  try {
    // Total points issued
    const totalIssuedResult = await client.query(`
      SELECT COALESCE(SUM(points), 0) as total_issued
      FROM reward_transactions
      WHERE transaction_type = 'earn'
    `);
    
    // Total points redeemed
    const totalRedeemedResult = await client.query(`
      SELECT COALESCE(SUM(points), 0) as total_redeemed
      FROM reward_transactions
      WHERE transaction_type = 'redeem'
    `);
    
    // Active members
    const activeMembersResult = await client.query(`
      SELECT COUNT(DISTINCT customer_id) as active_members
      FROM reward_points
      WHERE points_balance > 0
    `);
    
    // Average points per customer
    const avgPointsResult = await client.query(`
      SELECT COALESCE(AVG(points_balance), 0) as avg_points
      FROM reward_points
      WHERE points_balance > 0
    `);
    
    const totalIssued = parseInt(totalIssuedResult.rows[0].total_issued);
    const totalRedeemed = parseInt(totalRedeemedResult.rows[0].total_redeemed);
    const outstanding = totalIssued - totalRedeemed;
    const redemptionRate = totalIssued > 0 ? ((totalRedeemed / totalIssued) * 100).toFixed(1) : 0;
    
    return {
      totalPointsIssued: totalIssued,
      totalPointsRedeemed: totalRedeemed,
      totalPointsOutstanding: outstanding,
      activeMembers: parseInt(activeMembersResult.rows[0].active_members),
      redemptionRate: `${redemptionRate}%`,
      avgPointsPerCustomer: Math.round(parseInt(avgPointsResult.rows[0].avg_points)),
    };
  } finally {
    client.release();
  }
}

/**
 * Get customer reward points
 */
async function getCustomerPoints(page = 1, limit = 20, search = '') {
  const client = await db.connect();
  
  try {
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT 
        c.id,
        c.name,
        c.email,
        c.phone,
        rp.points_balance,
        rp.tier,
        rp.status,
        rp.last_activity,
        rp.created_at
      FROM reward_points rp
      JOIN customers c ON rp.customer_id = c.id
    `;
    
    let countQuery = `
      SELECT COUNT(*) as total
      FROM reward_points rp
      JOIN customers c ON rp.customer_id = c.id
    `;
    
    const queryParams = [];
    let countParams = [];
    
    if (search) {
      query += ` WHERE c.name ILIKE $${queryParams.length + 1} OR c.email ILIKE $${queryParams.length + 1}`;
      countQuery += ` WHERE c.name ILIKE $1`;
      queryParams.push(`%${search}%`);
      countParams = [`%${search}%`];
    }
    
    query += ` ORDER BY rp.points_balance DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);
    
    const [pointsResult, countResult] = await Promise.all([
      client.query(query, queryParams),
      client.query(countQuery, countParams),
    ]);
    
    return {
      data: pointsResult.rows,
      total: parseInt(countResult.rows[0].total),
      page,
      limit,
      totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit),
    };
  } finally {
    client.release();
  }
}

/**
 * Get earning rules
 */
async function getEarningRules() {
  const client = await db.connect();
  
  try {
    const result = await client.query(`
      SELECT * FROM reward_earning_rules
      ORDER BY id ASC
    `);
    
    return result.rows;
  } finally {
    client.release();
  }
}

/**
 * Create earning rule
 */
async function createEarningRule(ruleData) {
  const client = await db.connect();
  
  try {
    const { action_name, points, description, is_active } = ruleData;
    
    const result = await client.query(`
      INSERT INTO reward_earning_rules (action_name, points, description, is_active)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [action_name, points, description, is_active !== false]);
    
    return result.rows[0];
  } finally {
    client.release();
  }
}

/**
 * Update earning rule
 */
async function updateEarningRule(id, ruleData) {
  const client = await db.connect();
  
  try {
    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(ruleData || {})) {
      if (!['action_name', 'points', 'description', 'is_active'].includes(key)) continue;
      fields.push(`${key} = $${idx++}`);
      values.push(value);
    }

    if (fields.length === 0) return null;

    values.push(id);
    const result = await client.query(
      `
      UPDATE reward_earning_rules
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${idx}
      RETURNING *
      `,
      values
    );

    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

/**
 * Get redemption rewards
 */
async function getRedemptionRewards() {
  const client = await db.connect();
  
  try {
    const result = await client.query(`
      SELECT * FROM reward_redemptions
      WHERE is_active = true
      ORDER BY points_cost ASC
    `);
    
    return result.rows;
  } finally {
    client.release();
  }
}

/**
 * Get all redemption rewards (admin)
 */
async function getAllRedemptionRewards() {
  const client = await db.connect();
  
  try {
    const result = await client.query(`
      SELECT * FROM reward_redemptions
      ORDER BY is_active DESC, points_cost ASC
    `);
    
    return result.rows;
  } finally {
    client.release();
  }
}

/**
 * Create redemption reward
 */
async function createRedemptionReward(rewardData) {
  const client = await db.connect();
  
  try {
    const { name, description, points_cost, category, is_active } = rewardData;
    
    const result = await client.query(`
      INSERT INTO reward_redemptions (name, description, points_cost, category, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [name, description, points_cost, category, is_active !== false]);
    
    return result.rows[0];
  } finally {
    client.release();
  }
}

/**
 * Update redemption reward
 */
async function updateRedemptionReward(id, rewardData) {
  const client = await db.connect();
  
  try {
    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(rewardData || {})) {
      if (!['name', 'description', 'points_cost', 'category', 'is_active'].includes(key)) continue;
      fields.push(`${key} = $${idx++}`);
      values.push(value);
    }

    if (fields.length === 0) return null;

    values.push(id);
    const result = await client.query(
      `
      UPDATE reward_redemptions
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${idx}
      RETURNING *
      `,
      values
    );

    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

/**
 * Get redemption requests
 */
async function getRedemptions(page = 1, limit = 20, status = null) {
  const client = await db.connect();
  
  try {
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT 
        rd.id,
        rd.redemption_number,
        c.name as customer_name,
        c.email as customer_email,
        rr.name as reward_name,
        rd.points_spent,
        rd.status,
        rd.request_date,
        rd.completed_date,
        rd.rejection_reason,
        rr.category
      FROM redemption_requests rd
      JOIN customers c ON rd.customer_id = c.id
      JOIN reward_redemptions rr ON rd.reward_id = rr.id
    `;
    
    let countQuery = `
      SELECT COUNT(*) as total
      FROM redemption_requests rd
      JOIN customers c ON rd.customer_id = c.id
      JOIN reward_redemptions rr ON rd.reward_id = rr.id
    `;
    
    const queryParams = [];
    
    if (status) {
      query += ` WHERE rd.status = $${queryParams.length + 1}`;
      countQuery += ` WHERE rd.status = $1`;
      queryParams.push(status);
    }
    
    query += ` ORDER BY rd.request_date DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);
    
    const [result, countResult] = await Promise.all([
      client.query(query, queryParams),
      client.query(countQuery, status ? [status] : []),
    ]);
    
    return {
      data: result.rows,
      total: parseInt(countResult.rows[0].total),
      page,
      limit,
      totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit),
    };
  } finally {
    client.release();
  }
}

/**
 * Process redemption request (approve/reject)
 */
async function processRedemption(redemptionId, status, reason = null) {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');
    
    // Get redemption details
    const redemptionResult = await client.query(`
      SELECT * FROM redemption_requests WHERE id = $1
    `, [redemptionId]);
    
    if (redemptionResult.rows.length === 0) {
      throw new Error('Redemption not found');
    }
    
    const redemption = redemptionResult.rows[0];
    
    if (status === 'approved') {
      // Update redemption status
      await client.query(`
        UPDATE redemption_requests
        SET status = 'completed', completed_date = NOW()
        WHERE id = $1
      `, [redemptionId]);
      
    } else if (status === 'rejected') {
      // Update redemption status and return points
      await client.query(`
        UPDATE redemption_requests
        SET status = 'rejected', rejection_reason = $1
        WHERE id = $2
      `, [reason, redemptionId]);
      
      // Return points to customer
      await client.query(`
        UPDATE reward_points
        SET points_balance = points_balance + $1, updated_at = NOW()
        WHERE customer_id = $2
      `, [redemption.points_spent, redemption.customer_id]);
    }
    
    await client.query('COMMIT');
    
    return { success: true };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get leaderboard
 */
async function getLeaderboard(page = 1, limit = 50, tier = null) {
  const client = await db.connect();
  
  try {
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT 
        c.id,
        c.name,
        c.email,
        c.phone,
        rp.points_balance,
        rp.tier,
        rp.total_points_earned,
        rp.total_points_redeemed,
        rp.redemption_count,
        c.join_date,
        EXTRACT(EPOCH FROM (NOW() - c.join_date)) / 2592000 as months_active
      FROM reward_points rp
      JOIN customers c ON rp.customer_id = c.id
      WHERE rp.status = 'active'
    `;
    
    let countQuery = `
      SELECT COUNT(*) as total
      FROM reward_points rp
      JOIN customers c ON rp.customer_id = c.id
      WHERE rp.status = 'active'
    `;
    
    const queryParams = [];
    
    if (tier) {
      query += ` AND rp.tier = $${queryParams.length + 1}`;
      countQuery += ` AND rp.tier = $1`;
      queryParams.push(tier);
    }
    
    query += ` ORDER BY rp.points_balance DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);
    
    const [result, countResult] = await Promise.all([
      client.query(query, queryParams.length > 0 ? queryParams : []),
      client.query(countQuery, tier ? [tier] : []),
    ]);
    
    // Add rank
    const data = result.rows.map((row, index) => ({
      ...row,
      rank: offset + index + 1,
      months_active: Math.round(row.months_active),
    }));
    
    return {
      data,
      total: parseInt(countResult.rows[0].total),
      page,
      limit,
      totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit),
    };
  } finally {
    client.release();
  }
}

/**
 * Get tier distribution
 */
async function getTierDistribution() {
  const client = await db.connect();
  
  try {
    const result = await client.query(`
      SELECT 
        tier,
        COUNT(*) as count
      FROM reward_points
      WHERE status = 'active'
      GROUP BY tier
      ORDER BY 
        CASE tier
          WHEN 'Platinum' THEN 1
          WHEN 'Gold' THEN 2
          WHEN 'Silver' THEN 3
          WHEN 'Bronze' THEN 4
        END
    `);
    
    return result.rows;
  } finally {
    client.release();
  }
}

/**
 * Adjust customer points (manual)
 */
async function adjustCustomerPoints(customerId, points, reason) {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');
    
    // Update points balance
    const result = await client.query(`
      UPDATE reward_points
      SET points_balance = points_balance + $1,
          last_activity = NOW(),
          updated_at = NOW()
      WHERE customer_id = $2
      RETURNING *
    `, [points, customerId]);
    
    if (result.rows.length === 0) {
      throw new Error('Customer reward account not found');
    }
    
    // Record transaction
    await client.query(`
      INSERT INTO reward_transactions (
        customer_id, 
        transaction_type, 
        points, 
        description,
        reference_type
      )
      VALUES ($1, $2, $3, $4, 'manual_adjustment')
    `, [
      customerId,
      points > 0 ? 'earn' : 'deduct',
      Math.abs(points),
      reason,
    ]);
    
    await client.query('COMMIT');
    
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function getSettings() {
  return await SettingService.getByCategory('rewards');
}

async function updateSettings(settings) {
  if (!Array.isArray(settings)) {
    throw new Error('Settings must be an array of {key, value}');
  }
  return await SettingService.updateBatch(settings);
}

module.exports = {
  getRewardStats,
  getCustomerPoints,
  getEarningRules,
  createEarningRule,
  updateEarningRule,
  getRedemptionRewards,
  getAllRedemptionRewards,
  createRedemptionReward,
  updateRedemptionReward,
  getRedemptions,
  processRedemption,
  getLeaderboard,
  getTierDistribution,
  adjustCustomerPoints,
  getSettings,
  updateSettings
};
