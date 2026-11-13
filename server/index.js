require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const api = require("./routes/crud");
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (_req, res) => res.json({ message: "Taga Repair API is running" }));
app.use("/api", api);
app.use((err, _req, res, _next) => res.status(500).json({ message: err.message || "Server error" }));
const port = process.env.PORT || 3005;
sequelize.authenticate()
  .then(() => sequelize.sync())
  .then(() => app.listen(port, () => console.log(`API running at http://localhost:${port}`)))
  .catch(err => { console.error("Database connection failed:", err.message); process.exit(1); });
