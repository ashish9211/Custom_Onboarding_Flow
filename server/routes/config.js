const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = new Pool();

// Get config
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM config WHERE id = 1');
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Config not found' });
    }
    const row = result.rows[0];
    res.json({
      page2Components: row.page2_components,
      page3Components: row.page3_components,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update config
router.post('/', async (req, res) => {
  const { page2Components, page3Components } = req.body;
  if (!Array.isArray(page2Components) || !Array.isArray(page3Components)) {
    return res.status(400).json({ error: 'Components must be arrays' });
  }
  try {
    const updateQuery = `
      UPDATE config
      SET page2_components = $1, page3_components = $2
      WHERE id = 1
      RETURNING *;
    `;
    const result = await pool.query(updateQuery, [JSON.stringify(page2Components), JSON.stringify(page3Components)]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;