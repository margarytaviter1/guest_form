import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import logger from "@/lib/logger";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin";

export async function GET(req: NextRequest) {
  const password = req.headers.get("x-admin-password");

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await pool.query(
      `SELECT id, booking_id, arrival_time, meal_plan, meal_guests,
              active_bicycle, active_sup, active_garden, active_excursions, active_mushrooms,
              need_baby_cot,
              hygiene_slippers, hygiene_toothbrush, hygiene_shampoo, hygiene_soap,
              comments, created_at
       FROM guest_preferences
       ORDER BY created_at DESC`,
    );

    logger.info({ count: result.rows.length }, "Admin fetched all submissions");
    return NextResponse.json({ submissions: result.rows });
  } catch (err) {
    logger.error({ err }, "Failed to fetch submissions");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
