import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { encryptGoogleToken } from "@/lib/google-token-encryption";
import { auth } from "../../../../../../auth";
import { StateRecord } from "@/lib/google-account";
import { json } from "zod";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const code = searchParams.get("code");
  const returnedState = searchParams.get("state");
  const googleError = searchParams.get("error");

  const savedState = request.cookies.get("google_oauth_state")?.value;

  if (googleError) {
    return NextResponse.json(
      { error: "Google authorization was cancelled or denied." },
      { status: 400 },
    );
  }

  if (!returnedState || !savedState || returnedState !== savedState) {
    return NextResponse.json(
      { error: "Invalid OAuth state. Please try again." },
      { status: 403 },
    );
  }

  const session = await auth()

  if(!session?.user?.id){
    return NextResponse.json({
      error: "Please login your account"
    })
  }

  const stateRecord = await StateRecord(returnedState , session?.user?.id)

  if (!stateRecord) {
    return NextResponse.json(
      { error: "Invalid or expired OAuth request. Please try again." },
      { status: 403 },
    );
  }

  const chatId = stateRecord.chatId

  const authUserId = stateRecord.authUserId;

  if (!authUserId) {
    return NextResponse.json(
      { error: "Could not identify the signed-in user." },
      { status: 403 },
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code is missing." },
      { status: 400 },
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      { error: "Google OAuth configuration is missing." },
      { status: 500 },
    );
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri,
    );

    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const { data: userInfo } = await oauth2.userinfo.get();

    if (!userInfo.id || !userInfo.email) {
      return NextResponse.json(
        { error: "Could not identify the connected Google account." },
        { status: 400 },
      );
    }

    if (!tokens.refresh_token) {
      return NextResponse.json({
        message: "Refresh_token is missing",
      });
    }

    const encrypted = encryptGoogleToken(tokens.refresh_token);

    await db.collection("google_account").updateOne(
      { googleUserId: userInfo.id },

      {
        $set: {
          authUserId,
          profilePicture: userInfo.picture,
          email: userInfo.email,
          refreshToken: encrypted.encryptedToken,
          iv: encrypted.iv,
          authTag: encrypted.authTag,
          updatedAt: new Date(),
        },

        $setOnInsert: {
          createdAt: new Date(),
        },
      },

      { upsert: true },
    );

    const response = NextResponse.redirect(`http://localhost:3000${chatId}`)

    

    response.cookies.delete("google_oauth_state");

    return response;
  } catch (error) {
    console.error("Google OAuth callback failed.", error);

    return NextResponse.json(
      { error: "Could not exchange Google authorization code." },
      { status: 500 },
    );
  }
}
