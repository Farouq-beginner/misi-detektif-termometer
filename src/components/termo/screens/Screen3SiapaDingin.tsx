"use client";

import { useGameStore, getItems, CONTEXT_META } from "@/store/useGameStore";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import GarisBilangan from "../GarisBilangan";
import { Check, RotateCcw, Snowflake, Flame } from "lucide-react";

export default function Screen3SiapaDingin() {
  const {
    context,
    selectedCityA,
    selectedCityB,
    guessColder,
    layar3Result,
    setCityA,
    setCityB,
    setGuessColder,
    checkLayar3,
    resetLayar3,
  } = useGameStore();

  const items = getItems(context);
  const meta = CONTEXT_META[context];
  const isDepthContext = context === "kedalaman";
  const subjectLabel = isDepthContext ? "objek" : "kota";
  const comparisonTitle = isDepthContext ? "Dalam" : "Dingin";
  const comparisonTerm = isDepthContext ? "dalam" : "dingin";
  const min = context === "suhu" ? -40 : -150;
  const max = context === "suhu" ? 40 : 200;

  const a = items.find((c) => c.id === selectedCityA) ?? items[0];
  const b = items.find((c) => c.id === selectedCityB) ?? items[1];
  const sameCity = a.id === b.id;

  const colorA = a.value < 0 ? "#1E6FD9" : a.value > 0 ? "#FF8A3D" : "#7B5CD6";
  const colorB = b.value < 0 ? "#1E6FD9" : b.value > 0 ? "#FF8A3D" : "#7B5CD6";

  // nilai-nilai untuk kalimat otomatis
  const smaller = a.value <= b.value ? a : b;
  const larger = a.value <= b.value ? b : a;
  const fmt = (v: number) => (v > 0 ? `+${v}` : `${v}`);

  const showResult = !!layar3Result;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 sm:py-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-[#1F2A44] sm:text-5xl">
          Siapa Lebih <span className="text-[#1E6FD9]">{comparisonTitle}</span>?
        </h2>
        <p className="mt-2 text-lg font-semibold text-[#5B6B85] sm:text-xl">
          Pilih dua {subjectLabel}. Menurutmu, mana yang lebih {comparisonTerm}?
        </p>
      </div>

      {/* pilih dua kota atau objek */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="termo-card p-4 sm:p-5">
          <label className="mb-2 block text-sm font-extrabold text-[#1E6FD9]">
            {subjectLabel.toUpperCase()} PERTAMA
          </label>
          <Select value={a.id} onValueChange={setCityA}>
            <SelectTrigger className="rounded-xl border-[#1E6FD9]/30 text-base font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{meta.label}</SelectLabel>
                {items.map((c) => (
                  <SelectItem key={c.id} value={c.id} className="font-semibold">
                    {c.icon} {c.name} ({fmt(c.value)}
                    {meta.unit})
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div
            className="mt-3 rounded-xl px-4 py-2 text-center"
            style={{ backgroundColor: `${colorA}1a` }}
          >
            <span className="text-2xl font-extrabold" style={{ color: colorA }}>
              {fmt(a.value)}
              {meta.unit}
            </span>
          </div>
        </div>

        <div className="termo-card p-4 sm:p-5">
          <label className="mb-2 block text-sm font-extrabold text-[#FF8A3D]">
            {subjectLabel.toUpperCase()} KEDUA
          </label>
          <Select value={b.id} onValueChange={setCityB}>
            <SelectTrigger className="rounded-xl border-[#FF8A3D]/30 text-base font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{meta.label}</SelectLabel>
                {items.map((c) => (
                  <SelectItem key={c.id} value={c.id} className="font-semibold">
                    {c.icon} {c.name} ({fmt(c.value)}
                    {meta.unit})
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div
            className="mt-3 rounded-xl px-4 py-2 text-center"
            style={{ backgroundColor: `${colorB}1a` }}
          >
            <span className="text-2xl font-extrabold" style={{ color: colorB }}>
              {fmt(b.value)}
              {meta.unit}
            </span>
          </div>
        </div>
      </div>

      {/* pertanyaan tebak */}
      <div className="termo-card p-5 sm:p-6">
        <p className="mb-4 text-center text-lg font-bold text-[#1F2A44] sm:text-xl">
          Menurutmu, mana yang lebih {comparisonTerm}? 🤔
        </p>
        {!showResult ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                disabled={sameCity}
                onClick={() => {
                  setGuessColder("A");
                  checkLayar3();
                }}
                className="h-16 rounded-2xl bg-[#1E6FD9] text-base font-extrabold text-white shadow-md hover:bg-[#1a60c0] disabled:opacity-40"
              >
                <Snowflake className="mr-2 h-5 w-5" />
                {a.name} lebih {comparisonTerm}
              </Button>
              <Button
                disabled={sameCity}
                onClick={() => {
                  setGuessColder("B");
                  checkLayar3();
                }}
                className="h-16 rounded-2xl bg-[#FF8A3D] text-base font-extrabold text-white shadow-md hover:bg-[#e87a30] disabled:opacity-40"
              >
                <Snowflake className="mr-2 h-5 w-5" />
                {b.name} lebih {comparisonTerm}
              </Button>
            </div>
            {sameCity && (
              <p className="mt-3 text-center text-sm font-semibold text-[#E5484D]">
                Pilih dua {subjectLabel} yang berbeda ya!
              </p>
            )}
          </>
        ) : (
          <div className="termo-pop">
            <div
              className={`rounded-2xl p-5 text-center ${
                layar3Result?.correct ? "bg-[#2DB67D]/10" : "bg-[#E5484D]/10"
              }`}
            >
              <div
                className={`mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-extrabold text-white ${
                  layar3Result?.correct ? "bg-[#2DB67D]" : "bg-[#E5484D]"
                }`}
              >
                {layar3Result?.correct ? (
                  <>
                    <Check className="h-4 w-4" /> BENAR
                  </>
                ) : (
                  <>
                    <Flame className="h-4 w-4" ></Flame> BELUM TEPAT
                  </>
                )}
              </div>
              <p className="text-xl font-extrabold text-[#1F2A44] sm:text-2xl">
                {fmt(smaller.value)} {meta.unit}{" "}
                <span className="text-[#5B6B85]">&lt;</span>{" "}
                {fmt(larger.value)}
                {meta.unit}
              </p>
              <p className="mt-2 text-base font-semibold text-[#5B6B85] sm:text-lg">
                Karena <span className="font-extrabold" style={{ color: smaller.value < 0 ? "#1E6FD9" : "#FF8A3D" }}>{fmt(smaller.value)}</span> berada di sebelah kiri{" "}
                <span className="font-extrabold" style={{ color: larger.value < 0 ? "#1E6FD9" : "#FF8A3D" }}>{fmt(larger.value)}</span> pada garis bilangan.
              </p>
              <p className="mt-1 text-base font-bold text-[#1F2A44]">
                Jadi, <span className="text-[#1E6FD9]">{smaller.name}</span> lebih {comparisonTerm} dari {larger.name}.
              </p>
            </div>
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                onClick={resetLayar3}
                className="rounded-xl border-[#1E6FD9]/30 text-[#1E6FD9] hover:bg-[#EAF6FF]"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Coba lagi
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* tampilan garis bilangan dengan dua titik */}
      <div className="termo-card p-4 sm:p-6">
        <h3 className="mb-2 text-center text-sm font-extrabold uppercase tracking-wide text-[#5B6B85]">
          Posisi pada garis bilangan
        </h3>
        <GarisBilangan
          min={min}
          max={max}
          step={context === "suhu" ? 1 : 50}
          unit={meta.unit}
          markers={[
            {
              value: a.value,
              label: a.name,
              color: colorA,
              highlight: showResult && smaller.id === a.id,
            },
            {
              value: b.value,
              label: b.name,
              color: colorB,
              highlight: showResult && smaller.id === b.id,
            },
          ]}
        />
      </div>
    </div>
  );
}
