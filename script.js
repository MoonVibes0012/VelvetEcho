// ============================================================
// CEK STATUS SERVER (Online/Offline)
// ============================================================
const API = 'http://localhost:3000/api';
let serverOnline = false;

async function cekServer() {
    try {
        const res = await fetch(API + '/ramalan', { method: 'GET', signal: AbortSignal.timeout(1500) });
        if (res.ok) {
            serverOnline = true;
            document.getElementById('statusServer').textContent = '🟢 Mode: Online';
        } else {
            serverOnline = false;
            document.getElementById('statusServer').textContent = '🔌 Mode: Offline';
        }
    } catch {
        serverOnline = false;
        document.getElementById('statusServer').textContent = '🔌 Mode: Offline';
    }
}
cekServer();
setInterval(cekServer, 5000);

// ============================================================
// JAM
// ============================================================
function updateJam() {
    const now = new Date();
    document.getElementById('jam').textContent =
        String(now.getHours()).padStart(2,'0') + ':' +
        String(now.getMinutes()).padStart(2,'0') + ':' +
        String(now.getSeconds()).padStart(2,'0');
}
setInterval(updateJam, 1000);
updateJam();

// ============================================================
// NOTIF
// ============================================================
function notif(pesan) {
    const el = document.getElementById('notif');
    el.textContent = '⚡ ' + pesan + ' ⚡';
    el.style.transform = 'scale(1.02)';
    setTimeout(() => el.style.transform = 'scale(1)', 150);
}

// ============================================================
// RAMALAN OFFLINE (TETAP JALAN TANPA SERVER)
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
// RAMALAN ONLINE (PAKAI SERVER)
// ============================================================
async function ramalanOnlineFunc() {
    if (!serverOnline) {
        return notif('❌ Server offline, gunakan Ramalan Offline.');
    }
    try {
        const res = await fetch(API + '/ramalan');
        const data = await res.json();
        notif('🌐 (Online) ' + data.ramalan);
    } catch {
        notif('❌ Gagal ambil ramalan online.');
    }
}

// ============================================================
// KIRIM SINYAL (ONLINE)
// ============================================================
async function kirimSinyal() {
    if (!serverOnline) return notif('❌ Server offline. Sinyal tidak terkirim.');
    try {
        const res = await fetch(API + '/sinyal', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ pesan: 'Sinyal dari Syntra' })
        });
        const data = await res.json();
        notif('🌊 ' + data.message);
    } catch {
        notif('❌ Gagal kirim sinyal.');
    }
}

// ============================================================
// HAPUS JEJAK (ONLINE)
// ============================================================
async function hapusJejak() {
    if (!serverOnline) return notif('❌ Server offline. Jejak tidak bisa dihapus.');
    try {
        const res = await fetch(API + '/jejak', { method: 'DELETE' });
        const data = await res.json();
        notif('💀 ' + data.message);
    } catch {
        notif('❌ Gagal hapus jejak.');
    }
}

// ============================================================
// LIHAT LOG (ONLINE)
// ============================================================
async function lihatLog() {
    if (!serverOnline) return notif('❌ Server offline. Log tidak tersedia.');
    try {
        const res = await fetch(API + '/log');
        const data = await res.json();
        if (data.length === 0) return notif('📜 Tidak ada log.');
        const pesan = data.slice(0, 3).map(l => l.pesan).join(' | ');
        notif('📜 Log: ' + pesan);
    } catch {
        notif('❌ Gagal ambil log.');
    }
}

// ============================================================
// COUNTDOWN (OFFLINE)
// ============================================================
let countdownInterval = null;
document.getElementById('btnCountdown').addEventListener('click', function() {
    if (countdownInterval) clearInterval(countdownInterval);
    let detik = parseInt(document.getElementById('countdownInput').value) || 10;
    const display = document.getElementById('countdownDisplay');
    display.textContent = detik;
    countdownInterval = setInterval(() => {
        detik--;
        display.textContent = detik;
        if (detik <= 0) {
            clearInterval(countdownInterval);
            display.textContent = '🚀 SELESAI!';
            notif('⏳ Hitung mundur selesai!');
        }
    }, 1000);
});

// ============================================================
// CHAT OFFLINE (TANPA SERVER)
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

