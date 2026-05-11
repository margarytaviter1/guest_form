import { Pool as NeonPool } from "@neondatabase/serverless";
import { Pool as PgPool } from "pg";

const isNeon = process.env.DATABASE_URL?.includes("neon.tech");

const pool = isNeon
  ? new NeonPool({ connectionString: process.env.DATABASE_URL })
  : new PgPool({ connectionString: process.env.DATABASE_URL });

export default pool;
