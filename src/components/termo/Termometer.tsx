"use client";

interface TermometerProps {
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  height?: number;
  showValue?: boolean;
  className?: string;
}

/**
 * Pilih jarak antar label skala agar jumlah label pas di tabung
 * dan tidak saling bertabrakan.
 */
function pickTickStep(min: number, max: number, maxLabels: number) {
  const candidates = [1, 2, 5, 10, 20, 25, 50, 100, 200, 500, 1000];
  const range = max - min;
  for (const step of candidates) {
    const count = Math.floor(range / step) + 1;
    if (count <= maxLabels) return step;
  }
  return candidates[candidates.length - 1];
}

/**
 * Termometer vertikal. Warna kolom cairan mengikuti tanda:
 * - negatif -> biru (#1E6FD9)
 * - nol -> ungu (#7B5CD6)
 * - positif -> oranye (#FF8A3D)
 * Skala adaptif: rentang apa pun (derajat atau meter) tanpa label bertumpuk.
 */
export default function Termometer({
  value,
  min = -40,
  max = 40,
  unit = "°C",
  height = 340,
  showValue = true,
  className = "",
}: TermometerProps) {
  const tubeTop = 18;
  const tubeBottom = height - 60;
  const tubeHeight = tubeBottom - tubeTop;
  const range = max - min;
  // posisi 0 pada tabung
  const zeroY = tubeBottom - ((0 - min) / range) * tubeHeight;
  // posisi nilai
  const clamped = Math.max(min, Math.min(max, value));
  const valueY = tubeBottom - ((clamped - min) / range) * tubeHeight;

  const color =
    value < 0 ? "#1E6FD9" : value > 0 ? "#FF8A3D" : "#7B5CD6";

  // jarak ticks adaptif: derajat (-40..40) -> 10, kedalaman (-150..200) -> 50
  const tickStep = pickTickStep(min, max, 9);
  const ticks: number[] = [];
  for (let v = min; v <= max; v += tickStep) ticks.push(v);

  const labelStep = Math.max(tickStep, tickStep <= 2 ? 10 : tickStep * 1);
  const showLabel = (v: number) => v % labelStep === 0;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        viewBox={`0 0 130 ${height}`}
        width={130}
        height={height}
        role="img"
        aria-label={`Termometer menunjukkan ${value}${unit}`}
      >
        {/* tabung */}
        <rect
          x="44"
          y={tubeTop - 8}
          width="40"
          height={tubeHeight + 16}
          rx="20"
          fill="#FFFFFF"
          stroke="#1F2A44"
          strokeWidth="4"
        />
        {/* bola */}
        <circle cx="64" cy={tubeBottom + 34} r="24" fill={color} stroke="#1F2A44" strokeWidth="4" />

        {/* kolom cairan: dari bola ke nilai */}
        <rect
          x="54"
          y={Math.min(valueY, tubeBottom + 6)}
          width="20"
          height={Math.abs(tubeBottom + 10 - valueY)}
          rx="10"
          fill={color}
        />
        {/* isi bola (di atas warna solid supaya menyatu) */}
        <circle cx="64" cy={tubeBottom + 34} r="16" fill={color} />

        {/* garis nol ungu */}
        <line
          x1="26"
          x2="102"
          y1={zeroY}
          y2={zeroY}
          stroke="#7B5CD6"
          strokeWidth="3"
          strokeDasharray="6 4"
        />
        <text x="106" y={zeroY + 6} fontSize="19" fill="#7B5CD6" fontWeight="800">
          0
        </text>

        {/* ticks */}
        {ticks.map((v) => {
          const y = tubeBottom - ((v - min) / range) * tubeHeight;
          if (v === 0) return null;
          const labeled = showLabel(v);
          return (
            <g key={v}>
              <line
                x1="42"
                x2={labeled ? 52 : 48}
                y1={y}
                y2={y}
                stroke="#1F2A44"
                strokeWidth={labeled ? 2.5 : 1.5}
                opacity={labeled ? 1 : 0.5}
              />
              {labeled && (
                <text x="40" y={y + 6} fontSize="18" fill="#5B6B85" fontWeight="700" textAnchor="end">
                  {v > 0 ? `+${v}` : v}
                </text>
              )}
            </g>
          );
        })}

        {/* penanda nilai */}
        <circle cx="64" cy={valueY} r="7" fill={color} stroke="#FFFFFF" strokeWidth="3" />
        {showValue && (
          <g>
            <rect
              x="74"
              y={valueY - 19}
              width="52"
              height="38"
              rx="8"
              fill={color}
            />
            <text
              x="100"
              y={valueY + 6}
              fontSize="19"
              fill="#FFFFFF"
              fontWeight="800"
              textAnchor="middle"
            >
              {value > 0 ? `+${value}` : value}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
