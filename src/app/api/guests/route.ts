import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { preferencesSchema } from "@/lib/validation";
import logger from "@/lib/logger";

export async function POST(req: NextRequest) {
  const start = Date.now();
  try {
    const body = await req.json();
    logger.info({ method: "POST", path: "/api/guests" }, "Received guest preferences submission");
    const data = await preferencesSchema.validate(body, { abortEarly: false });

    const result = await pool.query(
      `INSERT INTO guest_preferences
        (booking_id, arrival_time, meal_plan, meal_guests,
         active_bicycle, active_sup, active_garden, active_excursions, active_mushrooms,
         need_baby_cot,
         hygiene_slippers, hygiene_toothbrush, hygiene_shampoo, hygiene_soap,
         comments)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING id`,
      [
        data.bookingId,
        data.arrivalTime,
        data.mealPlan,
        data.mealPlan !== "none" ? data.mealGuests : null,
        data.activeBicycle ?? false,
        data.activeSup ?? false,
        data.activeGarden ?? false,
        data.activeExcursions ?? false,
        data.activeMushrooms ?? false,
        data.needBabyBed ?? false,
        data.hygieneSlippers ?? false,
        data.hygieneToothbrush ?? false,
        data.hygieneShampoo ?? false,
        data.hygieneSoap ?? false,
        data.comments || null,
      ],
    );

    logger.info(
      {
        method: "POST",
        path: "/api/guests",
        id: result.rows[0].id,
        durationMs: Date.now() - start,
      },
      "Guest preferences saved successfully",
    );
    return NextResponse.json({ success: true, id: result.rows[0].id }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "ValidationError") {
      logger.warn(
        {
          method: "POST",
          path: "/api/guests",
          errors: (err as Error & { errors: string[] }).errors,
          durationMs: Date.now() - start,
        },
        "Validation failed for guest preferences",
      );
      return NextResponse.json(
        { success: false, errors: (err as Error & { errors: string[] }).errors },
        { status: 400 },
      );
    }
    logger.error(
      { err, method: "POST", path: "/api/guests", durationMs: Date.now() - start },
      "Preferences submission error",
    );
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  const start = Date.now();
  try {
    const result = await pool.query("SELECT * FROM guest_preferences ORDER BY created_at DESC");
    logger.info(
      {
        method: "GET",
        path: "/api/guests",
        count: result.rows.length,
        durationMs: Date.now() - start,
      },
      "Guest preferences retrieved",
    );
    return NextResponse.json(result.rows);
  } catch (err) {
    logger.error(
      { err, method: "GET", path: "/api/guests", durationMs: Date.now() - start },
      "Failed to retrieve guest preferences",
    );
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
