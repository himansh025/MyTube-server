  import { Router } from "express";
  import {
    loginuser,
    registeruser,
    logoutuser,
    refreshaccesstoken,
    passwordchange,
    getcurrentuser,
    updateaccountdetails,
    updatravatarimage,
    updatecoverimage,
    getwatchhistory,
    getUserChannelsdetails
  } from "../controllers/user.controller.js";
  import { upload } from '../middlewares/multer.middleware.js';
  import verifyjwt from '../middlewares/auth.middleware.js';

  const router = Router();

  router.post("/register"
  ,upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverimage", maxCount: 1 }
  ]), registeruser);

  router.post("/login", loginuser);
  router.post("/logout", verifyjwt, logoutuser);
  router.post("/refresh-token", refreshaccesstoken);
  router.post("/change-password", verifyjwt, passwordchange);  
  router.get("/current-user",verifyjwt,getcurrentuser);
  router.patch("/update-account", verifyjwt, updateaccountdetails);
  router.patch("/update-avatar", verifyjwt, upload.single("avatar"), updatravatarimage);
  router.patch("/update-cover", verifyjwt, upload.single("coverimage"), updatecoverimage);
  router.get("/c/:username", verifyjwt, getUserChannelsdetails); // Fixed here
  router.get("/history", verifyjwt, getwatchhistory); // Fixed here

  export default router;
