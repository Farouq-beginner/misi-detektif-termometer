"use client";

interface SpeechBubbleProps {
  text: string;
  /** Sisi ekor balon menghadap ke maskot.
   *  - "left"  : ekor di kiri (maskot berada di kiri balon)
   *  - "right" : ekor di kanan (maskot berada di kanan balon)
   */
  tail?: "left" | "right";
  className?: string;
}

export default function SpeechBubble({
  text,
  tail = "left",
  className = "",
}: SpeechBubbleProps) {
  return (
    <div
      className={`relative max-w-[180px] rounded-2xl bg-white px-4 py-3 shadow-lg border-2 border-[#1E6FD9]/20 sm:max-w-xs ${className}`}
    >
      <p className="text-sm font-semibold leading-snug text-[#1F2A44] sm:text-base">
        {text}
      </p>
      {tail === "left" ? (
        <svg
          className="absolute -left-3 bottom-3"
          width="24"
          height="20"
          viewBox="0 0 24 20"
          fill="none"
          aria-hidden
        >
          <path d="M24 0 L0 8 L14 20 Z" fill="#FFFFFF" stroke="#1E6FD9" strokeWidth="2" />
          <path d="M24 0 L0 8 L8 10 Z" fill="#FFFFFF" />
        </svg>
      ) : (
        <svg
          className="absolute -right-3 bottom-3"
          width="24"
          height="20"
          viewBox="0 0 24 20"
          fill="none"
          aria-hidden
        >
          <path d="M0 0 L24 8 L10 20 Z" fill="#FFFFFF" stroke="#1E6FD9" strokeWidth="2" />
          <path d="M0 0 L24 8 L16 10 Z" fill="#FFFFFF" />
        </svg>
      )}
    </div>
  );
}
