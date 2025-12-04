import { db } from "@/app/utils";
import { GRADES } from "@/app/utils/schema";
import { NextResponse } from "next/server";

export async function GET(req) {
  const result = await db.select().from(GRADES);

  return NextResponse.json(result);
}
