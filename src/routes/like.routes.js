import { Router } from "express";
import verifyjwt from "../middlewares/auth.middleware.js";
import { Liketoggle, toggleCommentLike, toggleTweetLike, getLikedVideos,getLikesOfVideoById,getLikesOfCommentById,getLikesOfTweetById } from '../controllers/like.controller.js'
const route= Router()
route.use(verifyjwt)
route.post('/toggle', Liketoggle)
route.post('/togglecommentlike', toggleCommentLike)
route.post('/toggletweetlike', toggleTweetLike)
route.get('/likedvideos', getLikedVideos)
route.get('/likedvideosbyid', getLikesOfVideoById)
route.get('/likesofcommentbyid', getLikesOfCommentById)
route.get('/likedvideosoftweetbyid', getLikesOfTweetById)




export default route