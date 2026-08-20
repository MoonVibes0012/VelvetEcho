const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes API
app.use('/api', apiRoutes);

// Default route untuk frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`🐟 Server Fishgpt berjalan di http://localhost:${PORT}`);
});
