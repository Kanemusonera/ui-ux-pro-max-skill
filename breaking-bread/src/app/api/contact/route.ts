import { NextResponse } from "next/server";
import { EMAIL_RE, clean } from "@/lib/validate";

/**
 * Contact form. Sends an email via Resend when RESEND_API_KEY, CONTACT_TO_EMAIL
 * and CONTACT_FROM_EMAIL are set (the "from" domain must be verified in Resend).
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (clean(body.company, 200)) return NextResponse.json({ message: "Thanks — message sent." }); // honeypot

  const name = clean(body.name, 120);
  const email = clean(body.email, 254);
  const subject = clean(body.subject, 120) || "Website enquiry";
  const message = clean(body.message, 5000);

  if (!name) return NextResponse.json({ error: "Please tell us your name." }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  if (message.length < 10) return NextResponse.json({ error: "Your message looks a little short." }, { status: 400 });

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !to || !from) {
    console.warn("[contact] Resend is not configured — message not sent.");
    return NextResponse.json(
      { error: "The contact form isn't connected yet. Please email hello@breakingbread.co.uk instead." },
      { status: 503 },
    );
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `[Breaking Bread] ${subject} — ${name}`,
      text: `From: ${name} <${email}>\nTopic: ${subject}\n\n${message}`,
    }),
  });

  if (!res.ok) {
    console.error("[contact] Resend error", res.status, await res.text());
    return NextResponse.json({ error: "We couldn't send your message right now. Please try again later." }, { status: 502 });
  }
  return NextResponse.json({ message: "Thank you — your message is on its way. We'll reply soon." });
}
