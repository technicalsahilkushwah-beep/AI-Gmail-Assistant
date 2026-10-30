
import "server-only";

import { google } from "googleapis";
import { getGoogleAccount } from "@/lib/google-account";

export async function getGoogleOAuthClient(
  googleUserId: string,
) {
  const account = await getGoogleAccount(googleUserId);

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Google OAuth configuration is missing.");
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri,
  );

  oauth2Client.setCredentials({
    refresh_token: account.refreshToken,
  });

  await oauth2Client.getAccessToken();

  return {
    oauth2Client,
    email: account.email,
  };
}
