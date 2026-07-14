'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION generate_payment(user_id_input UUID, month_input DATE)
      RETURNS VOID AS $$
      BEGIN
          -- Check if a payment already exists for the given user and month
          IF EXISTS (
              SELECT 1
              FROM "payment"
              WHERE user_id = user_id_input
              AND from_date >= DATE_TRUNC('month', month_input)
              AND from_date < DATE_TRUNC('month', month_input) + INTERVAL '1 month'
          ) THEN
              -- Update the existing payment
              UPDATE "payment"
              SET
                  to_date = (
                      SELECT MAX(buying_date)
                      FROM "product_detail"
                      WHERE user_id = user_id_input
                      AND buying_date >= DATE_TRUNC('month', month_input)
                      AND buying_date < DATE_TRUNC('month', month_input) + INTERVAL '1 month'
                  ),
                  total_liter = (
                      SELECT SUM(total_liters)
                      FROM "product_detail"
                      WHERE user_id = user_id_input
                      AND buying_date >= DATE_TRUNC('month', month_input)
                      AND buying_date < DATE_TRUNC('month', month_input) + INTERVAL '1 month'
                  ),
                  total_amount = (
                      SELECT SUM(total_liters * perliter_rate)
                      FROM "product_detail"
                      WHERE user_id = user_id_input
                      AND buying_date >= DATE_TRUNC('month', month_input)
                      AND buying_date < DATE_TRUNC('month', month_input) + INTERVAL '1 month'
                  )
              WHERE user_id = user_id_input
              AND from_date >= DATE_TRUNC('month', month_input)
              AND from_date < DATE_TRUNC('month', month_input) + INTERVAL '1 month';
          ELSE
              -- Insert a new payment
              INSERT INTO "payment" (
                  uuid, user_id, product_name, perliter_rate, from_date, to_date, total_liter, total_amount,
                  advance_payment, partial_payment, full_payment, payment_status
              )
              SELECT
                  gen_random_uuid(), -- Generate a UUID for the uuid column
                  user_id,
                  product_name,
                  perliter_rate,
                  DATE_TRUNC('month', month_input),
                  MAX(buying_date),
                  SUM(total_liters),
                  SUM(total_liters * perliter_rate),
                  0, -- advance_payment
                  0, -- partial_payment
                  0, -- full_payment
                  'pending' -- payment_status
              FROM "product_detail"
              WHERE user_id = user_id_input
              AND buying_date >= DATE_TRUNC('month', month_input)
              AND buying_date < DATE_TRUNC('month', month_input) + INTERVAL '1 month'
              GROUP BY user_id, product_name, perliter_rate;
          END IF;
      END;
      $$ LANGUAGE plpgsql;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS generate_payment(UUID, DATE);
    `);
  }
};