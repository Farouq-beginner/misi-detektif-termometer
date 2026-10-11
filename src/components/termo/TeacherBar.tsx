"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  RotateCcw,
  SwitchCamera,
  Keyboard,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function TeacherBar() {
  const {
    screen,
    nextScreen,
    prevScreen,
    context,
    toggleContext,
    isFullscreen,
    setFullscreen,
    resetAll,
  } = useGameStore();

  // Fullscreen API
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setFullscreen(true);
      } else {
        await document.exitFullscreen();
        setFullscreen(false);
      }
    } catch {
      // ignore
    }
  };

  // listener perubahan fullscreen
  useEffect(() => {
    const onChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [setFullscreen]);

  // pintasan keyboard guru
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable;
      if (typing) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextScreen();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevScreen();
      } else if (e.code === "Space") {
        e.preventDefault();
        triggerSpaceAction();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen, nextScreen, prevScreen]);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-2 border-b border-[#DCE9F5] bg-white/85 px-3 py-2 backdrop-blur-md sm:px-5">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={prevScreen}
                disabled={screen <= 1}
                aria-label="Layar sebelumnya"
                className="h-10 w-10 rounded-xl border-[#1E6FD9]/30 text-[#1E6FD9] hover:bg-[#EAF6FF]"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Sebelumnya (←)</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex items-center gap-1.5 rounded-xl bg-[#EAF6FF] px-3 py-2">
          <span className="text-sm font-bold text-[#5B6B85]">Layar</span>
          <span className="text-lg font-extrabold text-[#1E6FD9]">{screen}</span>
          <span className="text-sm font-bold text-[#5B6B85]">/ 9</span>
        </div>

        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={nextScreen}
                disabled={screen >= 9}
                aria-label="Layar berikutnya"
                className="h-10 w-10 rounded-xl border-[#1E6FD9]/30 text-[#1E6FD9] hover:bg-[#EAF6FF]"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Berikutnya (→)</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* indikator konteks */}
      <div className="hidden md:flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-xl border border-[#DCE9F5] px-3 py-1.5">
          <SwitchCamera className="h-4 w-4 text-[#7B5CD6]" />
          <span className="text-base font-semibold text-[#1F2A44]">
            {context === "suhu" ? "Konteks: Suhu Kota" : "Konteks: Kedalaman Laut"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleContext}
                className="rounded-xl border-[#7B5CD6]/40 text-[#7B5CD6] hover:bg-[#7B5CD6]/10"
              >
                <SwitchCamera className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Ganti Konteks</span>
                <span className="sm:hidden">Konteks</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ganti konteks (suhu ↔ kedalaman laut)</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFullscreen}
                aria-label="Layar penuh"
                className="h-10 w-10 rounded-xl border-[#1E6FD9]/30 text-[#1E6FD9] hover:bg-[#EAF6FF]"
              >
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isFullscreen ? "Keluar layar penuh" : "Layar penuh"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetAll}
                aria-label="Ulang misi"
                className="h-10 w-10 rounded-xl text-[#5B6B85] hover:bg-[#EAF6FF]"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ulang misi dari awal</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="hidden lg:flex items-center gap-2 rounded-xl bg-[#F1F6FB] px-3 py-2 text-sm font-semibold text-[#5B6B85]">
          <Keyboard className="h-4 w-4" />
          ←/→ pindah · spasi jawab
        </div>
      </div>
    </header>
  );
}

/** Spasi membuka/menjawab sesuai layar aktif. */
function triggerSpaceAction() {
  const st = useGameStore.getState();
  switch (st.screen) {
    case 3:
      st.setLayar1Answer(!st.layar1AnswerShown);
      break;
    case 5:
      if (!st.layar3Result) st.checkLayar3();
      else st.resetLayar3();
      break;
    case 6:
      if (!st.layar4Checked) st.checkLayar4();
      break;
    case 7:
      if (st.quizAnswered && !st.quizFinished) st.nextQuiz();
      break;
  }
}
