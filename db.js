'use strict';

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// ============================================================
// LOKASI DATABASE
// ============================================================

const databaseDir = path.join(
    __dirname,
    '../../database'
);

const dbPath = path.join(
    databaseDir,
    'database.sqlite'
);

// Pastikan folder database ada
if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir, {
        recursive: true
    });
}

// ============================================================
// DATABASE
// ============================================================

const db = new sqlite3.Database(
    dbPath,
    (err) => {
        if (err) {
            console.error(
                '❌ Gagal membuka database:',
                err.message
            );
            return;
        }

        console.log(
            '🗄️ SQLite database terhubung.'
        );
    }
);

// ============================================================
// BUAT TABEL
// ============================================================

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pesan TEXT NOT NULL,
            waktu TEXT NOT NULL
        )
    `, (err) => {

        if (err) {
            console.error(
                '❌ Gagal membuat tabel log:',
                err.message
            );
        } else {
            console.log(
                '📜 Tabel log siap.'
            );
        }
    });

});

// ============================================================
// EXPORT
// ============================================================

module.exports = db;
