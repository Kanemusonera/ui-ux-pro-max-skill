import { NextResponse } from "next/server";
import { EMAIL_RE, clean } from "@/lib/validate";

/**
 * Newsletter sign-up. Connect Buttondown by setting BUTTONDOWN_API_KEY.
 * (Swap the fetch below for Mailchimp, Kit, MailerLite etc. if you prefer.)
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (clean(body.company, 200)) return NextResponse.json({ message: "Thanks!" }); // honeypot

  const email = clean(body.email, 254).toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const key = process.env.BUTTONDOWN_API_KEY;
  if (!key) {
    console.warn("[newsletter] BUTTONDOWN_API_KEY is not set — sign-up not stored:", email);
    return NextResponse.json(
      { error: "Our newsletter isn't open just yet. Please check back soon." },
      { status: 503 },
    );
  }

  const res = await fetch("https://api.buttondown.com/v1/subscribers", {
    method: "POST",
    headers: { Authorization: `Token ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email_address: email, tags: ["website"] }),
  });

  if (res.ok) {
    return NextResponse.json({ message: "You're in. Check your inbox to confirm your subscription." });
  }
  const text = await res.text();
  if (res.status === 400 && /already/i.test(text)) {
    return NextResponse.json({ message: "You're already subscribed. Thank you!" });
  }
  console.error("[newsletter] Buttondown error", res.status, text);
  return NextResponse.json({ error: "We couldn't subscribe you right now. Please try again later." }, { status: 502 });
}
