import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRoutes from "./routes/authRoutes";
import journalRoutes from "./routes/journalRoutes";
import cors from "cors";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON bodies

// Test route
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.use("/api/auth", authRoutes);

app.use("/journal-entries", journalRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
