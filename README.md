Markdown
# 📊 SIPEKA - BAPPEDA Jawa Barat

![SIPEKA Banner] (banner.png)

## 📖 Deskripsi Proyek
**SIPEKA (Sistem Informasi Perencanaan dan Evaluasi Kinerja Daerah)** adalah purwarupa aplikasi Dashboard Eksekutif yang dirancang untuk membantu pimpinan dan pemangku kebijakan (BAPPEDA) dalam memantau realisasi anggaran dan progres pembangunan proyek secara *real-time* di seluruh wilayah administratif Provinsi Jawa Barat.

Sistem ini menonjolkan visualisasi data yang intuitif, pemetaan spasial berbasis *glassmorphism*, dan **Early Warning System (EWS)** untuk mengidentifikasi proyek yang membutuhkan perhatian khusus guna mencegah *over-budgeting* atau keterlambatan.

## ✨ Fitur Utama
- **📈 Dashboard Eksekutif:** Ringkasan metrik Total Pagu, Serapan Anggaran, dan Rata-rata Realisasi Fisik.
- **🗺️ Visualisasi Spasial (GIS):** Peta interaktif Provinsi Jawa Barat dengan penanda titik proyek beserta *tooltip* data real-time berbasis wilayah (Bodebek, Bandung Raya, dll).
- **⚠️ Early Warning System (EWS):** Klasifikasi proyek otomatis (Aman, Waspada, Kritis) berdasarkan performa serapan anggaran dan realisasi fisik.
- **📄 Laporan & Evaluasi:** Ekspor data tabular proyek ke dalam format PDF dan Excel.
- **🛡️ Integritas Data:** Fitur simulasi pencegahan *over-budgeting* otomatis.

## 🛠️ Teknologi yang Digunakan
- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (dengan efek UI Glassmorphism)
- **Visualisasi Peta:** React Simple Maps / GeoJSON
- **Icons:** Lucide React

## 🚀 Cara Menjalankan Secara Lokal

1. **Clone repository ini:**
   ```bash
   git clone [https://github.com/username-kamu/sipeka-bappeda-jabar.git](https://github.com/username-kamu/sipeka-bappeda-jabar.git)
Masuk ke direktori proyek:

Bash
cd sipeka-bappeda-jabar
Instal dependensi:

Bash
npm install
Jalankan server pengembangan:

Bash
npm run dev
Buka http://localhost:5173 di browser Anda.

🎓 Tentang Proyek
Proyek ini dikembangkan oleh Ikmal Rizal sebagai pemenuhan Tugas Akhir untuk mata kuliah Manajemen Proyek di program studi Teknik Informatika, STT Terpadu Nurul Fikri. Fokus utama pengembangan adalah menciptakan instrumen monitoring tingkat eksekutif yang menerapkan prinsip-prinsip tata kelola sistem informasi dan pemisahan arsitektur yang bersih.

Dibuat dengan ❤️ untuk kemajuan tata kelola digital di Indonesia.


### **Trik Tambahan agar README Makin Keren:**
Kalau kamu perhatikan, di bagian atas kode *markdown* tersebut ada bagian `![SIPEKA Banner](...)`. 
Agar GitHub-mu terlihat super meyakinkan, ambil 1 *screenshot* tampilan SIPEKA kamu yang paling bagus (misalnya pas menampilkan Peta dan *Card*), simpan dengan nama `banner.png` di proyekmu, dan ganti baris gambar di atas menjadi:
`![SIPEKA Banner](./banner.png)`

Setelah file `README.md` ini disimpan, jalankan lagi `git add .`, lalu `git commit -m "docs: menambahkan README.md"`, dan `git push` ke GitHub.

Setelah *push* ini selesai, kita tinggal *login* ke Vercel dan *deploy* aplikasinya! S
