"use client";

import { useGameStore } from "@/store/useGameStore";
import { Button } from "@/components/ui/button";
import GarisBilangan from "../GarisBilangan";
import { Sparkles, RotateCcw, ChevronLeft, Thermometer } from "lucide-react";

export default function Screen6Penutup() {
  const { resetAll, setScreen } = useGameStore();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 sm:py-12">
      <div className="text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#7B5CD6] px-4 py-1.5 text-white shadow-md">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-bold tracking-wide">Penutup Misi</span>
        </div>
        <h2 className="text-3xl font-extrabold text-[#1F2A44] sm:text-5xl">
          Kesimpulan <span className="text-[#7B5CD6]">Misi</span>
        </h2>
      </div>

      <div className="termo-card p-6 sm:p-8">
        <p className="text-lg font-semibold leading-relaxed text-[#1F2A44] sm:text-2xl">
          Pada bilangan bulat negatif, makin besar angkanya, letaknya makin{" "}
          <span className="font-extrabold text-[#1E6FD9]">ke kiri</span>, artinya nilainya makin{" "}
          <span className="font-extrabold text-[#1E6FD9]">kecil</span>.
        </p>
        <p className="mt-3 text-lg font-semibold leading-relaxed text-[#1F2A44] sm:text-2xl">
          Jadi{" "}
          <span className="rounded-md bg-[#1E6FD9]/10 px-2 py-0.5 font-extrabold text-[#1E6FD9]">
            −31°C
          </span>{" "}
          lebih dingin daripada{" "}
          <span className="rounded-md bg-[#1E6FD9]/10 px-2 py-0.5 font-extrabold text-[#1E6FD9]">
            −3°C
          </span>
          .
        </p>
      </div>

      {/* ilustrasi -31 vs -3 */}
      <div className="termo-card p-4 sm:p-6">
        <h3 className="mb-3 text-center text-sm font-extrabold uppercase tracking-wide text-[#5B6B85]">
          Lihat di garis bilangan
        </h3>
        <GarisBilangan
          min={-40}
          max={40}
          step={1}
          markers={[
            { value: -31, label: "−31 (lebih dingin)", color: "#1E6FD9", highlight: true },
            { value: -3, label: "−3", color: "#1E6FD9" },
            { value: 0, color: "#7B5CD6" },
          ]}
          showArrows={true}
        />
        <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#1E6FD9]/8 px-4 py-2.5">
          <Thermometer className="h-5 w-5 text-[#1E6FD9]" />
          <p className="text-base font-bold text-[#1E6FD9]">
            −31 ada di sebelah kiri −3 → nilainya lebih kecil → lebih dingin.
          </p>
        </div>
      </div>

      {/* ringkasan warna */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border-2 border-[#1E6FD9]/20 bg-[#1E6FD9]/5 p-4 text-center">
          <div className="mx-auto mb-2 h-3 w-12 rounded-full bg-[#1E6FD9]" />
          <p className="font-extrabold text-[#1E6FD9]">Negatif (−)</p>
          <p className="text-sm font-medium text-[#5B6B85]">di kiri 0 · makin ke kiri makin dingin</p>
        </div>
        <div className="rounded-2xl border-2 border-[#7B5CD6]/20 bg-[#7B5CD6]/5 p-4 text-center">
          <div className="mx-auto mb-2 h-3 w-12 rounded-full bg-[#7B5CD6]" />
          <p className="font-extrabold text-[#7B5CD6]">Nol (0)</p>
          <p className="text-sm font-medium text-[#5B6B85]">titik acuan · bukan positif/negatif</p>
        </div>
        <div className="rounded-2xl border-2 border-[#FF8A3D]/20 bg-[#FF8A3D]/5 p-4 text-center">
          <div className="mx-auto mb-2 h-3 w-12 rounded-full bg-[#FF8A3D]" />
          <p className="font-extrabold text-[#FF8A3D]">Positif (+)</p>
          <p className="text-sm font-medium text-[#5B6B85]">di kanan 0 · makin ke kanan makin panas</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setScreen(1)}
          className="h-12 rounded-2xl border-[#1E6FD9]/30 text-[#1E6FD9] hover:bg-[#EAF6FF]"
        >
          <ChevronLeft className="mr-2 h-5 w-5" /> Ulang dari awal
        </Button>
        <Button
          size="lg"
          onClick={resetAll}
          className="h-12 rounded-2xl bg-[#2DB67D] px-8 text-base font-extrabold text-white shadow-lg hover:bg-[#27a070]"
        >
          <RotateCcw className="mr-2 h-5 w-5" /> Mulai misi baru
        </Button>
      </div>
    </div>
  );
}
