const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Lokasi database
const dbPath = path.join(__dirname, '../../database/database.sqlite');
const db = new sqlite3.Database(dbPath);

// Buat tabel jika belum ada
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pesan TEXT,
            waktu TEXT
        )
    `);
});

module.exports = db;
