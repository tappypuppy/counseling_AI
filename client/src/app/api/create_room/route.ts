// app/api/response/route.ts

// todo: 変数名修正

import { NextRequest, NextResponse } from "next/server";
import DB from "@/class/DB";

export async function POST(request: NextRequest) {
  const { userEmail } = await request.json();

  const db = new DB();
  const roomId = await db.createRoom(userEmail);

  if (!roomId) {
    console.error("ERROR");
    return NextResponse.json({ status: "error" });
  }

  const response = NextResponse.json({
    data: { room_id: roomId },
  });

  return response;
}
