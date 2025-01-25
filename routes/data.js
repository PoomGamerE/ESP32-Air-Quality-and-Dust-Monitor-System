const express = require("express");

module.exports = (pool) => {
  const router = express.Router();

  // ฟังก์ชันตรวจสอบและสร้างตารางอัตโนมัติ
  const ensureTableExists = async () => {
    try {
      const result = await pool.query("SELECT COUNT(*) FROM air_quality_data;");
      if (parseInt(result.rows[0].count, 10) === 0) {
        console.log("No data found. Initializing table...");
        const createTableQuery = `
          CREATE TABLE IF NOT EXISTS air_quality_data (
            id SERIAL PRIMARY KEY,
            temperature FLOAT,
            humidity FLOAT,
            dust_density FLOAT,
            gas_level FLOAT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `;
        await pool.query(createTableQuery);
        console.log("Table initialized successfully.");
      }
    } catch (err) {
      console.error("Error initializing table:", err);
    }
  };

  // เรียก ensureTableExists เมื่อเริ่มเซิร์ฟเวอร์
  ensureTableExists();

  // CREATE: POST /api/data
  router.post("/", async (req, res) => {
    const { temperature, humidity, dust_density, gas_level } = req.body;
    const apiKey = req.headers["x-api-key"];

    if (apiKey !== process.env.SECRET_KEY) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    try {
      const query = `
        INSERT INTO air_quality_data (temperature, humidity, dust_density, gas_level)
        VALUES ($1, $2, $3, $4) RETURNING *;
      `;
      const values = [temperature, humidity, dust_density, gas_level];
      const result = await pool.query(query, values);

      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  });

  // READ: GET /api/data
  router.get("/", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM air_quality_data ORDER BY created_at DESC;");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  });

  // UPDATE: PUT /api/data/:id
  router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { temperature, humidity, dust_density, gas_level } = req.body;

    try {
      const query = `
        UPDATE air_quality_data
        SET temperature = $1, humidity = $2, dust_density = $3, gas_level = $4
        WHERE id = $5 RETURNING *;
      `;
      const values = [temperature, humidity, dust_density, gas_level, id];
      const result = await pool.query(query, values);

      if (result.rowCount === 0) return res.status(404).json({ error: "Record not found" });

      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  });

  // DELETE: DELETE /api/data/:id
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const result = await pool.query("DELETE FROM air_quality_data WHERE id = $1 RETURNING *;", [id]);

      if (result.rowCount === 0) return res.status(404).json({ error: "Record not found" });

      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  });

  return router;
};
