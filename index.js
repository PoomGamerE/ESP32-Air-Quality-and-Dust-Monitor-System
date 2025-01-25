const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// ใช้ Body Parser เพื่ออ่าน JSON จาก request
app.use(bodyParser.json());

// เชื่อมต่อ PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Render จะตั้งค่า ENV ตัวนี้ให้
  ssl: {
    rejectUnauthorized: false, // สำหรับการเชื่อมต่อ SSL
  },
});

// สร้าง Table ถ้ายังไม่มี
const initDB = async () => {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS air_quality (
        id SERIAL PRIMARY KEY,
        temperature REAL NOT NULL,
        humidity REAL NOT NULL,
        dust_density REAL NOT NULL,
        gas_level REAL NOT NULL,
        timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);
    client.release();
    console.log('Database initialized successfully!');
  } catch (err) {
    console.error('Error initializing database:', err.message);
  }
};

initDB();

// API Endpoint: รับข้อมูลจาก ESP32
app.post('/api/data', async (req, res) => {
  const { temperature, humidity, dust_density, gas_level } = req.body;

  if (temperature && humidity && dust_density && gas_level) {
    try {
      const result = await pool.query(
        'INSERT INTO air_quality (temperature, humidity, dust_density, gas_level) VALUES ($1, $2, $3, $4) RETURNING id',
        [temperature, humidity, dust_density, gas_level]
      );
      res.status(200).json({ message: 'Data inserted successfully', id: result.rows[0].id });
    } catch (err) {
      console.error('Error inserting data:', err.message);
      res.status(500).json({ message: 'Failed to insert data' });
    }
  } else {
    res.status(400).json({ message: 'Invalid data format' });
  }
});

// API Endpoint: ดูข้อมูลทั้งหมด
app.get('/api/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM air_quality ORDER BY timestamp DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching data:', err.message);
    res.status(500).json({ message: 'Failed to fetch data' });
  }
});

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
