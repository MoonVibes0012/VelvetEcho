// ===== JAM DIGITAL =====
function updateJam() {
    const now = new Date();
    const jam = String(now.getHours()).padStart(2, '0');
    const menit = String(now.getMinutes()).padStart(2, '0');
    const detik = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('jam').textContent = jam + ':' + menit + ':' + detik;
}
setInterval(updateJam, 1000);
updateJam();

// ===== NOTIF =====
function notif(pesan) {
    const el = document.getElementById('notif');
    el.textContent = '⚡ ' + pesan + ' ⚡';
    el.style.color = '#00ffcc';
    el.style.transform = 'scale(1.02)';
    setTimeout(() => el.style.transform = 'scale(1)', 150);
}

// ===== UBAH WARNA =====
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
    notif('🌈 Warna berganti — kedalaman baru terungkap!');
}

// ============================================================
// KONEKSI KE BACKEND (FETCH API)
// ============================================================
const API_URL = 'http://localhost:3000/api';

// Kirim sinyal (POST)
async function kirimSinyal() {
    try {
        const res = await fetch(`${API_URL}/sinyal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pesan: 'Ombak dari Syntra' })
        });
        const data = await res.json();
        notif('🌊 ' + data.message);
    } catch (err) {
        notif('❌ Gagal koneksi ke server: ' + err.message);
    }
}

// Hapus jejak (DELETE)
async function hapusJejak() {
    try {
        const res = await fetch(`${API_URL}/jejak`, {
            method: 'DELETE'
        });
        const data = await res.json();
        notif('💀 ' + data.message);
    } catch (err) {
        notif('❌ Gagal koneksi ke server: ' + err.message);
    }
}

// Baca ramalan (GET)
async function bacaRamalan() {
    try {
        const res = await fetch(`${API_URL}/ramalan`);
        const data = await res.json();
        notif('🔮 ' + data.ramalan);
    } catch (err) {
        notif('❌ Gagal koneksi ke server: ' + err.message);
    }
}

// ===== PASANG EVENT LISTENER KE TOMBOL =====
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btnKirim').addEventListener('click', kirimSinyal);
    document.getElementById('btnHapus').addEventListener('click', hapusJejak);
    document.getElementById('btnRamalan').addEventListener('click', bacaRamalan);
    document.getElementById('btnUbahWarna').addEventListener('click', ubahWarna);
});