document.getElementById('btnChat').addEventListener('click', function() {
    const input = document.getElementById('chatInput');
    const box = document.getElementById('chatBox');
    if (input.value.trim() === '') return;
    const pesan = input.value.trim();
    box.innerHTML += `<div>🧑 <b>Syntra:</b> ${pesan}</div>`;
    box.scrollTop = box.scrollHeight;
    input.value = '';
    setTimeout(() => {
        const balasan = balasanOffline[Math.floor(Math.random() * balasanOffline.length)];
        box.innerHTML += `<div>🐟 <b>Fishgpt:</b> ${balasan}</div>`;
        box.scrollTop = box.scrollHeight;
    }, 600);
});

// ============================================================
// CHAT ONLINE (PAKAI SERVER, TAPI SIMULASI)
// ============================================================
document.getElementById('btnChatOnline').addEventListener('click', function() {
    if (!serverOnline) return notif('❌ Server offline. Chat online tidak tersedia.');
    const input = document.getElementById('chatInput');
    const box = document.getElementById('chatBox');
    if (input.value.trim() === '') return;
    const pesan = input.value.trim();
    box.innerHTML += `<div>🧑 <b>Syntra (Online):</b> ${pesan}</div>`;
    box.scrollTop = box.scrollHeight;
    input.value = '';
    notif('🌐 Pesan online dikirim ke server.');
    // Simulasi balasan dari server
    setTimeout(() => {
        const balasan = ['🌐 Server menerima.', '📡 Sinyal online diproses.', '⚡ Respon dari cloud.'];
        const pilih = balasan[Math.floor(Math.random() * balasan.length)];
        box.innerHTML += `<div>🖥️ <b>Server:</b> ${pilih}</div>`;
        box.scrollTop = box.scrollHeight;
    }, 700);
});

// ============================================================
// UBAH WARNA (OFFLINE)
// ============================================================
let warnaIndex = 0;
const warnaList = [
    '#0a0f1e',
    '#1e0a0f',
    '#0a1e0f',
    '#1e0a1e',
    '#0f1a2a',
    '#1a0f1a'
];
document.getElementById('btnWarna').addEventListener('click', function() {
    warnaIndex = (warnaIndex + 1) % warnaList.length;
    document.body.style.background = warnaList[warnaIndex];
    notif('🌈 Warna berubah!');
});

// ============================================================
// EVENT LISTENER TOMBOL
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btnKirim').addEventListener('click', kirimSinyal);
    document.getElementById('btnHapus').addEventListener('click', hapusJejak);
    document.getElementById('btnRamalan').addEventListener('click', ramalanOfflineFunc);
    document.getElementById('btnRamalanOnline').addEventListener('click', ramalanOnlineFunc);
    document.getElementById('btnLog').addEventListener('click', lihatLog);
});document.getElementById('btnCountdown').addEventListener('click', function() {
    if (countdownInterval) clearInterval(countdownInterval);
    let detik = parseInt(document.getElementById('countdownInput').value) || 10;
    const display = document.getElementById('countdownDisplay');
    display.textContent = detik;
    countdownInterval = setInterval(() => {
        detik--;
        display.textContent = detik;
        if (detik <= 0) {
            clearInterval(countdownInterval);
            display.textContent = '🚀 SELESAI!';
            notif('⏳ Hitung mundur selesai!');
        }
    }, 1000);
});

// ============================================================
// CHAT SIMULASI
// ============================================================
document.getElementById('btnChat').addEventListener('click', function() {
    const input = document.getElementById('chatInput');
    const box = document.getElementById('chatBox');
    if (input.value.trim() === '') return;
    const pesan = input.value.trim();
    box.innerHTML += `<div>🧑 <b>Syntra:</b> ${pesan}</div>`;
    box.scrollTop = box.scrollHeight;
    input.value = '';
    // Balasan otomatis dari server (simulasi)
    setTimeout(() => {
        const balasan = ['🌊 Laut menjawab...', '🐟 Fishgpt mendengar.', '⚡ Sinyal diterima.', '💀 Gelap menyambut.'];
        const pilih = balasan[Math.floor(Math.random() * balasan.length)];
        box.innerHTML += `<div>🐟 <b>Fishgpt:</b> ${pilih}</div>`;
        box.scrollTop = box.scrollHeight;
    }, 800);
});

// ============================================================
// UBAH WARNA
// ============================================================
let warnaIndex = 0;
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
// EVENT LISTENER TOMBOL
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btnKirim').addEventListener('click', kirimSinyal);
    document.getElementById('btnHapus').addEventListener('click', hapusJejak);
    document.getElementById('btnRamalan').addEventListener('click', bacaRamalan);
    document.getElementById('btnLog').addEventListener('click', lihatLog);
    document.getElementById('btnWarna').addEventListener('click', ubahWarna);
});
