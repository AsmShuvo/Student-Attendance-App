import { NextResponse } from "next/server";
import { db } from "@/app/utils";
import { GRADES } from "@/app/utils/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const grades = await db
      .select({
        id: GRADES.id,
        grade: GRADES.grade,
      })
      .from(GRADES)
      .orderBy(asc(GRADES.grade));

    return NextResponse.json(grades);
  } catch (err) {
    console.error("GET /api/grade error:", err);
    return NextResponse.json(
      { error: "Failed to load grades" },
      { status: 500 }
    );
  }
}
