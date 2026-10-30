import "server-only";

import { db } from "@/config/db";
import { decryptGoogleToken } from "@/lib/google-token-encryption";
import { auth } from "../../auth";
import { NextResponse } from "next/server";

export async function getGoogleAccount(googleUserId: string) {
  const account = await db.collection("google_account").findOne({
    googleUserId,
  });

  if (!account) {
    throw new Error("Google account is not connected.");
  }

  if (!account.refreshToken || !account.iv || !account.authTag) {
    throw new Error("Google refresh token is missing.");
  }

  const refreshToken = decryptGoogleToken({
    encryptedToken: account.refreshToken,
    iv: account.iv,
    authTag: account.authTag,
  });

  return {
    googleUserId: account.googleUserId,
    email: account.email,
    refreshToken,
  };
}

export async function tempCollection(
  state: string,
  authUserId: string,
  expiresAt: Date,
  chatId:string
) {
  await db.collection("google_oauth_states").insertOne({
    chatId,
    state,
    authUserId,
    expiresAt,
    createdAt: new Date(),
  });
}

export async function StateRecord(
  state: string,
  authUserId: string,
) {
  return await db.collection("google_oauth_states").findOneAndDelete({
    state,
    authUserId,
    expiresAt: { $gt: new Date() }
  });
}

