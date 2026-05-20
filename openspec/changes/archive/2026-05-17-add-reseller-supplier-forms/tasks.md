## 1. Create RegisterReseller Page

- [x] 1.1 Create `src/pages/RegisterReseller.tsx` with Smartphone icon header, title "Gabung sebagai Reseller Tetangga", and subtitle
- [x] 1.2 Add form fields: Nama Lengkap (text), Nomor WhatsApp (tel), Domisili / Area Operasi (text), Produk yang Ingin Dijual (text), Agen Terdekat (text, optional)
- [x] 1.3 Add submit button "Daftar Sekarang" with sobatGreen-600 styling and "Butuh bantuan?" footer link

## 2. Create RegisterSupplier Page

- [x] 2.1 Create `src/pages/RegisterSupplier.tsx` with PackageOpen icon header, title "Daftar sebagai Pemasok Lokal", and subtitle
- [x] 2.2 Add form fields: Nama Usaha (text), Nama Pemilik (text), Nomor WhatsApp (tel), Alamat Lengkap (textarea), Kategori Produk (text), Deskripsi Produk (textarea, optional)
- [x] 2.3 Add submit button "Kirim Pengajuan" with sobatGreen-600 styling and "Sudah punya akun?" footer link

## 3. Update Routes and Navigation

- [x] 3.1 Add route `/daftar-reseller` → `RegisterReseller` in `src/App.tsx`
- [x] 3.2 Add route `/daftar-pemasok` → `RegisterSupplier` in `src/App.tsx`
- [x] 3.3 Update `src/pages/Join.tsx`: change Reseller card link from `#` to `/daftar-reseller`
- [x] 3.4 Update `src/pages/Join.tsx`: change Pemasok card link from `#` to `/daftar-pemasok`

## 4. Validate

- [x] 4.1 Run `vp check` to verify formatting, linting, and type checking pass
- [x] 4.2 Run `vp build` to verify production build succeeds
