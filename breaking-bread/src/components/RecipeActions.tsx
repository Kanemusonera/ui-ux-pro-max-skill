"use client";

import { useEffect, useState } from "react";
import { CheckIcon, PrintIcon, ShareIcon } from "./Icons";

export function RecipeActions({
  url,
  title,
  text,
  printLabel = "Print recipe",
}: {
  url: string;
  title: string;
  text: string;
  printLabel?: string;
}) {
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => setCanShare(typeof navigator !== "undefined" && "share" in navigator), []);

  const e = encodeURIComponent;
  const links = [
    { label: "WhatsApp", href: `https://wa.me/?text=${e(`${title} — ${url}`)}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${e(url)}` },
    { label: "Pinterest", href: `https://www.pinterest.com/pin/create/button/?url=${e(url)}&description=${e(title)}` },
    { label: "X", href: `https://x.com/intent/post?url=${e(url)}&text=${e(title)}` },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <div className="print:hidden">
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => window.print()} className="btn btn-dark flex-1 sm:flex-none">
          <PrintIcon /> {printLabel}
        </button>
        {canShare && (
          <button
            type="button"
            onClick={() => navigator.share({ title, text, url }).catch(() => {})}
            className="btn btn-outline flex-1 sm:flex-none"
          >
            <ShareIcon /> Share
          </button>
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <span className="label text-stone">Share on</span>
        {links.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="link-underline min-h-8 py-1 font-semibold">
            {l.label}
          </a>
        ))}
        <button type="button" onClick={copy} className="link-underline inline-flex min-h-8 items-center gap-1.5 py-1 font-semibold">
          {copied ? (
            <>
              <CheckIcon /> Link copied
            </>
          ) : (
            "Copy link"
          )}
        </button>
      </div>
    </div>
  );
}
