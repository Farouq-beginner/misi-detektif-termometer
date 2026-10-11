"use client";

export default function SplashScreen() {
  return (
    <main className="fixed inset-0 z-200 grid h-dvh w-screen place-items-center overflow-hidden bg-[#16263A] px-4">
      <div className="rounded-3xl bg-white/95 px-8 py-7 text-center shadow-[0_30px_60px_rgba(31,42,68,0.35)] sm:px-12 sm:py-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#5B6B85]">
          disusun oleh:
        </p>
        <p className="mt-2 text-3xl font-extrabold text-[#1F2A44] sm:text-5xl">
          Zindo Iviantri
        </p>
        <div className="mx-auto mt-5 h-1.5 w-32 overflow-hidden rounded-full bg-[#D7E4F0]">
          <div className="splash-loading h-full w-2/3 rounded-full bg-[#2777BA]" />
        </div>
      </div>
    </main>
  );
}
