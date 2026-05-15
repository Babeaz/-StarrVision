const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const BS_TOKEN = process.env.BS_TOKEN || '';

app.use(cors());
app.use(express.json());

// Sert les fichiers statiques (le site HTML)
app.use(express.static(path.join(__dirname, 'public')));

// Proxy vers l'API Brawl Stars
app.get('/api/players/:tag', async (req, res) => {
  try {
    const tag = req.params.tag;
    const token = BS_TOKEN;

    if (!token) {
      return res.status(500).json({ error: 'BS_TOKEN non configuré sur le serveur.' });
    }

    const url = `https://api.brawlstars.com/v1/players/${encodeURIComponent(tag)}`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route racine
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ BrawlTrack lancé sur http://localhost:${PORT}`);
});
