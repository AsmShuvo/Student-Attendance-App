import { db } from "@/app/utils";
import { ATTENDANCE, STUDENTS } from "@/app/utils/schema";
import { eq, or, isNull, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  const { searchParams } = new URL(req.url);
  const grade = searchParams.get("grade");
  const month = searchParams.get("month");

  console.log(grade + " " + month);

  if (!grade || !month) {
    console.log("Grade or month is not found");
    return NextResponse.json(
      { error: "Missing grade or month parameter" },
      { status: 400 }
    );
  }

  // const result = await db
  //   .select({
  //     name: STUDENTS.name,
  //     present: ATTENDANCE.present,
  //     day: ATTENDANCE.day,
  //     date: ATTENDANCE.date,
  //     grade: STUDENTS.grade,
  //     studentId: STUDENTS.id,
  //     attendanceId: ATTENDANCE.id,
  //   })
  //   .from(STUDENTS)
  //   .leftJoin(ATTENDANCE, eq(STUDENTS.id, ATTENDANCE.studentId))
  //   .where(
  //     and(
  //       eq(STUDENTS.grade, grade),
  //       or(
  //         eq(ATTENDANCE.date, month),
  //         isNull(ATTENDANCE.date)
  //       )
  //     )
  //   );

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
