import { db } from "@/app/utils";
import { STUDENTS } from "@/app/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const data = await req.json();
  //   console.log(data);
  const result = await db.insert(STUDENTS).values({
    name: data?.name,
    grade: data?.grade,
    address: data?.address,
    contact: data?.contact,
  });

  return NextResponse.json(result);
}

export async function GET(req, res) {
  const result = await db.select().from(STUDENTS);
  return NextResponse.json(result);
}

export async function DELETE(req, res) {
  const id = req.nextUrl.searchParams.get("id");
  const result = await db.delete(STUDENTS).where(eq(STUDENTS.id, id));
  return NextResponse.json(result);
}
