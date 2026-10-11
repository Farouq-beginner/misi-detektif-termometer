"use client";

import { useGameStore, getItems, CONTEXT_META } from "@/store/useGameStore";
import { Button } from "@/components/ui/button";
import GarisBilangan from "../GarisBilangan";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Lightbulb, Check, RotateCcw, GripVertical } from "lucide-react";
import { useEffect } from "react";

function SortableCard({ id }: { id: string }) {
  const { context, orderedCards } = useGameStore();
  const items = getItems(context);
  const meta = CONTEXT_META[context];
  const city = items.find((c) => c.id === id)!;
  const color = city.value < 0 ? "#1E6FD9" : city.value > 0 ? "#FF8A3D" : "#7B5CD6";
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const idx = orderedCards.indexOf(id);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : 1,
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="termo-card flex w-[150px] cursor-grab touch-none flex-col items-center gap-1 p-3 active:cursor-grabbing sm:w-[170px]"
    >
      <div className="flex w-full items-center justify-between">
        <span className="rounded-md bg-[#F1F6FB] px-1.5 py-0.5 text-xs font-bold text-[#5B6B85]">
          #{idx + 1}
        </span>
        <GripVertical className="h-4 w-4 text-[#BCD6F0]" />
      </div>
      <span className="text-3xl">{city.icon}</span>
      <span className="text-center text-sm font-bold leading-tight text-[#1F2A44]">
        {city.name}
      </span>
      <span
        className="rounded-lg px-2 py-0.5 text-lg font-extrabold"
        style={{ color, backgroundColor: `${color}1a` }}
      >
        {city.value > 0 ? "+" : ""}
        {city.value}
        {meta.unit}
      </span>
    </div>
  );
}

export default function Screen4Urutkan() {
  const {
    context,
    orderedCards,
    setOrderedCards,
    layar4Checked,
    layar4Correct,
    layar4HintLevel,
    checkLayar4,
    hintLayar4,
  } = useGameStore();

  const items = getItems(context);
  const meta = CONTEXT_META[context];
  const min = context === "suhu" ? -40 : -150;
  const max = context === "suhu" ? 40 : 200;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      const oldIdx = orderedCards.indexOf(active.id as string);
      const newIdx = orderedCards.indexOf(over.id as string);
      setOrderedCards(arrayMove(orderedCards, oldIdx, newIdx));
    }
  };

  // urutan benar (ascending value)
  const correctOrder = [...items].sort((x, y) => x.value - y.value).map((c) => c.id);
  const valuesInOrder = orderedCards.map((id) => items.find((c) => c.id === id)?.value ?? 0);

  // saat ganti konteks, pastikan kartu sesuai
  useEffect(() => {
    if (orderedCards.length !== items.length || !items.every((c) => orderedCards.includes(c.id))) {
      setOrderedCards(items.map((c) => c.id));
    }
  }, [context]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 sm:py-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-[#1F2A44] sm:text-5xl">
          Urutkan <span className="text-[#1E6FD9]">Kota</span>
        </h2>
        <p className="mt-2 text-lg font-semibold text-[#5B6B85] sm:text-xl">
          Tarik kartu kota ke garis bilangan, dari yang paling dingin sampai paling panas!
        </p>
      </div>

      {/* area drag and drop */}
      <div className="termo-card overflow-x-auto termo-scroll p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#5B6B85]">
          <span className="rounded-md bg-[#1E6FD9]/10 px-2 py-0.5 text-[#1E6FD9]">⬅ PALING DINGIN</span>
          <span className="flex-1 border-t-2 border-dashed border-[#BCD6F0]" />
          <span className="rounded-md bg-[#FF8A3D]/10 px-2 py-0.5 text-[#FF8A3D]">PALING PANAS ➡</span>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={orderedCards} strategy={horizontalListSortingStrategy}>
            <div className="flex min-w-max gap-3 pb-2">
              {orderedCards.map((id) => (
                <SortableCard key={id} id={id} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* tombol aksi */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {!layar4Checked ? (
          <Button
            size="lg"
            onClick={checkLayar4}
            className="h-12 rounded-2xl bg-[#2DB67D] px-8 text-base font-extrabold text-white shadow-lg hover:bg-[#27a070]"
          >
            <Check className="mr-2 h-5 w-5" /> Periksa urutan
          </Button>
        ) : layar4Correct ? (
          <div className="termo-pop flex items-center gap-3 rounded-2xl bg-[#2DB67D]/10 px-5 py-3">
            <span className="rounded-full bg-[#2DB67D] px-3 py-1 text-sm font-extrabold text-white">
              HEBAT!
            </span>
            <p className="text-base font-extrabold text-[#1F2A44] sm:text-lg">
              Urutannya dari paling dingin:{" "}
              <span className="text-[#1E6FD9]">
                {correctOrder.map((id, i) => {
                  const v = items.find((c) => c.id === id)!.value;
                  return (i ? ", " : "") + (v > 0 ? `+${v}` : `${v}`);
                })}
              </span>
            </p>
          </div>
        ) : (
          <div className="termo-pop flex items-center gap-3 rounded-2xl bg-[#E5484D]/10 px-5 py-3">
            <span className="rounded-full bg-[#E5484D] px-3 py-1 text-sm font-extrabold text-white">
              BELUM TEPAT
            </span>
            <Button
              variant="outline"
              onClick={hintLayar4}
              className="rounded-xl border-[#7B5CD6]/40 text-[#7B5CD6] hover:bg-[#7B5CD6]/10"
            >
              <Lightbulb className="mr-2 h-4 w-4" />
              {layar4HintLevel >= 1 ? "Petunjuk berikutnya" : "Minta petunjuk"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setOrderedCards(items.map((c) => c.id).sort(() => Math.random() - 0.5))}
              className="rounded-xl text-[#5B6B85] hover:bg-[#EAF6FF]"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Acak ulang
            </Button>
          </div>
        )}
      </div>

      {/* petunjuk teks */}
      {layar4Checked && !layar4Correct && layar4HintLevel >= 1 && (
        <div className="termo-pop mx-auto max-w-2xl rounded-2xl border-2 border-[#7B5CD6]/30 bg-[#7B5CD6]/5 p-4 text-center">
          <p className="text-base font-bold text-[#7B5CD6]">
            {layar4HintLevel >= 2
              ? "Petunjuk 2: Kartu mana yang paling kiri? Itu yang paling dingin."
              : "Petunjuk 1: Cari dulu letak 0. Sebelah kiri 0 itu negatif (dingin), kanan 0 positif (panas)."}
          </p>
        </div>
      )}

      {/* garis bilangan dengan marker urutan */}
      <div className="termo-card p-4 sm:p-6">
        <h3 className="mb-2 text-center text-sm font-extrabold uppercase tracking-wide text-[#5B6B85]">
          Posisi pada garis bilangan
        </h3>
        <GarisBilangan
          min={min}
          max={max}
          step={context === "suhu" ? 1 : 50}
          unit={meta.unit}
          markers={orderedCards.map((id, i) => {
            const c = items.find((x) => x.id === id)!;
            const color = c.value < 0 ? "#1E6FD9" : c.value > 0 ? "#FF8A3D" : "#7B5CD6";
            return { value: c.value, label: `${i + 1}. ${c.name}`, color, highlight: layar4Correct === true };
          })}
        />
      </div>
    </div>
  );
}
