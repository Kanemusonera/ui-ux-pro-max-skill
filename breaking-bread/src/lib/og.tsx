/* Shared Open Graph card renderer (next/og). */
export const OG_SIZE = { width: 1200, height: 630 };

export function OgCard({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#13110f", color: "#f3ede2", padding: 72, fontFamily: "serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <svg width="56" height="56" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="29" fill="none" stroke="#b08a57" strokeWidth="2.5" />
          <path d="M32 11.5C34.4 24 34.4 41 32 54.5 29.6 41 29.6 24 32 11.5Z" fill="#b08a57" />
          <path d="M17.5 26.5C26 24.4 38 24.4 46.5 26.5 38 28.6 26 28.6 17.5 26.5Z" fill="#b08a57" />
        </svg>
        <div style={{ fontSize: 30, letterSpacing: 8, textTransform: "uppercase" }}>Breaking Bread</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 24, letterSpacing: 6, textTransform: "uppercase", color: "#b08a57" }}>{eyebrow}</div>
        <div style={{ fontSize: title.length > 40 ? 76 : 96, lineHeight: 1, marginTop: 20 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 32, color: "#b9b0a3", marginTop: 24 }}>{subtitle}</div>}
      </div>
    </div>
  );
}
