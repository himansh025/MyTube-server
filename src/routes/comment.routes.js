import { Router } from "express";
import verifyjwt from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getvideoComments, updateComment } from "../controllers/comment.controller.js";

const route= Router()
route.use(verifyjwt)
route.get("/allcomments",getvideoComments)
route.post("/addcomment",addComment).delete("/deltecomment",deleteComment).patch("/updatecomment",updateComment)


export default route