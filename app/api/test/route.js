import { db, auth } from "@/firebase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test auth
    const listUsersResult = await auth.listUsers(1);
    
    // Test db
    const usersRef = await db.collection("users").limit(1).get();
    
    return NextResponse.json({
      success: true,
      authWorks: !!listUsersResult,
      dbWorks: !usersRef.empty || usersRef.empty, // Just checks if it resolved
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
