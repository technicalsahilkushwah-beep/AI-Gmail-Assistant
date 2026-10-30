import { google } from "googleapis";
import { getGoogleOAuthClient } from "@/lib/google-oauth-client";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { db } from "@/config/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { to, subject, body: emailBody, confirmed } = body;

    if (confirmed !== true) {
      return NextResponse.json(
        { success: false, message: "Please confirm before sending." },
        { status: 400 },
      );
    }

    if (
      typeof to !== "string" ||
      typeof subject !== "string" ||
      typeof emailBody !== "string" ||
      !to.trim() ||
      !subject.trim() ||
      !emailBody.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Recipient, subject, and body are required.",
        },
        { status: 400 },
      );
    }

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please sign in first." },
        { status: 401 },
      );
    }

    const account = await db.collection("google_account").findOne({
      authUserId: session.user.id,
    });

    if (!account) {
      return NextResponse.json(
        {
          success: false,
          error: "Please connect your Gmail account first.",
        },
        { status: 401 },
      );
    }

    const googleUserId = account?.googleUserId;

    const { oauth2Client, email } = await getGoogleOAuthClient(googleUserId);

    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client,
    });

    const rawMessage = [
      `From: ${email}`,
      `To: ${to.trim()}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=UTF-8",
      "",
      emailBody,
    ].join("\r\n");

    const encodedMessage = Buffer.from(rawMessage, "utf8").toString(
      "base64url",
    );

    const result = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully.",
      emailId: result.data.id,
      threadId: result.data.threadId,
    });
  } catch (error) {
    console.error("Gmail send failed:", error);
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 },
    );
  }
}
