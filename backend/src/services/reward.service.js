const db = require('../config/database');
const SettingService = require('./setting.service');

const RewardService = {
  /**
   * Get earnings rules from settings/db
   */
  async getRules() {
    const result = await db.query('SELECT * FROM reward_earning_rules WHERE is_active = true');
    return result.rows;
  },

  /**
   * Add points to a customer
   */
  async earnPoints(customerId, points, type, description, referenceId = null) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      // Ensure account exists
      await client.query(`
        INSERT INTO reward_points (customer_id, points_balance, total_points_earned)
        VALUES ($1, 0, 0)
        ON CONFLICT (customer_id) DO NOTHING
      `, [customerId]);

      // Update balance
      const result = await client.query(`
        UPDATE reward_points
        SET points_balance = points_balance + $1,
            total_points_earned = total_points_earned + $1,
            last_activity = NOW(),
            updated_at = NOW()
        WHERE customer_id = $2
        RETURNING points_balance, tier
      `, [points, customerId]);

      // Record transaction
      await client.query(`
        INSERT INTO reward_transactions (
          customer_id, transaction_type, points, description, reference_type, reference_id
        )
        VALUES ($1, 'earn', $2, $3, $4, $5)
      `, [customerId, points, description, type, referenceId]);

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Automated earn point based on payment
   */
  async recordPaymentReward(customerId, amount, invoiceId) {
    const settings = await SettingService.getCategoryMap('rewards');
    const pointsPer1000 = parseInt(settings.points_per_1000_payment || '0');
    
    if (pointsPer1000 > 0) {
      const points = Math.floor(amount / 1000) * pointsPer1000;
      if (points > 0) {
        return await this.earnPoints(customerId, points, 'monthly_payment', `Points earned from payment of Rp ${amount.toLocaleString()}`, invoiceId);
      }
    }
    return null;
  },

  /**
   * Transfer points between customers (E-Wallet style)
   */
  async transferPoints(fromCustomerId, toCustomerPhoneOrEmail, amount, note = '') {
    const client = await db.connect();
    try {
      const settings = await SettingService.getCategoryMap('rewards');
      if (settings.points_transfer_enabled !== 'true') {
        throw new Error('Point transfer is currently disabled by administrator');
      }

      if (amount <= 0) throw new Error('Amount must be greater than zero');

      await client.query('BEGIN');

      // 1. Find target customer
      const targetResult = await client.query(`
        SELECT id, name FROM customers 
        WHERE phone = $1 OR email = $1 
        LIMIT 1
      `, [toCustomerPhoneOrEmail]);

      if (targetResult.rows.length === 0) {
        throw new Error('Target customer not found. Ensure the phone or email is correct.');
      }
      const target = targetResult.rows[0];
      if (target.id === fromCustomerId) throw new Error('Cannot transfer to yourself');

      // 2. Check sender balance
      const senderResult = await client.query(`
        SELECT points_balance FROM reward_points WHERE customer_id = $1
      `, [fromCustomerId]);

      const balance = senderResult.rows[0]?.points_balance || 0;
      const fee = parseInt(settings.points_transfer_fee || '0');
      const totalCost = amount + fee;

      if (balance < totalCost) throw new Error(`Insufficient balance. You need ${totalCost} points (including ${fee} fee).`);

      // 3. Deduct from sender
      await client.query(`
        UPDATE reward_points 
        SET points_balance = points_balance - $1, 
            last_activity = NOW() 
        WHERE customer_id = $2
      `, [totalCost, fromCustomerId]);

      await client.query(`
        INSERT INTO reward_transactions (customer_id, transaction_type, points, description, reference_type)
        VALUES ($1, 'deduct', $2, $3, 'transfer_send')
      `, [fromCustomerId, totalCost, `Transfer to ${target.name}. Note: ${note} (Fee: ${fee})`]);

      // 4. Add to receiver
      await client.query(`
        INSERT INTO reward_points (customer_id, points_balance, total_points_earned)
        VALUES ($1, $2, $2)
        ON CONFLICT (customer_id) DO UPDATE 
        SET points_balance = reward_points.points_balance + $2,
            total_points_earned = reward_points.total_points_earned + $2,
            last_activity = NOW()
      `, [target.id, amount]);

      await client.query(`
        INSERT INTO reward_transactions (customer_id, transaction_type, points, description, reference_type)
        VALUES ($1, 'earn', $2, $3, 'transfer_receive')
      `, [target.id, amount, `Received points from someone. Note: ${note}`]);

      await client.query('COMMIT');
      return { success: true, targetName: target.name };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Redeem points
   */
  async requestRedemption(customerId, rewardId) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      const settings = await SettingService.getCategoryMap('rewards');
      const mode = settings.redemption_window || 'always';

      if (mode === 'disabled') {
        throw new Error('Redemption is currently closed.');
      }

      if (mode === 'holiday_only') {
        const now = new Date();
        const startRaw = settings.redemption_holiday_start; // e.g. "12-20" or "2024-12-20"
        const endRaw = settings.redemption_holiday_end;

        if (startRaw && endRaw) {
          // Simplified holiday check logic
          const currentYear = now.getFullYear();
          const startDate = new Date(`${currentYear}-${startRaw}`);
          const endDate = new Date(`${currentYear}-${endRaw}`);
          
          if (now < startDate || now > endDate) {
            throw new Error(`Redemption only available from ${startRaw} to ${endRaw}`);
          }
        } else {
          throw new Error('Redemption window is restricted but dates are not configured.');
        }
      }

      const rewardResult = await client.query('SELECT * FROM reward_redemptions WHERE id = $1 AND is_active = true', [rewardId]);
      if (rewardResult.rows.length === 0) throw new Error('Reward not found or inactive');
      const reward = rewardResult.rows[0];

      const pointsResult = await client.query('SELECT points_balance FROM reward_points WHERE customer_id = $1', [customerId]);
      const balance = pointsResult.rows[0]?.points_balance || 0;

      if (balance < reward.points_cost) throw new Error(`Insufficient points. You need ${reward.points_cost} points.`);

      // Deduct balance
      await client.query(`
        UPDATE reward_points 
        SET points_balance = points_balance - $1,
            total_points_redeemed = total_points_redeemed + $1,
            redemption_count = redemption_count + 1,
            last_activity = NOW()
        WHERE customer_id = $2
      `, [reward.points_cost, customerId]);

      // Create request
      const reqResult = await client.query(`
        INSERT INTO redemption_requests (customer_id, reward_id, points_spent, status)
        VALUES ($1, $2, $3, 'pending')
        RETURNING *
      `, [customerId, rewardId, reward.points_cost]);

      // Record transaction
      await client.query(`
        INSERT INTO reward_transactions (customer_id, transaction_type, points, description, reference_type, reference_id)
        VALUES ($1, 'redeem', $2, $3, 'redemption', $4)
      `, [customerId, reward.points_cost, `Redeemed for ${reward.name}`, reqResult.rows[0].id]);

      await client.query('COMMIT');
      return reqResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Register a new customer via referral
   */
  async referCustomer(referrerId, customerData) {
    const { name, phone, email, address, package_id } = customerData;
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      
      const result = await client.query(`
        INSERT INTO customers (name, phone, email, address, package_id, referred_by, status)
        VALUES ($1, $2, $3, $4, $5, $6, 'pending')
        RETURNING *
      `, [name, phone, email, address, package_id, referrerId]);
      
      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Award points to the referrer when the referred customer becomes active
   */
  async checkAndAwardReferralPoints(newCustomerId) {
    const client = await db.connect();
    try {
      // 1. Check if this customer was referred
      const customerResult = await client.query(
        'SELECT id, name, referred_by, status FROM customers WHERE id = $1',
        [newCustomerId]
      );
      const customer = customerResult.rows[0];

      if (customer && customer.referred_by && customer.status === 'active') {
        const settings = await SettingService.getCategoryMap('rewards');
        const bonusPoints = parseInt(settings.referral_points || '0');

        if (bonusPoints > 0) {
          // Check if already awarded to prevent double awarding
          const alreadyResult = await client.query(
            "SELECT id FROM reward_transactions WHERE customer_id = $1 AND reference_type = 'referral' AND reference_id = $2",
            [customer.referred_by, newCustomerId]
          );

          if (alreadyResult.rows.length === 0) {
            await this.earnPoints(
              customer.referred_by,
              bonusPoints,
              'referral',
              `Bonus referral: ${customer.name} telah aktif`,
              newCustomerId
            );
          }
        }
      }
    } finally {
      client.release();
    }
  }
};

module.exports = RewardService;
