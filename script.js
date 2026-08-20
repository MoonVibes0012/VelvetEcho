// ============================================================
// PARTIKEL LAUT (CANVAS)
// ============================================================
const canvas = document.getElementById('lautCanvas');
const ctx = canvas.getContext('2d');
let w, h;
function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const partikel = [];
const jumlah = 80;
for (let i = 0; i < jumlah; i++) {
    partikel.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.6,
        dy: (Math.random() - 0.5) * 0.6,
        warna: `hsla(${Math.random() * 60 + 170}, 80%, 60%, ${Math.random() * 0.4 + 0.1})`
    });
}

function animasiPartikel() {
    ctx.clearRect(0, 0, w, h);
    for (let p of partikel) {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > w) p.dx *= -1;
        if (p.y < 0 || p.y > h) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.warna;
        ctx.fill();
        // garis antar partikel
        for (let q of partikel) {
            const dx = p.x - q.x;
            const dy = p.y - q.y;
            const jarak = Math.sqrt(dx*dx + dy*dy);
            if (jarak < 120) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(q.x, q.y);
                ctx.strokeStyle = `rgba(0,255,204,${0.08 * (1 - jarak/120)})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animasiPartikel);
}
animasiPartikel();

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
// API FETCH
// ============================================================
const API = 'http://localhost:3000/api';

async function kirimSinyal() {
    try {
        const res = await fetch(API + '/sinyal', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ pesan: 'Sinyal dari Syntra' })
        });
        const data = await res.json();
        notif('🌊 ' + data.message);
    } catch { notif('❌ Server offline'); }
}

async function hapusJejak() {
    try {
        const res = await fetch(API + '/jejak', { method: 'DELETE' });
        const data = await res.json();
        notif('💀 ' + data.message);
    } catch { notif('❌ Server offline'); }
}

async function bacaRamalan() {
    try {
        const res = await fetch(API + '/ramalan');
        const data = await res.json();
        notif('🔮 ' + data.ramalan);
    } catch { notif('❌ Server offline'); }
}

async function lihatLog() {
    try {
        const res = await fetch(API + '/log');
        const data = await res.json();
        if (data.length === 0) return notif('📜 Tidak ada log.');
        const pesan = data.slice(0, 3).map(l => l.pesan).join(' | ');
        notif('📜 Log terbaru: ' + pesan);
    } catch { notif('❌ Server offline'); }
}

// ============================================================
// COUNTDOWN
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
