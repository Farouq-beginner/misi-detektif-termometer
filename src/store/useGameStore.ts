import { create } from "zustand";

export type GameContext = "suhu" | "kedalaman";

export type CityItem = {
  id: string;
  name: string;
  value: number;
  icon: string; // emoji cuaca
  context: GameContext;
};

export type MascotMood = "neutral" | "happy" | "think" | "sad";

export type ScreenId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const CITIES: CityItem[] = [
  { id: "seoul", name: "Seoul", value: -2, icon: "🌤️", context: "suhu" },
  { id: "tokyo", name: "Tokyo", value: 6, icon: "☀️", context: "suhu" },
  { id: "titlis", name: "Titlis", value: -14, icon: "❄️", context: "suhu" },
  { id: "oymyakon", name: "Oymyakon", value: -31, icon: "🥶", context: "suhu" },
  { id: "kupang", name: "Kupang", value: 30, icon: "🌞", context: "suhu" },
  { id: "puncakjaya", name: "Puncak Jaya", value: -4, icon: "🏔️", context: "suhu" },
];

export const SEA_ITEMS: CityItem[] = [
  { id: "kapal", name: "Kapal Selam", value: -100, icon: "🚢", context: "kedalaman" },
  { id: "burung", name: "Burung", value: 150, icon: "🐦", context: "kedalaman" },
];

export const CONTEXT_META: Record<
  GameContext,
  { label: string; unit: string; langkahBilang: string; kiriLabel: string; kananLabel: string }
> = {
  suhu: {
    label: "Suhu Kota Dunia",
    unit: "°C",
    langkahBilang: "derajat Celsius",
    kiriLabel: "di kiri 0",
    kananLabel: "di kanan 0",
  },
  kedalaman: {
    label: "Kedalaman Laut",
    unit: " m",
    langkahBilang: "meter",
    kiriLabel: "di bawah permukaan laut",
    kananLabel: "di atas permukaan laut",
  },
};

interface QuizQuestion {
  id: number;
  prompt: string;
  options: number[];
  answer: number;
}

// 8 soal tebak titik (rentang -40 sampai 35)
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 1, prompt: "Titik ? ada di bilangan berapa?", options: [-10, -5, 0, 5], answer: -5 },
  { id: 2, prompt: "Titik ? ada di bilangan berapa?", options: [-20, -15, -25, -10], answer: -15 },
  { id: 3, prompt: "Titik ? ada di bilangan berapa?", options: [10, 15, 5, 0], answer: 10 },
  { id: 4, prompt: "Titik ? ada di bilangan berapa?", options: [-30, -25, -35, -20], answer: -25 },
  { id: 5, prompt: "Titik ? ada di bilangan berapa?", options: [20, 25, 15, 30], answer: 25 },
  { id: 6, prompt: "Titik ? ada di bilangan berapa?", options: [-5, -2, 0, 2], answer: -2 },
  { id: 7, prompt: "Titik ? ada di bilangan berapa?", options: [-40, -35, -45, -30], answer: -35 },
  { id: 8, prompt: "Titik ? ada di bilangan berapa?", options: [30, 35, 25, 20], answer: 30 },
];

interface GameState {
  screen: ScreenId;
  context: GameContext;
  mascotMood: MascotMood;
  mascotSpeech: string;
  // Layar 1
  layar1AnswerShown: boolean;
  // Layar 3
  selectedCityA: string | null;
  selectedCityB: string | null;
  guessColder: "A" | "B" | null;
  layar3Result: { a: string; b: string; guess: "A" | "B"; correct: boolean } | null;
  // Layar 4
  orderedCards: string[]; // id kota sesuai urutan di garis
  layar4HintLevel: number;
  layar4Checked: boolean;
  layar4Correct: boolean | null;
  // Layar 5
  quizIndex: number;
  quizScore: number;
  quizAnswered: boolean;
  quizSelected: number | null;
  quizFinished: boolean;
  // fullscreen & ui
  isFullscreen: boolean;
  teacherOpen: boolean;
  // actions
  setScreen: (s: ScreenId) => void;
  nextScreen: () => void;
  prevScreen: () => void;
  toggleContext: () => void;
  setContext: (c: GameContext) => void;
  setMascot: (mood: MascotMood, speech?: string) => void;
  setLayar1Answer: (v: boolean) => void;
  setCityA: (id: string) => void;
  setCityB: (id: string) => void;
  setGuessColder: (g: "A" | "B") => void;
  checkLayar3: () => void;
  resetLayar3: () => void;
  setOrderedCards: (ids: string[]) => void;
  checkLayar4: () => void;
  hintLayar4: () => void;
  resetLayar4: (ids: string[]) => void;
  answerQuiz: (opt: number) => void;
  nextQuiz: () => void;
  resetQuiz: () => void;
  setFullscreen: (v: boolean) => void;
  toggleTeacher: () => void;
  resetAll: () => void;
}

