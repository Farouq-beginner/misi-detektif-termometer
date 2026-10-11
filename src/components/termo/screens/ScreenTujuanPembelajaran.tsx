"use client";

import { Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/useGameStore";

export default function ScreenTujuanPembelajaran() {
  const nextScreen = useGameStore((state) => state.nextScreen);

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-7 px-4 py-8 sm:py-12">
      <div className="text-center termo-pop">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#269B91] px-4 py-1.5 text-white shadow-md">
          <Target className="h-4 w-4" />
          <span className="text-sm font-bold tracking-wide">
            Misi Pembelajaran
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#1F2A44] sm:text-5xl">
          Tujuan <span className="text-[#269B91]">Pembelajaran</span>
        </h1>
      </div>

      <section className="termo-card w-full border-2 border-[#269B91]/20 bg-white p-6 sm:p-10">
        <p className="text-center text-lg font-semibold leading-relaxed text-[#1F2A44] sm:text-2xl">
          Melalui demonstrasi visual, latihan terbimbing berkelompok, dan
          latihan mandiri berbantuan media digital, peserta didik dapat:
        </p>

        <div className="mt-7 rounded-2xl bg-[#E6F5E9] p-5 sm:p-7">
          <ul className="space-y-4 text-base font-medium leading-relaxed text-[#36506B] sm:text-lg">
            <li className="flex gap-3">
              <span className="mt-1 grid h-6 w-7 shrink-0 place-items-center rounded-full bg-[#269B91] text-sm font-extrabold text-white">
                1
              </span>
              <span>Menjelaskan bilangan bulat.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 grid h-6 w-7 shrink-0 place-items-center rounded-full bg-[#269B91] text-sm font-extrabold text-white">
                2
              </span>
              <span>Membandingkan dan mengurutkan bilangan bulat.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 grid h-6 w-7 shrink-0 place-items-center rounded-full bg-[#269B91] text-sm font-extrabold text-white">
                3
              </span>
              <span>
                Memecahkan masalah kontekstual dengan alasan berbasis angka.
              </span>
            </li>
          </ul>
        </div>
      </section>

      <Button
        size="lg"
        onClick={nextScreen}
        className="mt-5 h-14 rounded-2xl bg-[#269B91] px-8 text-lg font-extrabold text-white shadow-lg hover:bg-[#20877e]"
      >
        Lanjut ke Video Pemantik
      </Button>
    </div>
  );
}
