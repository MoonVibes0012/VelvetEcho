// ============================================================
// PARTIKEL LAUT (RINGAN + OPTIMAL)
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
const jumlah = 35;  // dikurangi dari 80 → 35 biar ringan

for (let i = 0; i < jumlah; i++) {
    partikel.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        warna: `hsla(${Math.random() * 40 + 180}, 80%, 60%, ${Math.random() * 0.3 + 0.1})`
    });
}

let frameId = null;

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
    }
    // Gambar garis antar partikel (opsional, dikurangi jarak)
    for (let i = 0; i < partikel.length; i++) {
        for (let j = i + 1; j < partikel.length; j++) {
            const p = partikel[i];
            const q = partikel[j];
            const dx = p.x - q.x;
            const dy = p.y - q.y;
            const jarak = Math.sqrt(dx*dx + dy*dy);
            if (jarak < 100) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(q.x, q.y);
                ctx.strokeStyle = `rgba(0,255,204,${0.05 * (1 - jarak/100)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
    frameId = requestAnimationFrame(animasiPartikel);
}

animasiPartikel();

// Hentikan animasi saat tab tidak aktif (opsional)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (frameId) cancelAnimationFrame(frameId);
    } else {
        animasiPartikel();
    }
});        const data = await res.json();
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
