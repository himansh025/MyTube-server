import mongoose from "mongoose";
// import { DB_NAME } from '../constants.js';
import dotenv from 'dotenv'
dotenv.config({
    path: './.env',
});
// const MONGODB_URL='mongodb://localhost:27017/youtube'
const mb=process.env.MONGODB_URL;
import app from '../app.js'
const connectDB = async() =>{
try {
    console.log("uri  : " ,mb);
    // console.log("db name  : " , DB_NAME);
    const connectionInstance= await  mongoose.connect(mb)
    // console.log(connectionInstance);
    console.log(` mogo connectes db host : ${connectionInstance.connection.host}`);
    
    app.on("error",(error)=>{
       console.log("error",error);
    //    throw errory
    })

} catch (error) {
    console.log(error,"error");
    process.exit(1)
    
}
}
export default connectDB;