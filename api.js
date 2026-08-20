const express = require('express');
const router = express.Router();
const db = require('../models/db');

// ===== GET /api/ramalan =====
router.get('/ramalan', (req, res) => {
    const ramalanList = [
        'Langit cerah, laut gelap — rahasia besar akan terungkap.',
        'Ombak membawa pesan dari masa depan.',
        'Kedalaman menyimpan jawaban yang kau cari.',
        'Badai akan datang, tapi kau adalah mata badai.',
        'Sesuatu yang hilang akan kembali padamu.'
    ];
    const pilihan = ramalanList[Math.floor(Math.random() * ramalanList.length)];
    res.json({ ramalan: pilihan });
});

// ===== POST /api/sinyal =====
router.post('/sinyal', (req, res) => {
    const { pesan } = req.body;
    // Simpan ke database (opsional)
    db.run(
        'INSERT INTO log (pesan, waktu) VALUES (?, datetime("now"))',
        [pesan || 'Sinyal kosong'],
        function(err) {
            if (err) {
                return res.status(500).json({ message: 'Gagal simpan log' });
            }
            res.json({ 
                message: 'Sinyal diterima: ' + (pesan || 'kosong'),
                id: this.lastID
            });
        }
    );
});

// ===== DELETE /api/jejak =====
router.delete('/jejak', (req, res) => {
    db.run('DELETE FROM log', function(err) {
        if (err) {
            return res.status(500).json({ message: 'Gagal hapus jejak' });
        }
        res.json({ 
            message: `Jejak dihapus! ${this.changes} baris terhapus.`
        });
    });
});

// ===== GET /api/log ===== (melihat semua log)
router.get('/log', (req, res) => {
    db.all('SELECT * FROM log ORDER BY id DESC', (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Gagal ambil log' });
        }
        res.json(rows);
    });
});

module.exports = router;
