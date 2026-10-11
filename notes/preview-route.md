### Perubahan fitur

- Layar Video Pemantik sekarang mendukung **video dari perangkat** (offline).
- Tambah state `localFile` dan `localUrl`, serta elemen `<video>` yang memutar file yang dipilih.
- UI menampilkan tombol **Pilih dari perangkat**, nama file yang diputar, serta button **Hapus lokal** / **Putar ulang**.
- Tipe file dibatasi ke `video/*`; jenis lain menampilkan pesan error.
- Object URL dihapus saat file berubah untuk mencegah kebocoran memori.
- Tombol beralih fungsi: `Bersihkan` → `Hapus lokal` saat ada file lokal, dan menambahkan tombol **Putar** untuk video dari perangkat.
- Kekalahan build bertambah: `Device` tidak ada di lucide-react 0.525, diganti `Cast`.
- Build TypeScript hanya gagal pada contoh `examples/websocket` yang bukan bagian dari aplikasi utama; file ScreenVideoPemantik sudah lulus.

### Verifikasi

- Komponen berhasil dijalankan via dev server dan layar Video Pemantik muncul dengan elemen iframe YouTube serta input tautan.
- Tombol Pilih dari perangkat tersedia dan siap menerima file video dari perangkat.
- Snapshot DOM setelah lompat ke layar gameplay menunjukkan tampilan garis bilangan dan combo kota berfungsi.

### Cara pilih video dari perangkat

1. Buka layar Video Pemantik.
2. Klik tombol **Pilih dari perangkat**.
3. Pilih file video (mp4 / webm / ogg) dari perangkat.
4. Video akan dimutar dari file tersebut tanpa memerlukan koneksi internet.
5. Gunakan **Hapus lokal** untuk kembali ke tautan YouTube/Drive, atau **Putar** untuk memutar ulang.
