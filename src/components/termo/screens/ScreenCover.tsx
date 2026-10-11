"use client";

import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/useGameStore";
import GarisBilangan from "../GarisBilangan";

export default function ScreenCover() {
  const nextScreen = useGameStore((state) => state.nextScreen);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-145px)] max-w-6xl items-center justify-center px-4 py-8 sm:py-12">
      <section className="w-full overflow-hidden rounded-[2rem] border border-[#D7E4F0] bg-white shadow-[0_24px_70px_rgba(31,42,68,0.14)]">
        <div className="bg-[#F3F7FB] px-5 pb-8 pt-8 sm:px-12 sm:pb-12 sm:pt-10">
          <div className="text-center">
            <p className="font-serif text-4xl font-extrabold tracking-tight text-[#1F3B5D] sm:text-6xl">
              Bilangan Bulat
            </p>
            <p className="mt-1 font-serif text-2xl font-bold text-[#269B91] sm:text-4xl">
              dan Operasi Bilangan
            </p>
            <p className="mt-3 font-serif text-lg font-bold italic text-[#E36D50] sm:text-2xl">
              Bab 1 · Pembelajaran Langsung (Direct Instruction) Berbasis TIK
            </p>
          </div>

          {/* garis bilangan mini: komponen yang sama dengan layer-layer lain */}
          <div className="mx-auto mt-8 max-w-5xl rounded-2xl bg-white/70 p-4 sm:p-6">
            <div className="mb-1 flex items-center justify-between text-base font-extrabold sm:text-lg">
              <span className="text-[#E36D50]">BILANGAN BULAT NEGATIF</span>
              <span className="text-[#269B91]">NOL</span>
              <span className="text-[#2777BA]">BILANGAN BULAT POSITIF</span>
            </div>
            <GarisBilangan
              min={-5}
              max={5}
              step={1}
              height={240}
              showArrows={true}
              markers={[
                { value: 0, color: "#7B5CD6" },
              ]}
            />
            <div className="mt-2 flex justify-between px-6 text-center text-sm font-semibold text-[#5B6B85] sm:text-base">
              <span>semakin ke kiri,<br />nilai semakin kecil</span>
              <span>semakin ke kanan,<br />nilai semakin besar</span>
            </div>
          </div>

          <div className="mx-auto mt-6 grid max-w-5xl gap-5 rounded-2xl bg-white/70 p-4 sm:grid-cols-3 sm:p-6">
            <div className="flex items-center gap-3 rounded-xl bg-[#FDEDE4] p-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#E36D50] text-3xl font-black text-white">−</span>
              <p className="text-base text-[#5B6B85]"><strong className="text-lg text-[#E36D50]">Bilangan negatif</strong><br />suhu di bawah nol, utang, kedalaman di bawah laut</p>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-[#E6F5E9] p-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#269B91] text-3xl font-black text-white">0</span>
              <p className="text-base text-[#5B6B85]"><strong className="text-lg text-[#269B91]">Nol</strong><br />titik acuan; bukan positif dan bukan negatif</p>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-[#E5F0FB] p-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#2777BA] text-3xl font-black text-white">+</span>
              <p className="text-base text-[#5B6B85]"><strong className="text-lg text-[#2777BA]">Bilangan positif</strong><br />suhu di atas nol, tabungan, ketinggian di atas laut</p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button onClick={nextScreen} size="lg" className="h-14 rounded-2xl bg-[#2777BA] px-8 text-lg font-extrabold text-white shadow-lg hover:bg-[#1f659f]">
              <BookOpen className="mr-2 h-5 w-5" />
              Mulai Pembelajaran
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
