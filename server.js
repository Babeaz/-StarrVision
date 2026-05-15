const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const BS_TOKENS = (process.env.BS_TOKEN || '').split(',').map(t => t.trim()).filter(Boolean);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/players/:tag', async (req, res) => {
  try {
    const url = `https://api.brawlstars.com/v1/players/${encodeURIComponent(req.params.tag)}`;
    let lastErr;
    for (const token of BS_TOKENS) {
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) return res.json(data);
      lastErr = data;
    }
    res.status(403).json(lastErr || { error: 'Tous les tokens ont échoué' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ BrawlTrack lancé sur http://localhost:${PORT}`);
});
