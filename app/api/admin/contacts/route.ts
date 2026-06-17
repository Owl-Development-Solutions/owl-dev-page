import { NextResponse } from "next/server";
import { getSubmissions } from "@/lib/submissions";

export async function GET(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { success: false, message: "Admin access is not configured." },
      { status: 503 },
    );
  }

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (token !== adminPassword) {
    return NextResponse.json(
      { success: false, message: "Unauthorized." },
      { status: 401 },
    );
  }

  const submissions = await getSubmissions();

  return NextResponse.json({ success: true, submissions });
}
