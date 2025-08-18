import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./routes/index.js";
import adminRoutes from "./routes/admin.js";

const app = express();

app.set("trust proxy", true);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use("/api", router);
app.use("/api/admin", adminRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  
  // Handle Prisma errors specifically
  if (err.code === 'P2002') {
    return res.status(409).json({ error: "Duplicate entry" });
  }
  
  if (err.code === 'P2025') {
    return res.status(404).json({ error: "Record not found" });
  }
  
  // Default error response
  res.status(500).json({ 
    error: "Internal server error",
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

const port = process.env.PORT || 4000;

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

app.listen(port, () => {
  console.log(`🚀 API listening on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🔗 API base: http://localhost:${port}/api`);
});