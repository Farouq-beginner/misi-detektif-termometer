"use client";

import { CityItem, CONTEXT_META } from "@/store/useGameStore";

interface CityCardProps {
  city: CityItem;
  context: "suhu" | "kedalaman";
  selected?: boolean;
  onClick?: () => void;
  draggable?: boolean;
  compact?: boolean;
  className?: string;
}

export default function CityCard({
  city,
  context,
  selected = false,
  onClick,
  draggable = false,
  compact = false,
  className = "",
}: CityCardProps) {
  const meta = CONTEXT_META[context];
  const color =
    city.value < 0 ? "#1E6FD9" : city.value > 0 ? "#FF8A3D" : "#7B5CD6";

  return (
    <button
      type="button"
      onClick={onClick}
      draggable={draggable}
      className={`termo-card flex items-center gap-3 text-left transition-all ${
        compact ? "p-2.5" : "p-4"
      } ${selected ? "ring-4 ring-[#7B5CD6]/40 -translate-y-0.5" : "hover:-translate-y-0.5 hover:shadow-xl"} ${className}`}
      style={{ borderColor: selected ? color : undefined }}
    >
      <span className="text-3xl" aria-hidden>
        {city.icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[#1F2A44] text-lg leading-tight truncate">
          {city.name}
        </div>
        <div
          className="font-extrabold text-xl leading-tight"
          style={{ color }}
        >
          {city.value > 0 ? `+${city.value}` : city.value}
          <span className="text-sm font-semibold text-[#5B6B85]">{meta.unit}</span>
        </div>
      </div>
    </button>
  );
}
