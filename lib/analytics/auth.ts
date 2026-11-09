import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * 어드민 인증 — 환경변수 ADMIN_PASSWORD 하나로 동작.
 * 쿠키에는 비밀번호가 아니라 HMAC 서명값만 저장한다.
 */
export const ADMIN_COOKIE = "kimkw_admin";
export const SESSION_DAYS = 7;

const password = () => process.env.ADMIN_PASSWORD ?? "";
export const adminEnabled = () => password().length >= 8;

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function sessionToken(): string {
  return createHmac("sha256", password()).update("kimkw-admin-session-v1").digest("hex");
}

export function checkPassword(input: string): boolean {
  return adminEnabled() && safeEqual(input, password());
}

export function isValidSession(cookieValue: string | undefined): boolean {
  return adminEnabled() && !!cookieValue && safeEqual(cookieValue, sessionToken());
}
