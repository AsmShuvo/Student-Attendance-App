import { db } from "@/app/utils";
import { ATTENDANCE, STUDENTS } from "@/app/utils/schema";
import { eq, or, isNull, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const grade = searchParams.get("grade");
  const month = searchParams.get("month"); // "YYYY-MM-DD" but ekhane just month info use korte paro

  if (!grade || !month) {
    return NextResponse.json(
      { error: "Missing grade or month" },
      { status: 400 }
    );
  }

  const result = await db
    .select({
      name: STUDENTS.name,
      present: ATTENDANCE.present,
      day: ATTENDANCE.day,
      date: ATTENDANCE.date,
      grade: STUDENTS.grade,
      studentId: STUDENTS.id,
      attendanceId: ATTENDANCE.id,
    })
    .from(STUDENTS)
    .leftJoin(ATTENDANCE, eq(STUDENTS.id, ATTENDANCE.studentId))
    .where(eq(STUDENTS.grade, grade));

  return NextResponse.json(result);
}

export async function POST(req) {
  try {
    const data = await req.json();

    const result = await db
      .insert(ATTENDANCE)
      .values({
        studentId: Number(data.studentId),
        present: !!data.present,
        day: Number(data.day),
        date: data.date, // "YYYY-MM-DD"
      })
      .returning();

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("POST /api/attendance error:", err);
    return NextResponse.json(
      { error: "Failed to mark attendance" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  const date = searchParams.get("date");
  const day = searchParams.get("day");

  if (!studentId || !date || !day) {
    return NextResponse.json(
      { error: "Missing studentId, date or day parameter" },
      { status: 400 }
    );
  }

  const result = await db
    .delete(ATTENDANCE)
    .where(
      and(
        eq(ATTENDANCE.studentId, Number(studentId)),
        eq(ATTENDANCE.date, date),
        eq(ATTENDANCE.day, Number(day))
      )
    );

  return NextResponse.json(result);
}

