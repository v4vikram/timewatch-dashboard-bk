import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import errorHandler from "./middlewares/errorHandler.js";
import routeStartup from "./routes/routeStartup.js";
import multer from "multer";


connectDB();

const app = express();
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3002',
  'https://timewatch2-0-311005204045.europe-west1.run.app',
  'https://timewatch-website-196626947975.asia-south1.run.app',
  "https://preview.timewatchindia.com",
  'https://timewatch-dashboard-fd-311005204045.europe-west1.run.app',
  'https://timewatchindia.com'
];

// Middlewares
app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.static("public")); // serve uploaded files

// routes
routeStartup(app);

// Error Handler
app.use(errorHandler);

export default app;
