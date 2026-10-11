"use client";

interface NumberMarker {
  value: number;
  label?: string;
  color?: string;
  highlight?: boolean;
  isQuestion?: boolean;
}

interface GarisBilanganProps {
  min?: number;
  max?: number;
  step?: number;
  markers?: NumberMarker[];
  unit?: string;
  onPick?: (value: number) => void;
  height?: number;
  showArrows?: boolean;
  className?: string;
}

/** Baris label nama kota di atas garis (supaya tidak bertumpuk). */
const PILL_ROWS = [1, 28, 55];
/** Baris label nilai marker di bawah garis. */
const VALUE_ROWS = [184, 212];

/** Perkiraan lebar teks SVG (font default ~0.62em per karakter). */
const textWidth = (text: string, fontSize: number) =>
  text.length * fontSize * 0.62 + 8;

/**
 * Pilih baris pertama yang ruangnya masih longgar untuk sebuah label.
 * rowEnds[] diisi koordinat x ujung kanan label terakhir di tiap baris.
 */
function pickRow(
  x: number,
  width: number,
  rowEnds: number[],
  rowTops: number[],
  minGap = 10
): number {
  const left = x - width / 2;
  const right = x + width / 2;
  for (let row = 0; row < rowEnds.length; row++) {
    if (left >= rowEnds[row] + minGap) {
      rowEnds[row] = right;
      return row;
    }
  }
  // semua baris penuh: pakai baris paling bawah (masih terbaca)
  const row = rowTops.length - 1;
  rowEnds[row] = Math.max(rowEnds[row], right);
  return row;
}

const markerColor = (value: number, color?: string) =>
  color ?? (value < 0 ? "#1E6FD9" : value > 0 ? "#FF8A3D" : "#7B5CD6");

/**
 * Garis bilangan horizontal. Sisi kiri 0 biru, kanan oranye, titik 0 ungu.
 * - Rentang besar (derajat): label puluhan tiap 10 + angka kecil tiap satuan.
 *   Arah angka kecil mengikuti arah baca: kanan 0 -> 1..9, kiri 0 -> 9..1.
 * - Rentang kecil (-5..5): semua tick diberi label besar, tanpa angka kecil.
 * - Nama kota dipetakkan ke baris-baris atas supaya tulisan tidak bertumpuk.
 * Font SVG sudah diperbesar untuk proyektor.
 */
