"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { Button } from "@/components/ui/button";
import { Snowflake, Thermometer, Eye } from "lucide-react";
import Termometer from "../Termometer";

export default function Screen1Pembuka() {
  const { layar1AnswerShown, setLayar1Answer, nextScreen, setMascot } = useGameStore();
  // animasi suhu turun dari 12 ke -4
  const [temp, setTemp] = useState(12);

  useEffect(() => {
    let raf: number;
    let cur = 12;
    const step = () => {
      cur -= 0.4;
      if (cur <= -4) {
        setTemp(-4);
        setMascot("think", "Brrr... Dingin sekali! Bagaimana menulis suhunya?");
        return;
      }
      setTemp(cur);
      raf = requestAnimationFrame(step);
    };
    const t = setTimeout(() => {
      raf = requestAnimationFrame(step);
    }, 600);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-6 sm:py-10">
      {/* judul */}
      <div className="text-center termo-pop">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#1E6FD9] px-4 py-1.5 text-white shadow-md">
          <Thermometer className="h-4 w-4" />
          <span className="text-sm font-bold tracking-wide">Misi Matematika SMP</span>
        </div>
        <h1 className="text-4xl font-extrabold leading-tight text-[#1F2A44] sm:text-6xl">
          Misi Detektif <span className="text-[#1E6FD9]">Termometer</span>
        </h1>
        <p className="mt-3 text-xl font-semibold text-[#5B6B85] sm:text-2xl">
          Jelajahi suhu kota-kota dunia!
        </p>
      </div>

      <div className="grid w-full items-center gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* pemandangan Puncak Jaya + termometer */}
        <div className="termo-card relative overflow-hidden p-0">
          <div className="relative h-[300px] sm:h-[360px]">
            {/* langit */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#BFE0FF] via-[#EAF6FF] to-white" />
            {/* matahari kecil */}
            <div className="absolute right-6 top-6 h-10 w-10 rounded-full bg-[#FFD66B] opacity-80" />
            {/* gunung */}
            <svg viewBox="0 0 400 200" className="absolute bottom-0 left-0 w-full" preserveAspectRatio="none" style={{ height: 160 }}>
              <polygon points="0,200 90,70 160,140 230,40 320,150 400,90 400,200" fill="#9BB5C9" />
              <polygon points="60,200 120,110 180,160 260,80 330,170 400,120 400,200" fill="#7E9CB4" />
              {/* salju puncak */}
              <polygon points="210,55 230,40 250,60 240,70 230,64 220,72" fill="#FFFFFF" />
              <polygon points="80,82 90,70 100,86 92,90 86,86" fill="#FFFFFF" />
            </svg>
            {/* butiran salju */}
            <div className="absolute inset-0">
              {[...Array(14)].map((_, i) => (
                <Snowflake
                  key={i}
                  className="absolute text-white/80 animate-pulse"
                  style={{
                    left: `${(i * 37) % 96}%`,
                    top: `${(i * 29) % 60}%`,
                    width: `${10 + (i % 4) * 4}px`,
                    height: `${10 + (i % 4) * 4}px`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
            {/* label kota */}
            <div className="absolute left-4 top-4 rounded-xl bg-white/90 px-3 py-1.5 shadow-md">
              <span className="text-sm font-extrabold text-[#1E6FD9]">🏔️ Puncak Jaya, Papua</span>
            </div>
            {/* termometer */}
            <div className="absolute bottom-2 right-4">
              <Termometer value={Math.round(temp)} min={-40} max={40} height={320} />
            </div>
          </div>
        </div>

        {/* penjelasan + jawaban */}
        <div className="flex flex-col gap-4">
          <div className="termo-card p-5 sm:p-6">
            <p className="text-lg font-semibold leading-relaxed text-[#1F2A44] sm:text-xl">
              Suhu di Puncak Jaya, Papua, bisa{" "}
              <span className="rounded-md bg-[#1E6FD9]/10 px-1.5 font-extrabold text-[#1E6FD9]">
                3 sampai 5 derajat di bawah nol
              </span>
              . Bagaimana menuliskannya dalam matematika?
            </p>
          </div>

          {!layar1AnswerShown ? (
            <Button
              size="lg"
              onClick={() => setLayar1Answer(true)}
              className="h-14 w-full rounded-2xl bg-[#7B5CD6] text-lg font-extrabold text-white shadow-lg hover:bg-[#6a4dc4]"
            >
              <Eye className="mr-2 h-5 w-5" />
              Lihat jawabannya
            </Button>
          ) : (
            <div className="termo-pop termo-card border-2 border-[#2DB67D]/30 bg-[#2DB67D]/5 p-5 sm:p-6">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-[#2DB67D] px-2.5 py-0.5 text-xs font-extrabold text-white">JAWABAN</span>
              </div>
              <p className="text-xl font-bold leading-relaxed text-[#1F2A44] sm:text-2xl">
                <span className="font-extrabold text-[#1E6FD9]">−4°C</span> artinya{" "}
                <span className="text-[#1E6FD9]">4 derajat di bawah 0°C</span>.
              </p>
              <p className="mt-2 text-base font-medium text-[#5B6B85] sm:text-lg">
                Tanda minus (−) menunjukkan suhunya{" "}
                <span className="font-bold text-[#1E6FD9]">di bawah nol</span>.
              </p>
            </div>
          )}

          <Button
            size="lg"
            onClick={nextScreen}
            className="h-14 w-full rounded-2xl bg-[#1E6FD9] text-lg font-extrabold text-white shadow-lg hover:bg-[#1a60c0]"
          >
            Mulai Misi
          </Button>
        </div>
      </div>
    </div>
  );
}
