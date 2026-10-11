---
Task ID: 1
Agent: main-orchestrator
Task: Membangun aplikasi desktop offline + fullscreen "Misi Detektif Termometer" (PWA Next.js) untuk belajar bilangan bulat SMP.

Work Log:
- Setup PWA: public/manifest.json (display fullscreen, theme #1E6FD9), public/sw.js (service worker cache-first/network-first untuk offline), public/icon.svg (maskot termometer), komponen RegisterSW (indikator mode offline).
- Layout & tema: layout.tsx dipakai font sistem (Trebuchet MS/Segoe UI, tanpa internet), metadata manifest, viewport theme color, registrasi SW. globals.css ditambah variabel tema (--termo-cold #1E6FD9, --termo-warm #FF8A3D, --termo-zero #7B5CD6, --termo-ink #1F2A44, --termo-ok #2DB67D, --termo-no #E5484D), kelas .termo-bg (gradasi #EAF6FF→putih), .termo-card, scrollbar kustom, animasi (termo-bounce, termo-pop, termo-shake).
- Zustand store (src/store/useGameStore.ts): state 6 layar, konteks suhu/kedalaman, maskot mood+speech, jawaban layar 1, perbandingan layar 3 (dengan guess), urutan kartu layar 4 (dengan hint level), quiz 8 soal + skor, fullscreen, shortcut spasi per layar.
- Komponen bersama: SiTermo (SVG maskot 4 ekspresi: neutral/happy/think/sad), Termometer (vertikal, kolom biru/oranye/ungu sesuai tanda), GarisBilangan (horizontal, kiri 0 biru, kanan 0 oranye, 0 ungu, panah makin kecil/besar), CityCard, SpeechBubble, MascotOverlay, TeacherBar.
- 6 Layar dibuat sesuai brief: Pembuka (animasi termometer turun 12→-4, Puncak Jaya), Kenali Bilangan Bulat (termometer+garis sinkron via dropdown 6 kota), Siapa Lebih Dingin (2 kota + tebak + kalimat otomatis "−x < −y karena di kiri"), Urutkan Kota (drag&drop @dnd-kit + 2 petunjuk), Tebak Titik (8 soal pilihan ganda + skor), Penutup (kesimpulan).
- TeacherBar: panah ←/→ navigasi layar, spasi membuka jawaban sesuai layar, tombol Ganti Konteks (suhu↔kedalaman: Kapal Selam -100m, Burung +150m), tombol fullscreen (Fullscreen API), tombol reset, indikator konteks, hint keyboard.
- Verifikasi Agent Browser (viewport 1440x900): semua 6 layar render benar, dropdown kota berfungsi & sinkron, perbandingan layar 3 menghasilkan kalimat otomatis, drag&drop urutkan berfungsi dengan feedback HEBAT/BELUM TEPAT + 2 petunjuk, quiz menampilkan skor, fullscreen ON/OFF berhasil, ganti konteks ke kedalaman laut menampilkan Kapal Selam & Burung, panah keyboard navigasi berfungsi, maskot & footer terdeteksi. Lint 0 error/warning, dev log 0 error.

Stage Summary:
- Aplikasi PWA siap install sebagai desktop app (manifest display:fullscreen), berjalan offline via service worker, tombol fullscreen native.
- Semua teks brief persis, warna konsisten (biru=negatif, oranye=positif, ungu=nol), font sistem tanpa internet, maskot SVG Si Termo dengan ekspresi berubah, balon kata, teacher controls lengkap (←/→, spasi, ganti konteks, fullscreen).
- Artefak: src/app/page.tsx, src/app/layout.tsx, src/app/globals.css, src/store/useGameStore.ts, src/components/termo/* (SiTermo, Termometer, GarisBilangan, CityCard, SpeechBubble, MascotOverlay, TeacherBar), src/components/termo/screens/* (Screen1-6), src/components/pwa/register-sw.tsx, public/{manifest.json,sw.js,icon.svg}.

---
Task ID: 2
Agent: main-orchestrator
Task: Membuat maskot "Si Termo" bisa dipindah/digeser dengan cursor (drag & drop).

Work Log:
- SpeechBubble.tsx: tambah prop `tail: "left" | "right"` agar ekor balon bisa menghadap kiri maupun kanan (menyesuaikan posisi maskot). Balon dibuat responsif (max-w-180 mobile, sm:max-w-xs).
- MascotOverlay.tsx: ditulis ulang menjadi draggable widget:
  - Pointer Events API (bekerja untuk mouse & touch) dengan setPointerCapture agar drag tetap mulus walau cursor keluar elemen.
  - Posisi disimpan ke localStorage (key "termo-mascot-pos") supaya tetap di tempat yang sama setelah refresh.
  - Clamping ke viewport (memakai getBoundingClientRect grup) + listener resize agar maskot tidak keluar layar.
  - Balon kata otomatis pindah sisi (kiri/kanan) berdasarkan posisi maskot — kalau maskot di separuh kanan, balon ke kiri, begitu sebaliknya.
  - Badge hint "✋ Geser aku!" muncul di awal lalu hilang setelah 5 detik atau setelah drag pertama.
  - cursor: grab/grabbing, touch-action: none, select-none agar drag mulus.
- Perbaikan lint: error react-hooks/set-state-in-effect & react-hooks/immutability diselesaikan dengan memindahkan helper clampPos/groupSize keluar komponen (pure) dan menghapus flag mounted yang berlebihan. Akhir: lint 0 error/warning.
- Verifikasi Agent Browser (viewport 1440x900): drag maskot dari (16,670) → (740,174) sukses; posisi tersimpan di localStorage {"x":740,"y":174}; setelah reload posisi tetap; balon pindah ke sisi kiri saat maskot di kanan, kembali ke kanan saat maskot diseret ke kiri-bawah (150,714). Tidak ada error console / hydration warning. VLM mengkonfirmasi maskot terlihat dengan balon kata.

Stage Summary:
- Maskot Si Termo kini dapat digeser bebas dengan cursor (mouse) maupun jari (touch) ke mana saja di layar, posisi tersimpan, balon menyesuaikan sisi secara cerdas, dan selalu dijaga tetap di dalam viewport.
- Artefak diubah: src/components/termo/SpeechBubble.tsx, src/components/termo/MascotOverlay.tsx.
