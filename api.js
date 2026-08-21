'use strict';

const express = require('express');
const router = express.Router();

const db = require('../models/db');

// ============================================================
// GET /api/ramalan
// ============================================================

router.get('/ramalan', (req, res) => {

    const ramalanList = [
        'Langit cerah, laut gelap — rahasia besar akan terungkap.',
        'Ombak membawa pesan dari masa depan.',
        'Kedalaman menyimpan jawaban yang kau cari.',
        'Badai akan datang, tapi kau adalah mata badai.',
        'Sesuatu yang hilang akan kembali padamu.'
    ];

    const pilihan =
        ramalanList[
            Math.floor(
                Math.random() * ramalanList.length
            )
        ];

    res.json({
        ramalan: pilihan
    });
});

// ============================================================
// POST /api/sinyal
// ============================================================

router.post('/sinyal', (req, res) => {

    const pesan =
        typeof req.body?.pesan === 'string'
            ? req.body.pesan.trim()
            : '';

    const pesanFinal =
        pesan || 'Sinyal kosong';

    db.run(
        `
        INSERT INTO log (pesan, waktu)
        VALUES (?, datetime('now', 'localtime'))
        `,
        [pesanFinal],
        function (err) {

            if (err) {

                console.error(
                    '❌ Gagal menyimpan sinyal:',
                    err.message
                );

                return res.status(500).json({
                    message: 'Gagal simpan log'
                });
            }

            return res.json({
                message:
                    'Sinyal diterima: ' +
                    pesanFinal,

                id: this.lastID
            });
        }
    );
});

// ============================================================
// DELETE /api/jejak
// ============================================================

router.delete('/jejak', (req, res) => {

    db.run(
        'DELETE FROM log',
        function (err) {

            if (err) {

                console.error(
                    '❌ Gagal menghapus log:',
                    err.message
                );

                return res.status(500).json({
                    message: 'Gagal hapus jejak'
                });
            }

            return res.json({
                message:
                    `Jejak dihapus! ${this.changes} baris terhapus.`
            });
        }
    );
});

// ============================================================
// GET /api/log
// ============================================================

router.get('/log', (req, res) => {

    db.all(
        `
        SELECT id, pesan, waktu
        FROM log
        ORDER BY id DESC
        `,
        (err, rows) => {

            if (err) {

                console.error(
                    '❌ Gagal mengambil log:',
                    err.message
                );

                return res.status(500).json({
                    message: 'Gagal ambil log'
                });
            }

            return res.json(rows || []);
        }
    );
});

// ============================================================
// API 404
// ============================================================

router.use((req, res) => {

    res.status(404).json({
        message: 'Endpoint API tidak ditemukan.'
    });
});

module.exports = router;
