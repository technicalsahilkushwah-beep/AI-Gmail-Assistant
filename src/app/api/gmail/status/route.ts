import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { db } from "@/config/db";

export async function GET() {
  try {
    const session = await auth();

    const account = await db.collection("google_account").findOne(
      {
        authUserId: session?.user?.id,
      },
      { projection: { email: 1, _id: 0 } },
    );

    if (!account) {
      return NextResponse.json(
        {
          connected: false
        },
      );
    }
    return NextResponse.json({
      connected: Boolean(account.email),
      account: account.email,
    });
  } catch (error) {
    console.error("Gmail status lookup failed:", error);

    return NextResponse.json(
      { error: "Unable to check Gmail connection." },
      { status: 500 },
    );
  }
}
