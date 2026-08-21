'use strict';

const express = require('express');
const cors = require('cors');
const path = require('path');

const apiRoutes = require('./routes/api');

// ============================================================
// APP
// ============================================================

const app = express();

const PORT =
    Number(process.env.PORT) || 3000;

const FRONTEND_DIR =
    path.join(__dirname, '../frontend');

// ============================================================
// MIDDLEWARE
// ============================================================

app.disable('x-powered-by');

app.use(cors());

app.use(
    express.json({
        limit: '100kb'
    })
);

app.use(
    express.urlencoded({
        extended: false,
        limit: '100kb'
    })
);

// ============================================================
// FRONTEND
// ============================================================

app.use(
    express.static(FRONTEND_DIR, {
        extensions: ['html'],
        maxAge: 0
    })
);

// ============================================================
// API
// ============================================================

app.use('/api', apiRoutes);

// ============================================================
// DEFAULT ROUTE
// ============================================================

app.get('/', (req, res) => {

    res.sendFile(
        path.join(
            FRONTEND_DIR,
            'index.html'
        )
    );
});

// ============================================================
// ERROR HANDLER
// ============================================================

app.use((err, req, res, next) => {

    console.error(
        '❌ Server error:',
        err
    );

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        message: 'Terjadi kesalahan pada server.'
    });
});

// ============================================================
// START SERVER
// ============================================================

const server = app.listen(
    PORT,
    () => {

        console.log('');
        console.log(
            '🐟 Fishgpt server aktif.'
        );

        console.log(
            `🌐 http://localhost:${PORT}`
        );

        console.log(
            `📡 API: http://localhost:${PORT}/api`
        );

        console.log('');
    }
);

// ============================================================
// SHUTDOWN
// ============================================================

function shutdown(signal) {

    console.log(
        `\n🛑 ${signal} diterima.`
    );

    server.close(() => {

        console.log(
            '🐟 Server dihentikan.'
        );

        process.exit(0);
    });
}

process.on(
    'SIGINT',
    () => shutdown('SIGINT')
);

process.on(
    'SIGTERM',
    () => shutdown('SIGTERM')
);
