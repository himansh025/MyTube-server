import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express();

// Middleware configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

// Accept JSON and URL-encoded data
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static files
app.use(express.static("public"));

// Parse cookies
app.use(cookieParser());

import userRouter from './routes/user.routes.js';

// Test route
app.get("/hi", (req, res) => {
  console.log("running");
  res.send("Hi there!");
});

// Use routes
app.use("/api/v1/users",userRouter);

export default app;
