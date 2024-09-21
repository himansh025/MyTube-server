import { Router } from "express";
import verifyjwt from "../middlewares/auth.middleware.js";

 import { createTweet,getUserTweets,updateTweet,deleteTweet} from '../controllers/tweet.controller.js'
const route= Router()
route.use(verifyjwt)
route.post("/createtweet",createTweet)
route.get("/usertweet",getUserTweets).delete("/deletetweet/:id",deleteTweet).patch("/updatetweet/:id",updateTweet)


export default route