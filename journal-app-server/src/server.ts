import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRoutes from "./routes/authRoutes";
import journalRoutes from "./routes/journalRoutes";
import gptRoutes from "./routes/gptRoutes";
import cors from "cors";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: "*", // allow all origins at first
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json()); // parse JSON bodies

// Test route
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.use("/api/auth", authRoutes);

app.use("/user/:user_id", journalRoutes)
app.use("/openai", gptRoutes)
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
