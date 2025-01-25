const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

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

pool.query(createTableQuery)
  .then(() => {
    console.log("Table created successfully.");
    pool.end();
  })
  .catch((err) => {
    console.error("Error creating table:", err);
    pool.end();
  });