const initialOrdered = ["oymyakon", "titlis", "seoul", "tokyo", "kupang"];

export const useGameStore = create<GameState>((set, get) => ({
  screen: 1,
  context: "suhu",
  mascotMood: "neutral",
  mascotSpeech: "Hai Detektif! Siap menjelajahi suhu dunia?",
  layar1AnswerShown: false,
  selectedCityA: "oymyakon",
  selectedCityB: "seoul",
  guessColder: null,
  layar3Result: null,
  orderedCards: initialOrdered,
  layar4HintLevel: 0,
  layar4Checked: false,
  layar4Correct: null,
  quizIndex: 0,
  quizScore: 0,
  quizAnswered: false,
  quizSelected: null,
  quizFinished: false,
  isFullscreen: false,
  teacherOpen: false,

  setScreen: (s) =>
    set({ screen: s, mascotMood: "neutral", mascotSpeech: defaultSpeech(s) }),
  nextScreen: () => {
    const s = get().screen;
    if (s < 8) set({ screen: (s + 1) as ScreenId, mascotMood: "neutral", mascotSpeech: defaultSpeech((s + 1) as ScreenId) });
  },
  prevScreen: () => {
    const s = get().screen;
    if (s > 1) set({ screen: (s - 1) as ScreenId, mascotMood: "neutral", mascotSpeech: defaultSpeech((s - 1) as ScreenId) });
  },
  toggleContext: () =>
    set((st) => ({
      context: st.context === "suhu" ? "kedalaman" : "suhu",
      selectedCityA: st.context === "suhu" ? "kapal" : "oymyakon",
      selectedCityB: st.context === "suhu" ? "burung" : "seoul",
      guessColder: null,
      layar3Result: null,
      orderedCards: st.context === "suhu" ? ["kapal"] : initialOrdered,
      layar4Checked: false,
      layar4Correct: null,
      layar4HintLevel: 0,
      quizIndex: 0,
      quizScore: 0,
      quizAnswered: false,
      quizSelected: null,
      quizFinished: false,
      mascotMood: "neutral",
      mascotSpeech: "Konteks diganti! Yuk kita lihat bilangan bulatnya.",
    })),
  setContext: (c) => set({ context: c }),
  setMascot: (mood, speech) =>
    set((st) => ({
      mascotMood: mood,
      ...(speech !== undefined ? { mascotSpeech: speech } : {}),
    })),
  setLayar1Answer: (v) => set({ layar1AnswerShown: v }),
  setCityA: (id) => set({ selectedCityA: id, layar3Result: null, guessColder: null }),
  setCityB: (id) => set({ selectedCityB: id, layar3Result: null, guessColder: null }),
  setGuessColder: (g) => set({ guessColder: g }),
  checkLayar3: () => {
    const { selectedCityA, selectedCityB, guessColder, context } = get();
    if (!selectedCityA || !selectedCityB || selectedCityA === selectedCityB || !guessColder) return;
    const pool = context === "suhu" ? CITIES : SEA_ITEMS;
    const a = pool.find((c) => c.id === selectedCityA)!;
    const b = pool.find((c) => c.id === selectedCityB)!;
    // kota yang ditebak lebih dingin
    const guessed = guessColder === "A" ? a : b;
    const other = guessColder === "A" ? b : a;
    const correct = guessed.value < other.value;
    const speech = correct
      ? `Tepat! ${guessed.name} lebih dingin dari ${other.name}.`
      : `Hmm, lihat lagi garis bilangannya. Yang mana lebih ke kiri?`;
    set({
      layar3Result: { a: selectedCityA, b: selectedCityB, guess: guessColder, correct },
      mascotMood: correct ? "happy" : "think",
      mascotSpeech: speech,
    });
  },
  resetLayar3: () => set({ layar3Result: null, guessColder: null }),
  setOrderedCards: (ids) => set({ orderedCards: ids, layar4Checked: false, layar4Correct: null, layar4HintLevel: 0 }),
  checkLayar4: () => {
    const { orderedCards, context } = get();
    const pool = context === "suhu" ? CITIES : SEA_ITEMS;
    const values = orderedCards.map((id) => pool.find((c) => c.id === id)?.value ?? 0);
    const sortedAsc = [...values].sort((x, y) => x - y);
    const correct = JSON.stringify(values) === JSON.stringify(sortedAsc);
    const speech = correct
      ? "Hebat! Urutannya dari paling dingin sudah benar."
      : "Coba lihat lagi. Cari dulu letak 0 di garis bilangan.";
    set({
      layar4Checked: true,
      layar4Correct: correct,
      mascotMood: correct ? "happy" : "think",
      mascotSpeech: speech,
    });
  },
  hintLayar4: () =>
    set((st) => ({
      layar4HintLevel: Math.min(2, st.layar4HintLevel + 1),
      mascotMood: "think",
      mascotSpeech:
        st.layar4HintLevel + 1 >= 2
          ? "Kartu mana yang paling kiri? Itu yang paling dingin."
          : "Cari dulu letak 0 di garis bilangan.",
    })),
  resetLayar4: (ids) =>
    set({
      orderedCards: ids,
      layar4Checked: false,
      layar4Correct: null,
      layar4HintLevel: 0,
    }),
  answerQuiz: (opt) => {
    const { quizIndex, quizScore, quizAnswered } = get();
    if (quizAnswered) return;
    const q = QUIZ_QUESTIONS[quizIndex];
    const correct = opt === q.answer;
    set({
      quizSelected: opt,
      quizAnswered: true,
      quizScore: correct ? quizScore + 1 : quizScore,
      mascotMood: correct ? "happy" : "sad",
      mascotSpeech: correct ? "Hebat! Itu jawaban yang benar." : "Belum tepat. Lihat baik-baik garis bilangannya ya.",
    });
  },
  nextQuiz: () => {
    const { quizIndex } = get();
    if (quizIndex + 1 >= QUIZ_QUESTIONS.length) {
      set({ quizFinished: true, mascotMood: "happy", mascotSpeech: "Misi tebak titik selesai! Lihat skormu." });
      return;
    }
    set({
      quizIndex: quizIndex + 1,
      quizAnswered: false,
      quizSelected: null,
      mascotMood: "neutral",
      mascotSpeech: "Ayo tebak titik berikutnya!",
    });
  },
  resetQuiz: () =>
    set({
      quizIndex: 0,
      quizScore: 0,
      quizAnswered: false,
      quizSelected: null,
      quizFinished: false,
      mascotMood: "neutral",
      mascotSpeech: "Ayo mulai tebak titik!",
    }),
  setFullscreen: (v) => set({ isFullscreen: v }),
  toggleTeacher: () => set((st) => ({ teacherOpen: !st.teacherOpen })),
  resetAll: () =>
    set({
      screen: 1,
      context: "suhu",
      mascotMood: "neutral",
      mascotSpeech: "Hai Detektif! Siap menjelajahi suhu dunia?",
      layar1AnswerShown: false,
      selectedCityA: "oymyakon",
      selectedCityB: "seoul",
      guessColder: null,
      layar3Result: null,
      orderedCards: initialOrdered,
      layar4HintLevel: 0,
      layar4Checked: false,
      layar4Correct: null,
      quizIndex: 0,
      quizScore: 0,
      quizAnswered: false,
      quizSelected: null,
      quizFinished: false,
    }),
}));

function defaultSpeech(s: ScreenId): string {
  switch (s) {
    case 1:
      return "Selamat datang di pembelajaran bilangan bulat!";
    case 2:
      return "Simak video pemantik sebelum memulai misi.";
    case 3:
      return "Hai Detektif! Siap menjelajahi suhu dunia?";
    case 4:
      return "Geser termometernya, lihat garis bilangannya ikut bergerak!";
    case 5:
      return "Pilih dua kota, lalu bandingkan. Siapa lebih dingin?";
    case 6:
      return "Tarik kartu kota ke garis bilangan, urutkan dari paling dingin!";
    case 7:
      return "Ayo tebak titik ? di garis bilangan!";
    case 8:
      return "Kesimpulan misi sudah siap. Bagus sekali, Detektif!";
  }
}

// Helper: dapatkan item sesuai konteks
export function getItems(context: GameContext): CityItem[] {
  return context === "suhu" ? CITIES : SEA_ITEMS;
}
