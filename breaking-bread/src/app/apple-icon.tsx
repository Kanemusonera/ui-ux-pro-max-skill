import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#13110f" }}>
      <svg width="120" height="120" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="29" fill="none" stroke="#f3ede2" strokeWidth="2.5" />
        <path d="M32 11.5C34.4 24 34.4 41 32 54.5 29.6 41 29.6 24 32 11.5Z" fill="#f3ede2" />
        <path d="M17.5 26.5C26 24.4 38 24.4 46.5 26.5 38 28.6 26 28.6 17.5 26.5Z" fill="#f3ede2" />
      </svg>
    </div>,
    size,
  );
}
