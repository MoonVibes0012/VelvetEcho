'use strict';

// ============================================================
// KONFIGURASI
// ============================================================
const API = 'http://localhost:3000/api';
const FPS = 45;
const FRAME_INTERVAL = 1000 / FPS;

let serverOnline = false;
let countdownInterval = null;
let warnaIndex = 0;
let lastFrameTime = 0;

// ============================================================
// HELPER DOM (cache sekali saja)
// ============================================================
const $ = (id) => document.getElementById(id);

// ============================================================
// NOTIFIKASI
// ============================================================
function notif(pesan) {
    const el = $('notif');
    if (!el) return;

    el.textContent = '⚡ ' + pesan + ' ⚡';
    el.style.transform = 'scale(1.02)';
    setTimeout(() => {
        el.style.transform = 'scale(1)';
    }, 150);
}

// ============================================================
// CEK STATUS SERVER
// ============================================================
async function cekServer() {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1500);

        const res = await fetch(API + '/ramalan', {
            method: 'GET',
            signal: controller.signal,
            cache: 'no-store'
        });

        clearTimeout(timeout);

        if (res.ok) {
            serverOnline = true;
            if ($('statusServer')) {
                $('statusServer').textContent = '🟢 Mode: Online';
            }
        } else {
            throw new Error('Server response error');
        }
    } catch {
        serverOnline = false;
        if ($('statusServer')) {
            $('statusServer').textContent = '🔌 Mode: Offline';
        }
    }
}

// ============================================================
// JAM
// ============================================================
function updateJam() {
    const now = new Date();
    const jam =
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0');

    if ($('jam')) {
        $('jam').textContent = jam;
    }
}

// ============================================================
// RAMALAN OFFLINE
// ============================================================
const ramalanOffline = [
    '🌊 Laut tenang, rahasia besar akan terungkap.',
    '🔥 Api bawah air menyala — kekuatanmu tak terlihat.',
    '🖤 Kedalaman memanggilmu, jawablah.',
    '💀 Mode senyap aktif — dunia tidak melihatmu.',
    '🔮 Bintang jatuh di timur — pertanda perubahan.',
    '⚡ Overdrive aktif — kecepatan tak terbatas.',
    '🐟 Fishgpt berbisik: kau berada di jalur benar.',
    '🌙 Bulan purnama membawa mimpi aneh.',
    '🌪️ Badai akan datang, tapi kau adalah mata badai.',
    '✨ Sesuatu yang hilang akan kembali.'
];

function ramalanOfflineFunc() {
    const pilihan = ramalanOffline[Math.floor(Math.random() * ramalanOffline.length)];
    notif('🔮 (Offline) ' + pilihan);
}

// ============================================================
// RAMALAN ONLINE
// ============================================================
async function ramalanOnlineFunc() {
    if (!serverOnline) {
        return notif('❌ Server offline, gunakan Ramalan Offline.');
    }

    try {
        const res = await fetch(API + '/ramalan', {
            method: 'GET',
            cache: 'no-store'
        });

        if (!res.ok) throw new Error('HTTP ' + res.status);

        const data = await res.json();
        notif('🌐 (Online) ' + data.ramalan);
    } catch {
        notif('❌ Gagal ambil ramalan online.');
        cekServer();
    }
}

// ============================================================
// KIRIM SINYAL
// ============================================================
async function kirimSinyal() {
    if (!serverOnline) {
        return notif('❌ Server offline. Sinyal tidak terkirim.');
    }

    try {
        const res = await fetch(API + '/sinyal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pesan: 'Sinyal dari Syntra' })
        });

        if (!res.ok) throw new Error('HTTP ' + res.status);

        const data = await res.json();
        notif('🌊 ' + data.message);
    } catch {
        notif('❌ Gagal kirim sinyal.');
        cekServer();
    }
}

// ============================================================
// HAPUS JEJAK
// ============================================================
async function hapusJejak() {
    if (!serverOnline) {
        return notif('❌ Server offline. Jejak tidak bisa dihapus.');
    }

    try {
        const res = await fetch(API + '/jejak', { method: 'DELETE' });
        if (!res.ok) throw new Error('HTTP ' + res.status);

        const data = await res.json();
        notif('💀 ' + data.message);
    } catch {
        notif('❌ Gagal hapus jejak.');
        cekServer();
    }
}

// ============================================================
// LIHAT LOG
// ============================================================
async function lihatLog() {
    if (!serverOnline) {
        return notif('❌ Server offline. Log tidak tersedia.');
    }

    try {
        const res = await fetch(API + '/log', {
            method: 'GET',
            cache: 'no-store'
        });

        if (!res.ok) throw new Error('HTTP ' + res.status);

        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
            return notif('📜 Tidak ada log.');
        }

        const pesan = data.slice(0, 3).map(log => log.pesan).join(' | ');
        notif('📜 Log: ' + pesan);
    } catch {
        notif('❌ Gagal ambil log.');
        cekServer();
    }
}