export default function GarisBilangan({
  min = -40,
  max = 40,
  step = 10,
  markers = [],
  unit = "",
  onPick,
  height = 240,
  showArrows = true,
  className = "",
}: GarisBilanganProps) {
  const padLeft = 64;
  const padRight = 64;
  const width = 1000;
  const usable = width - padLeft - padRight;
  const range = max - min;

  const toX = (v: number) => {
    const c = Math.max(min, Math.min(max, v));
    return padLeft + ((c - min) / range) * usable;
  };
  const zeroX = toX(0);

  const ticks: number[] = [];
  for (let v = min; v <= max; v += step) ticks.push(v);

  const formatValue = (value: number) => (value > 0 ? `+${value}` : `${value}`);
  // Rentang pendek (mis. -5..5): semua tick berlabel besar.
  // Rentang panjang step=1: hanya kelipatan 10; tick lain = angka kecil 1..9 / 9..1.
  const span = range / step;
  const labelAll = span <= 12;
  const isLabeledTick = (v: number) => (labelAll ? true : v % 10 === 0);
  const showSmallNumbers = step === 1 && !labelAll;
  // angka kecil: baris aturan bilangan absolute (1..9 di kedua sisi).
  // Karena baca dari kanan ke kiri di sisi negatif, urutan tampilan kiri->kanan menjadi 9..1.
  const smallNumber = (v: number) => Math.abs(v) % 10;

  // marker yang nilainya belum terlihat di label biasa -> punya label nilai sendiri
  const valueLabels = markers
    .filter((m) => {
      if (m.isQuestion) return false; // jangan bocorkan jawaban
      const alreadyLabeled = labelAll || (step === 1 ? m.value % 10 === 0 : m.value % step === 0);
      return !alreadyLabeled && m.value >= min && m.value <= max;
    })
    .map((m, idx) => ({ m, idx, x: toX(m.value) }))
    .sort((a, b) => a.x - b.x);
  const valueRowEnds = [-Infinity, -Infinity];
  const valueRow = new Map<number, number>();
  for (const { m, idx, x } of valueLabels) {
    const text = formatValue(m.value);
    valueRow.set(idx, pickRow(x, textWidth(text, 19), valueRowEnds, VALUE_ROWS));
  }

  // pill nama kota di atas garis: baris dipilih berdasarkan tabrakan nyata
  const pillItems = markers
    .map((m, idx) => ({ m, idx, x: toX(m.value) }))
    .filter(({ m }) => !!m.label)
    .sort((a, b) => a.x - b.x);
  const pillRowEnds = [-Infinity, -Infinity, -Infinity];
  const pillLayout = new Map<number, { labelX: number; labelY: number; labelWidth: number }>();
  for (const { m, idx, x } of pillItems) {
    const labelWidth = markerLabelWidth(m.label!);
    const labelX = Math.max(
      labelWidth / 2 + 4,
      Math.min(width - labelWidth / 2 - 4, x)
    );
    const row = pickRow(labelX, labelWidth, pillRowEnds, PILL_ROWS);
    pillLayout.set(idx, { labelX, labelY: PILL_ROWS[row], labelWidth });
  }

  const fontSizeBig = labelAll ? "22" : step === 1 ? "20" : "22";

  return (
    <div className={`flex w-full justify-center overflow-x-auto termo-scroll ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        style={{ minWidth: 850, maxWidth: 1050 }}
        height={height}
        role="img"
        aria-label="Garis bilangan bilangan bulat"
      >
        {/* blok kiri (negatif) biru muda, kanan (positif) oranye muda */}
        <rect x={padLeft} y={86} width={Math.max(0, zeroX - padLeft)} height={28} fill="#1E6FD9" opacity={0.08} rx={4} />
        <rect x={zeroX} y={86} width={Math.max(0, padLeft + usable - zeroX)} height={28} fill="#FF8A3D" opacity={0.08} rx={4} />

        {/* garis utama */}
        <line x1={padLeft} y1={100} x2={padLeft + usable} y2={100} stroke="#1F2A44" strokeWidth={4} strokeLinecap="round" />

        {/* anak panah kanan (makin besar) */}
        {showArrows && (
          <>
            <polygon
              points={`${padLeft + usable},${100} ${padLeft + usable - 12},${94} ${padLeft + usable - 12},${106}`}
              fill="#FF8A3D"
            />
            <polygon points={`${padLeft},${100} ${padLeft + 12},${94} ${padLeft + 12},${106}`} fill="#1E6FD9" />
            <text x={padLeft - 6} y={80} fontSize="17" fill="#1E6FD9" fontWeight="700" textAnchor="start">
              makin kecil
            </text>
            <text x={padLeft + usable + 4} y={80} fontSize="17" fill="#FF8A3D" fontWeight="700" textAnchor="end">
              makin besar
            </text>
          </>
        )}

        {/* ticks & label */}
        {ticks.map((v) => {
          const x = toX(v);
          const isZero = v === 0;
          const labeled = isLabeledTick(v);
          return (
            <g
              key={v}
              onClick={() => onPick?.(v)}
              style={onPick ? { cursor: "pointer" } : undefined}
            >
              {labeled ? (
                <line
                  x1={x}
                  y1={90}
                  x2={x}
                  y2={110}
                  stroke={isZero ? "#7B5CD6" : "#1F2A44"}
                  strokeWidth={isZero ? 4 : 2.5}
                />
              ) : (
                /* tick satuan (tanpa label besar) */
                <line
                  x1={x}
                  y1={94}
                  x2={x}
                  y2={106}
                  stroke="#1F2A44"
                  strokeWidth={1.5}
                  opacity={0.45}
                />
              )}
              {labeled ? (
                <>
                  <text
                    x={x}
                    y={140}
                    fontSize={fontSizeBig}
                    fontWeight="800"
                    fill={isZero ? "#7B5CD6" : v < 0 ? "#1E6FD9" : "#1F2A44"}
                    textAnchor="middle"
                  >
                    {formatValue(v)}
                  </text>
                  {unit && (
                    <text x={x} y={162} fontSize="14" fill="#5B6B85" textAnchor="middle">
                      {unit}
                    </text>
                  )}
                </>
              ) : (
                <>
                  <line
                    x1={x}
                    y1={94}
                    x2={x}
                    y2={106}
                    stroke="#1F2A44"
                    strokeWidth={1.5}
                    opacity={0.45}
                  />
                  {showSmallNumbers && (
                    <text
                      x={x}
                      y={122}
                      fontSize="12"
                      fontWeight="600"
                      fill="#5B6B85"
                      opacity={0.9}
                      textAnchor="middle"
                    >
                      {smallNumber(v)}
                    </text>
                  )}
                </>
              )}
            </g>
          );
        })}

        {/* label nilai marker persis (di bawah garis, berjenjang agar tidak menumpuk) */}
        {valueLabels.map(({ m, idx, x }) => {
          const c = markerColor(m.value, m.color);
          const row = valueRow.get(idx) ?? 0;
          const y = VALUE_ROWS[row];
          return (
            <g key={`value-${idx}`} className={m.highlight ? "termo-pop" : ""}>
              <line
                x1={x}
                y1={104}
                x2={x}
                y2={y - 16}
                stroke={c}
                strokeWidth={2}
                strokeDasharray="3 3"
                opacity={0.6}
              />
              <text x={x} y={y} fontSize="19" fontWeight="800" fill={c} textAnchor="middle">
                {formatValue(m.value)}
              </text>
            </g>
          );
        })}

        {/* marker kustom */}
        {markers.map((m, i) => {
          const x = toX(m.value);
          const c = markerColor(m.value, m.color);
          if (m.isQuestion) {
            return (
              <g key={i}>
                <line x1={x} y1={76} x2={x} y2={90} stroke="#7B5CD6" strokeWidth={3} strokeDasharray="4 3" />
                <circle cx={x} cy={100} r={11} fill="#FFFFFF" stroke="#7B5CD6" strokeWidth={4} />
                <text x={x} y={72} fontSize="24" fontWeight="800" fill="#7B5CD6" textAnchor="middle">
                  ?
                </text>
              </g>
            );
          }
          const pill = pillLayout.get(i);
          return (
            <g key={i} className={m.highlight ? "termo-pop" : ""}>
              <circle cx={x} cy={100} r={m.highlight ? 11 : 8} fill={c} stroke="#FFFFFF" strokeWidth={3} />
              {m.label && pill && (
                <g>
                  <line
                    x1={x}
                    y1={pill.labelY + 22}
                    x2={x}
                    y2={76}
                    stroke={c}
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    opacity={0.7}
                  />
                  <rect
                    x={pill.labelX - pill.labelWidth / 2}
                    y={pill.labelY}
                    width={pill.labelWidth}
                    height={22}
                    rx={11}
                    fill={c}
                  />
                  <text x={pill.labelX} y={pill.labelY + 16} fontSize="15" fontWeight="800" fill="#FFFFFF" textAnchor="middle">
                    {m.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function markerLabelWidth(label: string) {
  return Math.min(200, Math.max(64, label.length * 8.4 + 22));
}
