import { Router } from "express";
import verifyjwt from "../middlewares/auth.middleware.js";
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from '../controllers/playlist.controller.js'
const route= Router()
route.use(verifyjwt)
route.post("/createPlaylist",createPlaylist)
.delete("/deletePlaylist",deletePlaylist)
.patch("/updatePlaylist",updatePlaylist)
.route("/addVideoToPlaylist",addVideoToPlaylist)
route.get("/getPlaylistById/:id",getPlaylistById)
route.get("/getUserPlaylists/:userId",getUserPlaylists)
route.patch("/removeVideoFromPlaylist",removeVideoFromPlaylist)


export default route