import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import {globalErrorHandler} from "./middlewares";
import {
  messageRoutes,
  authRoutes,
  floorRoutes,
  unitRoutes,
  excelRouter,
  userRouter,
} from "./routes"

const app = express();

// Middlewares
app.use(express.json());
// app.use(
//   cors({
//     origin: "http://localhost:5173", 
//     credentials: true,
//   })
// );
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://kavi-gamma.vercel.app",
  "https://kavi-panel.lodestar-visual.cloud",
  "https://kavi.lodestar-visual.cloud",
];

const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    if (!origin) return callback(null, true); // allow curl/Postman
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // allow cookies for login later
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());


// API Routes
app.use("/api/v1/kavi-mall/message", messageRoutes);
app.use("/api/v1/kavi-mall/auth", authRoutes);
app.use("/api/v1/kavi-mall/floor", floorRoutes);
app.use("/api/v1/kavi-mall/unit", unitRoutes);
app.use("/api/v1/kavi-mall/excel", excelRouter);
app.use("/api/v1/kavi-mall/user", userRouter);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
