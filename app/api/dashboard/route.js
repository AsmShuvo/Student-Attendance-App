import { db } from "@/app/utils";
import { ATTENDANCE, STUDENTS } from "@/app/utils/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  const searchParams = new URL(req.url).searchParams;
  const date = searchParams.get("date");
  const grade = searchParams.get("grade");

  if (!date || !grade) {
    return NextResponse.json(
      { error: "Missing date or grade parameter" },
      { status: 400 }
    );
  }

  const result = await db
    .select({
      day: ATTENDANCE.day,
      // ✅ JS version – no <number> here
      presentCount: sql`count(*)`,
      // if you only want present=true rows:
      // presentCount: sql`sum(case when ${ATTENDANCE.present} then 1 else 0 end)`,
    })
    .from(ATTENDANCE)
    .innerJoin(STUDENTS, eq(ATTENDANCE.studentId, STUDENTS.id))
    .where(
      and(
        eq(ATTENDANCE.date, date),
        eq(STUDENTS.grade, grade)
      )
    )
    .groupBy(ATTENDANCE.day)
    .orderBy(desc(ATTENDANCE.day))
    .limit(7);

  return NextResponse.json(result);
}
