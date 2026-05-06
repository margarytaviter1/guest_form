const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://guestapp:guestapp123@localhost:5432/guestform",
});

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS guest_preferences (
        id SERIAL PRIMARY KEY,
        booking_id VARCHAR(100) NOT NULL,
        arrival_time VARCHAR(10) NOT NULL DEFAULT '14:00',
        meal_plan VARCHAR(20) NOT NULL DEFAULT 'none',
        meal_guests INTEGER,
        active_bicycle BOOLEAN NOT NULL DEFAULT FALSE,
        active_sup BOOLEAN NOT NULL DEFAULT FALSE,
        active_garden BOOLEAN NOT NULL DEFAULT FALSE,
        need_baby_cot BOOLEAN NOT NULL DEFAULT FALSE,
        hygiene_slippers BOOLEAN NOT NULL DEFAULT TRUE,
        hygiene_toothbrush BOOLEAN NOT NULL DEFAULT TRUE,
        hygiene_shampoo BOOLEAN NOT NULL DEFAULT TRUE,
        hygiene_soap BOOLEAN NOT NULL DEFAULT TRUE,
        comments TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log("✅ Migration complete – guest_preferences table ready.");
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
