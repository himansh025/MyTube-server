import { Router } from "express";
import verifyjwt from "../middlewares/auth.middleware.js";
import {
    getChannelStats,
    getChannelVideos
}from "../controllers/dashboard.controller.js";
const route= Router()
route.use(verifyjwt)
route.get("/getChannelVideos",getChannelVideos)
route.get("/getChannelStats",getChannelStats)



export default route