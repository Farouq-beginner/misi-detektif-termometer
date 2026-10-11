"use client";

import { useGameStore, QUIZ_QUESTIONS } from "@/store/useGameStore";
import { Button } from "@/components/ui/button";
import GarisBilangan from "../GarisBilangan";
import { Check, X, ArrowRight, Trophy, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";

const optColor = "#5B6B85";

export default function Screen5TebakTitik() {
  const {
    quizIndex,
    quizScore,
    quizAnswered,
    quizSelected,
    quizFinished,
    answerQuiz,
    nextQuiz,
    resetQuiz,
  } = useGameStore();

  const q = QUIZ_QUESTIONS[quizIndex];
  const total = QUIZ_QUESTIONS.length;

  // rentang garis tetap untuk semua soal
  const min = -40;
  const max = 40;

  if (quizFinished) {
    const pct = Math.round((quizScore / total) * 100);
    const praise =
      pct === 100 ? "Sempurna! Kamu Detektif Termometer sejati! 🏆" :
      pct >= 75 ? "Hebat! Paham sekali bilangan bulat! ⭐" :
      pct >= 50 ? "Bagus! Terus berlatih ya! 💪" :
      "Jangan menyerah, coba lagi yuk! 🌱";
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-10 text-center">
        <div className="termo-pop termo-card flex flex-col items-center gap-4 p-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#FF8A3D]/10">
            <Trophy className="h-12 w-12 text-[#FF8A3D]" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#1F2A44] sm:text-4xl">
            Misi Tebak Titik Selesai!
          </h2>
          <div className="rounded-2xl bg-[#1E6FD9]/8 px-8 py-4">
            <div className="text-5xl font-extrabold text-[#1E6FD9] sm:text-6xl">
              {quizScore}
              <span className="text-2xl text-[#5B6B85]"> / {total}</span>
            </div>
            <p className="mt-1 text-sm font-bold text-[#5B6B85]">Jawaban benar</p>
          </div>
          <p className="text-lg font-bold text-[#2DB67D]">{praise}</p>
          <Button
            size="lg"
            onClick={resetQuiz}
            className="h-12 rounded-2xl bg-[#1E6FD9] px-8 text-base font-extrabold text-white shadow-lg hover:bg-[#1a60c0]"
          >
            <RotateCcw className="mr-2 h-5 w-5" /> Ulang tebak titik
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5 px-4 py-6 sm:py-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-[#1F2A44] sm:text-5xl">
          Tebak <span className="text-[#1E6FD9]">Titik</span>
        </h2>
        <p className="mt-2 text-lg font-semibold text-[#5B6B85] sm:text-xl">
          Titik <span className="font-extrabold text-[#7B5CD6]">?</span> ada di bilangan berapa?
        </p>
      </div>

      {/* progress + skor */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#1E6FD9] px-3 py-1 text-sm font-extrabold text-white">
            Soal {quizIndex + 1} / {total}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[#FF8A3D]/10 px-3 py-1">
          <Trophy className="h-4 w-4 text-[#FF8A3D]" />
          <span className="text-sm font-extrabold text-[#FF8A3D]">Skor: {quizScore}</span>
        </div>
      </div>

      {/* bar progress */}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#EAF6FF]">
        <div
          className="h-full rounded-full bg-[#1E6FD9] transition-all duration-300"
          style={{ width: `${((quizIndex + (quizAnswered ? 1 : 0)) / total) * 100}%` }}
        />
      </div>

      {/* garis bilangan dengan titik ? */}
      <div className="termo-card p-4 sm:p-6">
        <GarisBilangan
          min={min}
          max={max}
          step={1}
          markers={[{ value: q.answer, isQuestion: true }]}
          showArrows={false}
        />
      </div>

      {/* pilihan jawaban */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {q.options.map((opt) => {
          const isCorrect = opt === q.answer;
          const isSelected = opt === quizSelected;
          let cls = "border-[#1E6FD9]/30 bg-white text-[#1F2A44] hover:bg-[#EAF6FF]";
          let icon: ReactNode = null;
          if (quizAnswered) {
            if (isCorrect) {
              cls = "border-[#2DB67D] bg-[#2DB67D]/10 text-[#1F2A44]";
              icon = <Check className="mr-1 h-5 w-5 text-[#2DB67D]" />;
            } else if (isSelected) {
              cls = "border-[#E5484D] bg-[#E5484D]/10 text-[#1F2A44]";
              icon = <X className="mr-1 h-5 w-5 text-[#E5484D]" />;
            } else {
              cls = "border-[#DCE9F5] bg-[#F1F6FB] text-[#5B6B85] opacity-70";
            }
          }
          return (
            <Button
              key={opt}
              disabled={quizAnswered}
              onClick={() => answerQuiz(opt)}
              className={`h-20 rounded-2xl border-2 text-2xl font-extrabold shadow-sm transition-all ${cls}`}
              style={{ color: quizAnswered ? (isCorrect ? "#2DB67D" : isSelected ? "#E5484D" : optColor) : opt < 0 ? "#1E6FD9" : opt > 0 ? "#FF8A3D" : "#7B5CD6" }}
            >
              {icon}
              {opt > 0 ? `+${opt}` : opt}
            </Button>
          );
        })}
      </div>

      {/* feedback + next */}
      {quizAnswered && (
        <div className="termo-pop flex flex-col items-center gap-3">
          <div
            className={`rounded-2xl px-5 py-3 text-center ${
              quizSelected === q.answer ? "bg-[#2DB67D]/10" : "bg-[#E5484D]/10"
            }`}
          >
            <p
              className={`text-lg font-extrabold ${
                quizSelected === q.answer ? "text-[#2DB67D]" : "text-[#E5484D]"
              }`}
            >
              {quizSelected === q.answer
                ? "Benar! "
                : `Belum tepat. Jawabannya `}
              <span className="text-[#1F2A44]">
                {quizSelected === q.answer ? "" : `${q.answer > 0 ? "+" : ""}${q.answer}`}
              </span>
            </p>
          </div>
          <Button
            size="lg"
            onClick={nextQuiz}
            className="h-12 rounded-2xl bg-[#1E6FD9] px-8 text-base font-extrabold text-white shadow-lg hover:bg-[#1a60c0]"
          >
            {quizIndex + 1 >= total ? "Lihat hasil" : "Soal berikutnya"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
