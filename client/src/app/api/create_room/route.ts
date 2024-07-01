// app/api/response/route.ts

// todo: 変数名修正

import { NextRequest, NextResponse } from "next/server";
import { create_room } from "./service";

export async function POST(request: NextRequest) {
  console.log("Request received: create_room");
  const { userEmail } = await request.json();

  const room_id = await create_room(userEmail);

  console.log("ROOM_ID:", room_id)
  const response = NextResponse.json({
    data: { room_id: room_id },
  });

  return response;
}
