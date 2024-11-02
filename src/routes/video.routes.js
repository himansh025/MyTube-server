import { Router } from "express";
import verifyjwt from "../middlewares/auth.middleware.js";
import {getAllVideos,publishAVideo,getVideoById,updateVideo,deleteVideo,incrementView,togglePublishStatus} from "../controllers/video.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
const  route= Router()


// route.use()
route.get("/getallvideos",getAllVideos)
route.get("/getvideobyid/:videoId",getVideoById)

route.post("/incrementView/:videoId",incrementView);
route.use(verifyjwt);
route.post("/addvideo", upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "videofile", maxCount: 1 }
  ]), publishAVideo);
route.patch("/updatevideo/:videoId",upload.fields([
    {
    "name":"videofile",
    "maxCount":1
    },{
        "name":"thumbnail",
        "maxCount":1
        }
]),updateVideo)
route.delete("/deleteVideo/:videoId",deleteVideo)
route.patch("/togglepublishstatus",togglePublishStatus)



export default route