import express from "express";
import cors from "cors";
import { orderRoutes } from "./infrastructure/http/routes/orderRoutes";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:5173", // frontend de Vite
    })
  );

  app.use(express.json());

  // Tus rutas cuelgan de /api
  app.use("/api", orderRoutes);

  return app;
};
