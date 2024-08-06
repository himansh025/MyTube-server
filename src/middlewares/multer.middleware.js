//  multer jane se pehle mil kar jana
import multer from "multer";

const storage= multer.diskStorage({
    // multer has the file ,req from the user,cb is callback 
    destination: function(req, file, cb){
        // first para null ,2nd path for the file 
cb(null,"./public/temp")
},
 filename:function(req,file,cb){
    cb(null,file.originalname)
    console.log("uploaded",file.originalname );
 }
})
 
export const upload = multer({
     storage})