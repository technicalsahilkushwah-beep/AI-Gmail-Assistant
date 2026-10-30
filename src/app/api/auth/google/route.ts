import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { auth } from "../../../../../auth";
import { tempCollection } from "@/lib/google-account";

export async function GET(request:NextRequest) {
  const chatId = request.nextUrl.searchParams.get("returnTo");

  const session = await auth()

  if(!session?.user?.id || !chatId){
    return NextResponse.json({
      error: "Please signin in before connecting the gmail"
    },{status:400})
  }
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      {
        error: "please provide the vailed google credentials",
      },
      { status: 400 },
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri,
  );

  const state = randomBytes(32).toString("hex");

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await tempCollection(state , session.user.id , expiresAt , chatId)

  const authorizedUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["openid", "email", "https://www.googleapis.com/auth/gmail.send"],
    include_granted_scopes: true,
    state,
  });

  const response = NextResponse.redirect(authorizedUrl);

  response.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  });

  return response;
}
