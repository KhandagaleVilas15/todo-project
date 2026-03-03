const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool, initDb } = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const allowedOrigin = process.env.CORS_ORIGIN || '*';

app.use(
  cors(
    allowedOrigin === '*'
      ? {}
      : {
          origin: allowedOrigin,
        },
  ),
);

app.use(express.json());

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Health check failed', err);
    res.status(500).json({ status: 'error' });
  }
});

app.get('/api/students', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, phone, course, address FROM students ORDER BY id DESC',
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching students', err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

app.post('/api/students', async (req, res) => {
  const { name, email, phone, course, address } = req.body || {};

  if (!name || !email || !course) {
    return res
      .status(400)
      .json({ error: 'name, email and course are required' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO students (name, email, phone, course, address) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || null, course, address || null],
    );

    res.status(201).json({
      id: result.insertId,
      name,
      email,
      phone: phone || null,
      course,
      address: address || null,
    });
  } catch (err) {
    console.error('Error inserting student', err);
    res.status(500).json({ error: 'Failed to add student' });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.execute(
      'DELETE FROM students WHERE id = ?',
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Error deleting student', err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Student API listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialise database', err);
    process.exit(1);
  });

