"use client";

import { MascotMood } from "@/store/useGameStore";

interface SiTermoProps {
  mood?: MascotMood;
  size?: number;
  animate?: boolean;
  className?: string;
}

/**
 * Si Termo - maskot termometer berwajah, dibuat 100% dengan SVG.
 * Ekspresi berubah sesuai mood: neutral, happy, think, sad.
 */
export default function SiTermo({
  mood = "neutral",
  size = 120,
  animate = false,
  className = "",
}: SiTermoProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 120 160"
        width={size}
        height={size}
        role="img"
        aria-label="Si Termo, maskot termometer"
      >
        {/* bayangan */}
        <ellipse cx="60" cy="152" rx="26" ry="5" fill="#1F2A44" opacity="0.12" />

        <g className={animate ? "termo-bounce origin-bottom" : ""} style={{ transformBox: "fill-box", transformOrigin: "bottom" }}>
          {/* tabung termometer */}
          <rect
            x="40"
            y="14"
            width="40"
            height="104"
            rx="20"
            fill="#FFFFFF"
            stroke="#1F2A44"
            strokeWidth="5"
          />
          {/* bola bawah */}
          <circle cx="60" cy="126" r="26" fill="#FFFFFF" stroke="#1F2A44" strokeWidth="5" />

          {/* kolom raksa / air raksa (selalu merah) */}
          <rect
            x="50"
            y={mood === "happy" ? 48 : mood === "think" ? 64 : mood === "sad" ? 80 : 56}
            width="20"
            height={mood === "happy" ? 72 : mood === "think" ? 56 : mood === "sad" ? 40 : 64}
            rx="10"
            fill="#E5484D"
          />
          <circle cx="60" cy="126" r="18" fill="#E5484D" />

          {/* garis skala */}
          <g stroke="#1F2A44" strokeWidth="3" strokeLinecap="round" opacity="0.5">
            <line x1="40" y1="34" x2="48" y2="34" />
            <line x1="40" y1="54" x2="48" y2="54" />
            <line x1="40" y1="74" x2="48" y2="74" />
            <line x1="40" y1="94" x2="48" y2="94" />
          </g>

          {/* mata */}
          {mood === "happy" ? (
            <>
              <path d="M 50 70 Q 55 64 60 70" stroke="#1F2A44" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <path d="M 60 70 Q 65 64 70 70" stroke="#1F2A44" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </>
          ) : mood === "sad" ? (
            <>
              <circle cx="54" cy="70" r="3.5" fill="#1F2A44" />
              <circle cx="66" cy="70" r="3.5" fill="#1F2A44" />
              {/* air mata */}
              <path d="M 54 74 Q 53 80 54 82" stroke="#1E6FD9" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </>
          ) : mood === "think" ? (
            <>
              <circle cx="54" cy="70" r="3.5" fill="#1F2A44" />
              <circle cx="66" cy="70" r="3.5" fill="#1F2A44" />
              {/* alis miring berpikir */}
              <line x1="50" y1="62" x2="58" y2="64" stroke="#1F2A44" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="62" y1="64" x2="70" y2="62" stroke="#1F2A44" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="54" cy="70" r="3.5" fill="#1F2A44" />
              <circle cx="66" cy="70" r="3.5" fill="#1F2A44" />
            </>
          )}

          {/* mulut */}
          {mood === "happy" ? (
            <path d="M 50 88 Q 60 98 70 88" stroke="#1F2A44" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          ) : mood === "sad" ? (
            <path d="M 50 94 Q 60 86 70 94" stroke="#1F2A44" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          ) : mood === "think" ? (
            <path d="M 52 92 Q 60 90 68 92" stroke="#1F2A44" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          ) : (
            <path d="M 52 90 Q 60 94 68 90" stroke="#1F2A44" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          )}

          {/* pipi merah */}
          <circle cx="46" cy="84" r="3" fill="#E5484D" opacity="0.35" />
          <circle cx="74" cy="84" r="3" fill="#E5484D" opacity="0.35" />
        </g>
      </svg>
    </div>
  );
}
