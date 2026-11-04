"use client";

import { useState } from "react";

type Status = { kind: "idle" | "sending" | "ok" | "error"; message?: string };

export function NewsletterForm({ light = false, id = "newsletter-email" }: { light?: boolean; id?: string }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
    <form onSubmit={onSubmit} className="w-full" noValidate={false}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor={id} className="sr-only">
          Email address
        </label>
        <input
          id={id}
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="Your email address"
          className={`h-13 min-h-[3.25rem] w-full border px-4 text-base outline-none transition-colors ${
            light
              ? "border-cream/30 bg-transparent text-cream placeholder:text-mist focus:border-cream"
              : "border-ink/25 bg-paper text-ink placeholder:text-stone focus:border-ink"
          }`}
        />
        {/* Honeypot: hidden from people, tempting to bots. */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
        <button
          type="submit"
          disabled={status.kind === "sending"}
          className={`btn shrink-0 disabled:opacity-60 ${light ? "btn-light" : "btn-dark"}`}
        >
          {status.kind === "sending" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      <p
        role="status"
        aria-live="polite"
        className={`mt-3 min-h-6 text-sm ${status.kind === "error" ? (light ? "text-[#f0a58f]" : "text-[#9b2c1a]") : light ? "text-mist" : "text-stone"}`}
      >
        {status.message ?? "One email when there's something worth cooking. Unsubscribe any time."}
      </p>
    </form>
  );
}
