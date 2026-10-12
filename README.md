# Misi Detektif Termometer

Aplikasi pembelajaran interaktif untuk membantu siswa SMP memahami **bilangan bulat** melalui konteks suhu, termometer, kedalaman laut, dan perbandingan posisi pada garis bilangan.

Pengguna mengikuti misi bersama maskot **Si Termo** dan Bu Guru Zindo. Materi disajikan sebagai rangkaian layar interaktif yang dapat digunakan di browser, dipasang sebagai PWA, atau dikemas menjadi aplikasi desktop dengan Electron.

## Fitur utama

- Alur pembelajaran interaktif dengan 9 layar:
  1. Sampul dan pembuka misi
  2. Tujuan pembelajaran
  3. Video pemantik
  4. Pengenalan bilangan bulat
  5. Mengenali bilangan pada konteks suhu
  6. Menentukan objek yang lebih dingin
  7. Mengurutkan bilangan pada garis bilangan
  8. Menebak posisi titik pada garis bilangan
  9. Penutup dan rangkuman
- Dua konteks pembelajaran:
  - **Suhu kota dunia**, menggunakan satuan derajat Celsius.
  - **Kedalaman laut**, menggunakan satuan meter.
- Interaksi memilih kota/objek, membandingkan nilai, mengurutkan kartu dengan drag-and-drop, dan menjawab kuis.
- Umpan balik langsung dari maskot berdasarkan jawaban siswa.
- Video pemantik dari YouTube atau Google Drive.
- Pemutaran video lokal dari perangkat tanpa perlu mengunggah file ke server.
- Dukungan fullscreen, PWA, dan layout landscape untuk penggunaan di kelas.
- Penyimpanan tautan video pemantik pada `localStorage` browser.
- Target desktop Windows (NSIS) dan macOS (DMG) melalui Electron Builder.

## Teknologi

