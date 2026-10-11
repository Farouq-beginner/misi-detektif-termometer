"use client";

import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import SiTermo from "./SiTermo";
import SpeechBubble from "./SpeechBubble";

const STORAGE_KEY = "termo-mascot-pos";

/** Memastikan posisi (x,y) tetap berada di dalam viewport. */
function clampPos(x: number, y: number, w: number, h: number) {
  return {
    x: Math.max(8, Math.min(window.innerWidth - w - 8, x)),
    y: Math.max(8, Math.min(window.innerHeight - h - 8, y)),
  };
}

/** Ukuran area grup maskot (untuk clamp). */
function groupSize(el: HTMLDivElement | null) {
  const rect = el?.getBoundingClientRect();
  return { w: rect?.width ?? 220, h: rect?.height ?? 120 };
}

/**
 * Maskot Si Termo yang bisa digeser-geser (drag) dengan cursor mouse maupun jari (touch).
 * - Posisi disimpan ke localStorage supaya tetap di tempat yang sama setelah refresh.
 * - Balon kata otomatis pindah ke sisi yang berlawanan agar tidak keluar layar.
 * - Maskot selalu dijaga tetap di dalam viewport.
 */
export default function MascotOverlay() {
  const mascotMood = useGameStore((s) => s.mascotMood);
  const mascotSpeech = useGameStore((s) => s.mascotSpeech);

  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const groupRef = useRef<HTMLDivElement>(null);
  const offset = useRef({ x: 0, y: 0 });
  const moved = useRef(false);

  // inisialisasi posisi (default: pojok kiri bawah) + restore dari localStorage.
  // Hanya bisa dilakukan di client (akses window/localStorage) -> setState di effect
  // memang diperlukan agar tidak terjadi hydration mismatch.
  useEffect(() => {
    let initial = { x: 16, y: window.innerHeight - 230 };
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        if (typeof p.x === "number" && typeof p.y === "number") {
          initial = p;
        }
      }
    } catch {
      /* abaikan */
    }
    const { w, h } = groupSize(groupRef.current);
    setPos(clampPos(initial.x, initial.y, w, h));
    const t = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(t);
  }, []);

  // jaga tetap di dalam viewport saat ukuran jendela berubah
  useEffect(() => {
    const onResize = () => {
      setPos((p) => {
        if (!p) return p;
        const { w, h } = groupSize(groupRef.current);
        return clampPos(p.x, p.y, w, h);
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!pos) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    moved.current = false;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const nx = e.clientX - offset.current.x;
    const ny = e.clientY - offset.current.y;
    if (pos && (Math.abs(nx - pos.x) > 3 || Math.abs(ny - pos.y) > 3)) {
      moved.current = true;
      setShowHint(false);
    }
    const { w, h } = groupSize(groupRef.current);
    setPos(clampPos(nx, ny, w, h));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    setDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* abaikan */
    }
    setPos((p) => {
      if (p) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
        } catch {
          /* abaikan */
        }
      }
      return p;
    });
  };

  if (!pos) return null;

  // balon di sisi berlawanan agar tidak keluar layar
  const bubbleSide: "right" | "left" =
    pos.x + 120 > window.innerWidth / 2 ? "left" : "right";

  return (
    <div
      ref={groupRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="button"
      aria-label="Si Termo, maskot. Geser untuk memindahkan."
      tabIndex={-1}
      className="fixed z-40 flex select-none items-end gap-2"
      style={{
        left: pos.x,
        top: pos.y,
        touchAction: "none",
        cursor: dragging ? "grabbing" : "grab",
      }}
    >
      {bubbleSide === "left" ? (
        <>
          <SpeechBubble text={mascotSpeech} tail="right" className="mb-3" />
          <div className="relative">
            <SiTermo mood={mascotMood} size={92} animate />
            {showHint && <DragHint />}
          </div>
        </>
      ) : (
        <>
          <div className="relative">
            <SiTermo mood={mascotMood} size={92} animate />
            {showHint && <DragHint />}
          </div>
          <SpeechBubble text={mascotSpeech} tail="left" className="mb-3" />
        </>
      )}
    </div>
  );
}

function DragHint() {
  return (
    <div
      className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full bg-[#7B5CD6] px-3 py-1.5 text-sm font-extrabold text-white shadow-lg termo-bounce"
      style={{ pointerEvents: "none" }}
    >
      ✋ Geser aku!
    </div>
  );
}
