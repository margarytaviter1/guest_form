import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { preferencesSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await preferencesSchema.validate(body, { abortEarly: false });

    const result = await pool.query(
      `INSERT INTO guest_preferences
        (booking_id, arrival_time, meal_plan, meal_guests,
         active_bicycle, active_sup, active_garden,
         need_baby_cot,
         hygiene_slippers, hygiene_toothbrush, hygiene_shampoo, hygiene_soap,
         comments)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING id`,
      [
        data.bookingId,
        data.arrivalTime,
        data.mealPlan,
        data.mealPlan !== "none" ? data.mealGuests : null,
        data.activeBicycle ?? false,
        data.activeSup ?? false,
        data.activeGarden ?? false,
        data.needBabyCot ?? false,
        data.hygieneSlippers ?? false,
        data.hygieneToothbrush ?? false,
        data.hygieneShampoo ?? false,
        data.hygieneSoap ?? false,
        data.comments || null,
      ],
    );

    return NextResponse.json({ success: true, id: result.rows[0].id }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "ValidationError") {
      return NextResponse.json(
        { success: false, errors: (err as Error & { errors: string[] }).errors },
        { status: 400 },
      );
    }
    console.error("Preferences submission error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  const result = await pool.query("SELECT * FROM guest_preferences ORDER BY created_at DESC");
  return NextResponse.json(result.rows);
}
