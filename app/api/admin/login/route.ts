import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  checkPassword,
  SESSION_DAYS,
  sessionToken,
} from "@/lib/analytics/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const form = await req.formData();
  const pw = String(form.get("password") ?? "");
  const back = new URL("/admin", req.url);

  if (!checkPassword(pw)) {
    // 무차별 대입을 느리게
    await new Promise((r) => setTimeout(r, 800));
    back.searchParams.set("error", "1");
    return Response.redirect(back, 303);
  }

  (await cookies()).set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86_400,
  });
  return Response.redirect(back, 303);
}