- [Next.js](https://nextjs.org/) 16 dengan App Router
- React 19 dan TypeScript
- Tailwind CSS 4
- Zustand untuk state permainan
- `@dnd-kit` untuk interaksi drag-and-drop
- Radix UI dan komponen UI lokal
- Prisma dengan SQLite untuk lapisan database
- Electron dan Electron Builder untuk distribusi desktop
- Bun lockfile tersedia; seluruh script juga dapat dijalankan dengan npm

## Persyaratan

- Node.js 20 atau yang lebih baru
- npm atau Bun
- Untuk pengembangan database: Prisma CLI dan file SQLite lokal
- Untuk build desktop: dependensi Node.js, Electron, dan Electron Builder yang terpasang

## Instalasi

Clone repositori, lalu masuk ke direktori proyek:

```bash
git clone https://github.com/Farouq-beginner/misi-detektif-termometer.git
cd misi-detektif-termometer
```

Pasang dependensi:

```bash
npm install
```

Atau gunakan Bun:

```bash
bun install
```

## Menjalankan mode pengembangan

Jalankan server Next.js:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

Server development menggunakan port `3000` secara default. Untuk penggunaan di kelas, browser dapat dipasang dalam mode fullscreen atau aplikasi dapat di-build menjadi aplikasi desktop.

## Konfigurasi database

Proyek menggunakan Prisma dengan provider SQLite. Buat file `.env` di root proyek apabila belum tersedia:

```env
DATABASE_URL="file:./db/custom.db"
```

Generate Prisma Client:

```bash
npm run db:generate
```

Sinkronkan schema ke database lokal:

```bash
npm run db:push
```

Perintah migrasi yang tersedia:

```bash
npm run db:migrate
npm run db:reset
```

> `db:reset` menghapus dan membuat ulang database. Gunakan hanya pada lingkungan pengembangan.

Schema Prisma saat ini menyediakan model dasar `User` dan `Post`. Alur permainan utama menyimpan state sesi di client melalui Zustand dan belum memerlukan autentikasi atau penyimpanan progres ke database.

## Build dan menjalankan produksi

Build aplikasi Next.js:

```bash
npm run build
```

Jalankan hasil build:

```bash
npm run start
```

Script build menghasilkan output standalone Next.js dan menjalankan script penyalinan yang diperlukan untuk deployment desktop.

## Build aplikasi desktop

### Menjalankan versi desktop secara lokal

```bash
npm run desktop:dev
```

Perintah ini melakukan build Next.js terlebih dahulu, kemudian membuka aplikasi menggunakan Electron.

### Membuat installer Windows

```bash
npm run desktop:win
```

Installer NSIS dan artefak terkait akan dibuat di folder `dist/`.

### Membuat paket macOS

```bash
npm run desktop:mac
```

Perintah ini menghasilkan paket DMG untuk macOS. Build macOS sebaiknya dijalankan pada lingkungan macOS dengan toolchain yang sesuai.

## Kontrol aplikasi

| Tombol | Fungsi |
| --- | --- |
| `←` | Berpindah ke layar sebelumnya |
| `→` | Berpindah ke layar berikutnya |
| `Spasi` | Memilih atau mengirim jawaban pada interaksi yang mendukung keyboard |
| Mouse/touch | Memilih opsi, menggeser kartu, dan mengontrol video |

## Video pemantik

Pada layar **Video Pemantik**, guru dapat:

1. Menempel tautan YouTube atau Google Drive.
2. Menekan tombol untuk memuat video.
3. Memilih file video dari perangkat untuk penggunaan offline.
4. Menghapus video lokal atau membuka tautan di tab baru jika embedding diblokir.

Tautan yang valid dapat disimpan di browser sehingga guru tidak perlu menempelkannya kembali pada kunjungan berikutnya. File lokal diputar menggunakan object URL browser dan tidak diunggah ke server.

## Struktur direktori

```text
.
├── electron/              # Entry point aplikasi desktop Electron
├── examples/              # Contoh integrasi tambahan
├── prisma/                # Schema Prisma
├── public/                # Manifest PWA dan aset publik
├── scripts/               # Script utilitas build
├── src/
│   ├── app/               # App Router, layout, halaman utama, dan API route
│   ├── components/
│   │   ├── termo/         # Komponen dan layar pembelajaran
│   │   └── ui/            # Komponen UI reusable
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilitas dan client database
│   └── store/             # State permainan Zustand
├── next.config.ts         # Konfigurasi Next.js standalone
├── package.json           # Script dan dependensi proyek
└── tsconfig.json          # Konfigurasi TypeScript
```

## Perintah yang tersedia

| Perintah | Keterangan |
| --- | --- |
| `npm run dev` | Menjalankan server development |
| `npm run build` | Membuat build produksi Next.js |
| `npm run start` | Menjalankan build produksi standalone |
| `npm run lint` | Menjalankan ESLint |
| `npm run desktop:dev` | Build dan menjalankan Electron |
| `npm run desktop:win` | Membuat installer Windows |
| `npm run desktop:mac` | Membuat paket DMG macOS |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Sinkronisasi schema ke SQLite |
| `npm run db:migrate` | Membuat dan menjalankan migrasi Prisma |
| `npm run db:reset` | Reset database development |

## Pengembangan

Komponen layar permainan berada di `src/components/termo/screens/`. State bersama permainan berada di `src/store/useGameStore.ts`, termasuk data kota, data kedalaman, soal kuis, progres layar, skor, dan status jawaban.

Saat menambahkan layar atau interaksi baru:

1. Tambahkan state dan action yang diperlukan di store.
2. Buat komponen layar di folder `src/components/termo/screens/`.
3. Hubungkan layar tersebut di `src/app/page.tsx`.
4. Pertahankan navigasi keyboard dan umpan balik yang konsisten dengan layar lain.
5. Jalankan lint dan build sebelum membuat rilis.

## Validasi sebelum rilis

```bash
npm run lint
npm run build
```

Untuk perubahan yang menyentuh database, pastikan `.env` telah dikonfigurasi dan jalankan:

```bash
npm run db:generate
npm run db:push
```

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](./LICENSE).

Lisensi MIT mengizinkan penggunaan, penyalinan, modifikasi, penggabungan,
publikasi, distribusi, sublicensing, dan penjualan salinan perangkat lunak,
dengan syarat pemberitahuan hak cipta dan teks lisensi tetap disertakan.
