"use client";

import { useState } from "react";

type Status = { kind: "idle" | "sending" | "ok" | "error"; message?: string };

const field =
  "mt-2 w-full border border-ink/25 bg-paper px-4 text-base text-ink outline-none transition-colors placeholder:text-stone focus:border-ink";

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const json = (await res.json()) as { message?: string; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Something went wrong. Please try again.");
      setStatus({ kind: "ok", message: json.message });
      form.reset();
    } catch (err) {
      setStatus({ kind: "error", message: (err as Error).message });
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="label text-stone">
            Name
          </label>
          <input id="c-name" name="name" required autoComplete="name" className={`${field} h-13 min-h-[3.25rem]`} />
        </div>
        <div>
          <label htmlFor="c-email" className="label text-stone">
            Email
          </label>
          <input id="c-email" name="email" type="email" required autoComplete="email" className={`${field} min-h-[3.25rem]`} />
        </div>
      </div>
      <div>
        <label htmlFor="c-subject" className="label text-stone">
          What's it about?
        </label>
        <select id="c-subject" name="subject" className={`${field} min-h-[3.25rem]`} defaultValue="A recipe question">
          <option>A recipe question</option>
          <option>Collaboration or brand partnership</option>
          <option>Press</option>
          <option>Just saying hello</option>
        </select>
      </div>
      <div>
        <label htmlFor="c-message" className="label text-stone">
          Message
        </label>
        <textarea id="c-message" name="message" required minLength={10} rows={6} className={`${field} py-3`} />
      </div>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" disabled={status.kind === "sending"} className="btn btn-dark disabled:opacity-60">
          {status.kind === "sending" ? "Sending…" : "Send message"}
        </button>
        <p
          role="status"
          aria-live="polite"
          className={`text-sm ${status.kind === "error" ? "text-[#9b2c1a]" : "text-stone"}`}
        >
          {status.message}
        </p>
      </div>
    </form>
  );
}
