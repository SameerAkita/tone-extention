import { createHmac, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type ExtensionTokenPayload = {
  sub: string;
  email?: string;
  aud: "tone-extension";
  iss: "tone-web";
  iat: number;
  exp: number;
  jti: string;
};

function toBase64Url(value: string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function signExtensionJwt(payload: ExtensionTokenPayload, secret: string) {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  const signature = createHmac("sha256", secret)
    .update(unsignedToken)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${unsignedToken}.${signature}`;
}

export async function POST() {
  const tokenSecret = process.env.EXTENSION_TOKEN_SECRET;
  if (!tokenSecret) {
    return NextResponse.json(
      { error: "Server missing EXTENSION_TOKEN_SECRET" },
      { status: 500 },
    );
  }

  const ttlSeconds = Number(process.env.EXTENSION_TOKEN_TTL_SECONDS ?? 60 * 60 * 24 * 30);

  if (!Number.isFinite(ttlSeconds) || ttlSeconds <= 0) {
    return NextResponse.json(
      { error: "Invalid EXTENSION_TOKEN_TTL_SECONDS" },
      { status: 500 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = Math.floor(Date.now() / 1000);
  const payload: ExtensionTokenPayload = {
    sub: user.id,
    email: user.email,
    aud: "tone-extension",
    iss: "tone-web",
    iat: now,
    exp: now + ttlSeconds,
    jti: randomUUID(),
  };

  const token = signExtensionJwt(payload, tokenSecret);

  return NextResponse.json({
    token,
    expiresAt: payload.exp,
    user: {
      id: user.id,
      email: user.email,
    },
  });
}