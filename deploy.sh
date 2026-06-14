#!/bin/bash

# ====================================================================
# 🚀 BASH SCRIPT: AUTOMATIC GITHUB PAGES DEPLOYMENT - HAILMARY PROJECT
# ====================================================================

# 1. TENTUKAN URL REPOSITORY GITHUB ANDA (Ganti 'albrian' & 'hailmary' sesuai akun Anda!)
REPO_URL="https://github.com/albrian/hailmary.git"

echo "🌌 [Hailmary Project] Memulai proses otomatisasi deployment..."

# 2. Cek apakah folder ini sudah terinisialisasi Git, jika belum maka lakukan init
if [ ! -d ".git" ]; then
    echo "⚙️ Menginisialisasi Git di folder lokal 'hailmary'..."
    git init
    git branch -M main
    git remote add origin $REPO_URL
fi

# 3. Menarik file terbaru dari server (jika ada) untuk menghindari bentrok
echo "🔄 Sinkronisasi dengan server GitHub..."
git pull origin main --rebase

# 4. Memasukkan semua perubahan file (index.html, style.css, app.js, earth.jpg)
echo "📦 Mengemas semua aset digital..."
git add .

# 5. Membuat pesan commit otomatis dengan stempel waktu real-time
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
COMMIT_MESSAGE="Update Kosmik Hailmary: $TIMESTAMP"
git commit -m "$COMMIT_MESSAGE"

# 6. Mendorong kode langsung ke GitHub secara instan
echo "🚀 Meluncurkan website ke orbit GitHub..."
git push -u origin main

echo "✨ [SUKSES] Website di folder hailmary telah diperbarui dengan kecepatan cahaya!"