// ============================================================
// COUNTDOWN
// ============================================================
function mulaiCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }

    let detik = parseInt($('countdownInput')?.value, 10);
    if (!Number.isFinite(detik) || detik <= 0) detik = 10;

    const display = $('countdownDisplay');
    if (!display) return;

    display.textContent = detik;

    countdownInterval = setInterval(() => {
        detik--;
        display.textContent = detik;

        if (detik <= 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            display.textContent = '🚀 SELESAI!';
            notif('⏳ Hitung mundur selesai!');
        }
    }, 1000);
}

// ============================================================
// CHAT
// ============================================================
const balasanOffline = [
    '🌊 Laut menjawab: tenang...',
    '🐟 Fishgpt mendengar bisikanmu.',
    '⚡ Sinyal diterima di kedalaman.',
    '💀 Gelap menyambut pesanmu.',
    '🔥 Api bawah air menyala.',
    '🖤 Deep Core merespon.',
    '🔮 Ramalan: pesanmu sampai.',
    '✨ Bisikan dari dasar laut.'
];

function tambahChat(nama, pesan) {
    const box = $('chatBox');
    if (!box) return;

    const div = document.createElement('div');
    const namaEl = document.createElement('b');
    namaEl.textContent = nama + ': ';

    div.appendChild(namaEl);
    div.appendChild(document.createTextNode(pesan));
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

function kirimChatOffline() {
    const input = $('chatInput');
    if (!input) return;

    const pesan = input.value.trim();
    if (!pesan) return;

    tambahChat('🧑 Syntra', pesan);
    input.value = '';

    setTimeout(() => {
        const balasan = balasanOffline[Math.floor(Math.random() * balasanOffline.length)];
        tambahChat('🐟 Fishgpt', balasan);
    }, 600);
}

function kirimChatOnline() {
    if (!serverOnline) {
        return notif('❌ Server offline. Chat online tidak tersedia.');
    }

    const input = $('chatInput');
    if (!input) return;

    const pesan = input.value.trim();
    if (!pesan) return;

    tambahChat('🧑 Syntra (Online)', pesan);
    input.value = '';
    notif('🌐 Pesan online dikirim ke server.');

    setTimeout(() => {
        const balasan = [
            '🌐 Server menerima.',
            '📡 Sinyal online diproses.',
            '⚡ Respon dari cloud.'
        ];
        const pilih = balasan[Math.floor(Math.random() * balasan.length)];
        tambahChat('🖥️ Server', pilih);
    }, 700);
}

// ============================================================
// UBAH WARNA
// ============================================================
const warnaList = [
    'radial-gradient(circle at center, #0a0f1e, #010101)',
    'radial-gradient(circle at center, #1e0a0f, #2a0101)',
    'radial-gradient(circle at center, #0a1e0f, #012a01)',
    'radial-gradient(circle at center, #1e0a1e, #2a012a)',
    'radial-gradient(circle at center, #0f1a2a, #01021a)'
];

function ubahWarna() {
    warnaIndex = (warnaIndex + 1) % warnaList.length;
    document.body.style.background = warnaList[warnaIndex];
    notif('🌈 Warna berganti!');
}

// ============================================================
// FPS CONTROL
// ============================================================
function frameLimiter(timestamp) {
    if (!lastFrameTime) lastFrameTime = timestamp;

    const elapsed = timestamp - lastFrameTime;

    if (elapsed >= FRAME_INTERVAL) {
        lastFrameTime = timestamp - (elapsed % FRAME_INTERVAL);
        document.documentElement.style.setProperty('--frame-time', `${FRAME_INTERVAL}ms`);
    }

    requestAnimationFrame(frameLimiter);
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Server check
    cekServer();
    setInterval(cekServer, 5000);

    // Jam
    updateJam();
    setInterval(updateJam, 1000);

    // Event listeners (hanya sekali)
    $('btnKirim')?.addEventListener('click', kirimSinyal);
    $('btnHapus')?.addEventListener('click', hapusJejak);
    $('btnRamalan')?.addEventListener('click', ramalanOfflineFunc);
    $('btnRamalanOnline')?.addEventListener('click', ramalanOnlineFunc);
    $('btnWarna')?.addEventListener('click', ubahWarna);
    $('btnLog')?.addEventListener('click', lihatLog);
    $('btnCountdown')?.addEventListener('click', mulaiCountdown);
    $('btnChat')?.addEventListener('click', kirimChatOffline);
    $('btnChatOnline')?.addEventListener('click', kirimChatOnline);

    $('chatInput')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') kirimChatOffline();
    });

    // FPS limiter
    requestAnimationFrame(frameLimiter);
});
