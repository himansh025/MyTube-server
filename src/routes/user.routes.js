import { Router } from "express";
import {  loginuser, registeruser,logoutuser } from "../controllers/user.controller.js";
import {upload} from '../middlewares/multer.middleware.js'
import verifyjwt from '../middlewares/auth.middleware.js'

const router = Router();

// router.get("/reg",REGISTERUSER)

// router.route("/register").post(
//     upload.fields([
// {
//  name:"avatar",
//  maxCount:1    
// },{
//     name:"coverimage",
//     maxCount:1
// }
//      ]),
//      registeruser)

router.post("/register", upload.fields([
    {
     name:"avatar",
     maxCount:1    
    },{
        name:"coverimage",
        maxCount:1
    }
         ]),registeruser)


 router.post("/login",loginuser)


//  secure route
router.post("/logout",verifyjwt,logoutuser);
export default router;