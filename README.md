# Pengembangan Aplikasi Web - News Portal

## 1. Tentang Saya

| Nama Lengkap | NIM |
| :--- | :--- |
| Ivan Nandira Mangunang | 123140094 |

---

## 2. Deskripsi Proyek

Aplikasi **News Portal** ini merupakan proyek web berbasis **ReactJS** yang saya kembangkan untuk menampilkan berita utama dengan tampilan **modern, responsif, dan interaktif**. Pengguna dapat **menjelajahi artikel berdasarkan kategori** seperti *Technology*, *Business*, dan *Sports*, serta melakukan **pencarian mendalam** menggunakan *keyword* dan *date picker*. Selain itu, terdapat fitur **pagination** untuk mengatur jumlah berita yang ditampilkan.
Untuk mengatasi kendala saat **deployment API**, aplikasi ini menggunakan **data statis lokal** yang telah di-*preload* mengikuti **skema struktur dari NewsAPI**, sehingga tetap dapat berfungsi dengan baik tanpa ketergantungan pada koneksi API eksternal.

### Fitur-Fitur Utama yang Saya Bangun:

* **Navigasi Kategori:** Saya merancang *navigation bar* di bagian atas halaman agar pengguna dapat dengan mudah memilih kategori berita populer seperti `Technology`, `Business`, dan `Sports`.
* **Pencarian & Penyaringan Tanggal:** Saya menambahkan *search form* untuk mencari artikel berdasarkan *keyword*, serta *date picker* untuk memfilter berita sesuai rentang waktu tertentu.
* **Tata Letak yang Terstruktur:** Setiap artikel ditampilkan dalam *card view* yang ringkas dan informatif, berisi judul, sumber berita, tanggal publikasi, dan gambar thumbnail.
* **Pagination:** Untuk meningkatkan kenyamanan pengguna, jumlah artikel per halaman dibatasi dan dilengkapi fitur *pagination* agar navigasi antar halaman lebih mudah.

### Teknologi yang Digunakan:

* **Framework Utama:** ReactJS (dibangun menggunakan *Create React App*)
* **Pengambilan Data:** *Fetch API*
* **Manajemen State:** React Hooks (`useState` dan `useEffect`)
* **Tata Gaya:** CSS murni untuk pengaturan tampilan dan responsivitas.

---

## 3. Cara Instalasi dan Menjalankan Lokal

Jika Anda ingin mencoba aplikasi ini secara lokal (di `localhost`), pastikan Anda sudah menginstal Node.js dan NPM.

### A. Persiapan

1.  Silakan clone repository ini atau unduh kode sumbernya.
2.  Buka terminal (Command Prompt/PowerShell/Git Bash) dan masuk ke direktori proyek.
3.  Jalankan perintah ini untuk menginstal semua library yang saya gunakan:

    ```bash
    npm install
    ```

### B. Mulai Aplikasi

1.  Setelah instalasi selesai, jalankan server development dengan perintah:

    ```bash
    npm run dev
    ```
2.  Aplikasi akan otomatis terbuka di browser Anda pada `http://localhost:5174/`.

---

## 4. Link Deployment

Proyek ini sudah saya deploy agar bisa diakses secara publik:

**Link Deployment:** 

---

## 5. Tampilan Aplikasi

Berikut adalah beberapa screenshot yang menunjukkan tampilan News Portal ini.

**- Tampilan Navigation Bar News Portal**

**- Tampilan Pencarian dan Filter Tanggal**

**- Tampilan Pagination**
