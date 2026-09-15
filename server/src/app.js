import express from "express";
import cookieParser from "cookie-parser"
import indexRoutes from "./routes/index.routes.js";


const app = express();


app.use((req, res, next) => {
  const allowedOrigin = "http://localhost:5173";

  res.header("Access-Control-Allow-Origin", allowedOrigin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());
app.use(cookieParser())

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/api",indexRoutes)


export default app;
