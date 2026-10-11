"use client";

import { useGameStore } from "@/store/useGameStore";
import TeacherBar from "@/components/termo/TeacherBar";
import MascotOverlay from "@/components/termo/MascotOverlay";
import ScreenCover from "@/components/termo/screens/ScreenCover";
import ScreenVideoPemantik from "@/components/termo/screens/ScreenVideoPemantik";
import Screen1Pembuka from "@/components/termo/screens/Screen1Pembuka";
import Screen2KenaliBulat from "@/components/termo/screens/Screen2KenaliBulat";
import Screen3SiapaDingin from "@/components/termo/screens/Screen3SiapaDingin";
import Screen4Urutkan from "@/components/termo/screens/Screen4Urutkan";
import Screen5TebakTitik from "@/components/termo/screens/Screen5TebakTitik";
import Screen6Penutup from "@/components/termo/screens/Screen6Penutup";

export default function Home() {
  const screen = useGameStore((s) => s.screen);

  return (
    <div className="termo-bg flex min-h-screen flex-col">
      <TeacherBar />

      <main className="flex-1">
        <div key={screen} className="termo-pop">
          {screen === 1 && <ScreenCover />}
          {screen === 2 && <ScreenVideoPemantik />}
          {screen === 3 && <Screen1Pembuka />}
          {screen === 4 && <Screen2KenaliBulat />}
          {screen === 5 && <Screen3SiapaDingin />}
          {screen === 6 && <Screen4Urutkan />}
          {screen === 7 && <Screen5TebakTitik />}
          {screen === 8 && <Screen6Penutup />}
        </div>
      </main>

      <MascotOverlay />

      <footer className="mt-auto border-t border-[#DCE9F5] bg-white/70 px-4 py-3 text-center backdrop-blur-sm">
        <p className="text-sm font-semibold text-[#5B6B85] sm:text-base">
          🔍 Misi Detektif Termometer · Belajar Bilangan Bulat · Gunakan tombol{" "}
          <kbd className="rounded bg-[#EAF6FF] px-1.5 py-0.5 font-mono text-[#1E6FD9]">←</kbd>{" "}
          <kbd className="rounded bg-[#EAF6FF] px-1.5 py-0.5 font-mono text-[#1E6FD9]">→</kbd>{" "}
          untuk pindah layar ·{" "}
          <kbd className="rounded bg-[#EAF6FF] px-1.5 py-0.5 font-mono text-[#1E6FD9]">Spasi</kbd>{" "}
          untuk jawaban
        </p>
      </footer>
    </div>
  );
}
