require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const dataRoutes = require("./routes/data");

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/api/data", dataRoutes(pool));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});