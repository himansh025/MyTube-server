import { Router } from "express";
import verifyjwt from "../middlewares/auth.middleware.js";
import {toggleSubscription,getUserChannelSubscribers,getSubscribedChannels} from '../controllers/subscription.controller.js'
const route= Router()

route.use(verifyjwt)
route.post("/togglesubs/:channelId",toggleSubscription)
route.get("/getsubs/:channelId",getUserChannelSubscribers)
route.get("/getsubchannel/:subscriberId",getSubscribedChannels)


// route.post()


export default route