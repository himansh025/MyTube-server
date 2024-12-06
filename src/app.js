import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
const app = express();

// Middleware configuration
// Accept JSON and URL-encoded data
// Serve static files
// Parse cookies

// import cors from 'cors';

const allowedOrigins = ['http://localhost:5173', 'https://merntube.netlify.app'];

app.use(cors({
  origin: allowedOrigins, // Allow specific origins
  credentials: true,      // Allow cookies or auth headers
}));


// if (process.env.NODE_ENV === 'production') {
//   app.use(cors({
//     origin: process.env.CORS_ORIGIN, // Set this in your production .env file
//     credentials: true,
//   }));

  
// } else {
//   app.use(cors({
//     origin: 'http://localhost:5173', // Frontend URL for development
//     credentials: true,
//   }));
// }

  
  app.use(express.json({ limit: "16kb" }));
  app.use(express.urlencoded({ extended: true, limit: "16kb" }));
  app.use(express.static("public"));
  app.use(cookieParser());
  
  // Test route
  // app.get("/hi", (req, res) => {
  //   console.log("running");
  //   res.send("Hi there!");
  // });
  
  import userRouter from './routes/user.routes.js';
  import commentRouter from './routes/comment.routes.js'
import videoRouter from './routes/video.routes.js'
import likeRouter from './routes/like.routes.js'
import tweetRouter from './routes/tweet.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'
import dashboardRouter from './routes/dashboard.routes.js'
import playlistRouter from './routes/playlist.routes.js'


app.use("/api/v1/users", userRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/tweet", tweetRouter)
app.use("/api/v1/subs", subscriptionRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/playlist", playlistRouter);

export default app;