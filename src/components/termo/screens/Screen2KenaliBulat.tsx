"use client";

import { useGameStore, CITIES, SEA_ITEMS, CONTEXT_META, getItems } from "@/store/useGameStore";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Termometer from "../Termometer";
import GarisBilangan from "../GarisBilangan";
import { MapPin } from "lucide-react";

export default function Screen2KenaliBulat() {
  const { context, selectedCityA, setCityA, setMascot } = useGameStore();
  const items = getItems(context);
  const meta = CONTEXT_META[context];

  const selected = items.find((c) => c.id === selectedCityA) ?? items[0];
  const value = selected.value;

  const color =
    value < 0 ? "#1E6FD9" : value > 0 ? "#FF8A3D" : "#7B5CD6";

  const min = context === "suhu" ? -40 : -150;
  const max = context === "suhu" ? 40 : 200;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 sm:py-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-[#1F2A44] sm:text-5xl">
          Kenali <span className="text-[#1E6FD9]">Bilangan Bulat</span>
        </h2>
        <p className="mt-2 text-base font-medium text-[#5B6B85] sm:text-lg">
          Geser nilai pada termometer, garis bilangannya ikut bergerak!
        </p>
      </div>

      {/* dropdown pilih kota */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[#5B6B85]">
          <MapPin className="h-4 w-4 text-[#1E6FD9]" /> Pilih {context === "suhu" ? "kota" : "objek"}:
        </div>
        <Select
          value={selected.id}
          onValueChange={(v) => {
            setCityA(v);
            const c = items.find((x) => x.id === v);
            if (c) {
              const mood = c.value < 0 ? "think" : c.value > 0 ? "happy" : "neutral";
              setMascot(mood, `${c.name} ${c.value > 0 ? "+" : ""}${c.value}${meta.unit}. Perhatikan posisinya di garis bilangan!`);
            }
          }}
        >
          <SelectTrigger className="w-[230px] rounded-xl border-[#1E6FD9]/30 text-base font-bold text-[#1F2A44]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{meta.label}</SelectLabel>
              {items.map((c) => (
                <SelectItem key={c.id} value={c.id} className="text-base font-semibold">
                  {c.icon} {c.name} ({c.value > 0 ? "+" : ""}
                  {c.value}
                  {meta.unit})
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* tampilan sinkron: termometer + garis bilangan */}
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <div className="termo-card flex flex-col items-center justify-center p-4">
          <Termometer value={value} min={min} max={max} height={360} unit={meta.unit} />
          <div
            className="mt-2 rounded-xl px-4 py-2 text-center"
            style={{ backgroundColor: `${color}1a` }}
          >
            <span className="text-2xl font-extrabold" style={{ color }}>
              {value > 0 ? `+${value}` : value}
              {meta.unit}
            </span>
          </div>
        </div>

        <div className="termo-card flex flex-col justify-center p-4 sm:p-6">
          <GarisBilangan
            min={min}
            max={max}
            step={context === "suhu" ? 1 : 50}
            unit={meta.unit}
            markers={[
              { value, label: selected.name, color, highlight: true },
            ]}
          />

          {/* tiga label */}
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border-2 border-[#1E6FD9]/20 bg-[#1E6FD9]/5 p-4">
              <div className="mb-1 h-2 w-full rounded-full bg-[#1E6FD9]" />
              <h3 className="text-base font-extrabold text-[#1E6FD9] sm:text-lg">
                Bilangan bulat negatif
              </h3>
              <p className="text-sm font-medium text-[#5B6B85]">(di kiri 0)</p>
            </div>
            <div className="rounded-2xl border-2 border-[#7B5CD6]/20 bg-[#7B5CD6]/5 p-4">
              <div className="mb-1 h-2 w-full rounded-full bg-[#7B5CD6]" />
              <h3 className="text-base font-extrabold text-[#7B5CD6] sm:text-lg">
                Nol
              </h3>
              <p className="text-sm font-medium text-[#5B6B85]">
                (bukan positif dan bukan negatif)
              </p>
            </div>
            <div className="rounded-2xl border-2 border-[#FF8A3D]/20 bg-[#FF8A3D]/5 p-4">
              <div className="mb-1 h-2 w-full rounded-full bg-[#FF8A3D]" />
              <h3 className="text-base font-extrabold text-[#FF8A3D] sm:text-lg">
                Bilangan bulat positif
              </h3>
              <p className="text-sm font-medium text-[#5B6B85]">(di kanan 0)</p>
            </div>
          </div>

          {/* dua panah keterangan */}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-xl bg-[#1E6FD9]/8 px-4 py-2.5">
              <span className="text-xl">⬅️</span>
              <p className="text-sm font-bold text-[#1E6FD9] sm:text-base">
                Makin ke kiri, nilainya makin kecil.
              </p>
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-xl bg-[#FF8A3D]/8 px-4 py-2.5">
              <p className="text-sm font-bold text-[#FF8A3D] sm:text-base">
                Makin ke kanan, nilainya makin besar.
              </p>
              <span className="text-xl">➡️</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
