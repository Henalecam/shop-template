import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./routes/index.js";

const app = express();

app.set("trust proxy", true);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/api", router);

// Global error handler
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on port ${port}`);
});