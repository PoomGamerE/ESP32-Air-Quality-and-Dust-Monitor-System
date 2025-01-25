const express = require("express");

module.exports = (pool) => {
  const router = express.Router();

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
      console.log("Query result:", result.rows); // แสดงผลข้อมูลที่ query ได้
      res.json(result.rows);
    } catch (err) {
      console.error("Database error:", err); // แสดง log error
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