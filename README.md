# WebSocket Chat Room Simulation

Aplikasi chat room sederhana menggunakan WebSocket untuk komunikasi real-time. Aplikasi ini memungkinkan pengguna untuk bergabung ke dalam room chat yang berbeda dan berkomunikasi dengan pengguna lain dalam room yang sama.

## Fitur

- 🚀 Real-time chat menggunakan WebSocket
- 🏠 Sistem room chat
- 📜 Riwayat chat per room
- 👥 Multiple user support
- 🎨 Interface yang responsif dan user-friendly

## Teknologi yang Digunakan

- Node.js
- Express.js
- ws (WebSocket library)
- HTML/CSS/JavaScript

## Prasyarat

Sebelum menjalankan aplikasi, pastikan sudah terinstall:
- Node.js (versi 12 atau lebih baru)
- npm (Node Package Manager)

## Cara Instalasi

1. Clone repository ini
   ```bash
   git clone https://github.com/aldyardnsyh/websocket_simulation.git
   ```

2. Masuk ke direktori project
   ```bash
   cd websocket_simulation
   ```

3. Install dependencies
   ```bash
   npm install
   ```

## Cara Menjalankan Aplikasi

1. Jalankan server
   ```bash
   npm run start
   ```

2. Buka browser dan akses
   ```
   http://localhost:3000
   ```

3. Untuk testing multiple user, buka beberapa tab browser dengan URL yang sama

## Struktur Project

```
websocket_simulation/
├── client/
│   ├── index.html
│   └── client.js
├── server.js
├── package.json
├── .gitignore
└── README.md
```

## Cara Penggunaan

1. Masukkan nama room yang ingin dimasuki pada input "Enter room name"
2. Klik tombol "Join Room"
3. Setelah bergabung dalam room, Anda bisa mulai mengirim pesan
4. Pesan akan diterima oleh semua user yang berada dalam room yang sama
5. Untuk pindah room, cukup masukkan nama room baru dan klik "Join Room"
