import { ImageResponse } from "next/og";
import { getContent } from "@/lib/data";

export const alt = "Vishnu Vijay — Product Manager";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const { meta } = await getContent();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#000000",
          color: "#f5f2ea",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#FFB703",
              color: "#000",
              fontWeight: 800,
              fontSize: 24,
              letterSpacing: "0.02em",
            }}
          >
            VV
          </div>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: "0.08em", color: "#9b968b", textTransform: "uppercase" }}>
            {meta.location}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
          {meta.name}
        </div>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#FFB703", marginTop: 18 }}>
          {meta.role}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#9b968b",
            marginTop: 28,
            maxWidth: 980,
            lineHeight: 1.4,
          }}
        >
          {meta.tagline.replace(/\*/g, "").slice(0, 160)}
        </div>
      </div>
    ),
    { ...size }
  );
}
