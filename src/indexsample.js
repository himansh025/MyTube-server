// take try catch whenever talk to db,wrap it
// database is always in another continent so it takes time that why needs to use async await

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants"; 
// import express from 'express'


// function connectDB(){}
// connectDB()
      // db connect now give / and db name
// we use iife



/*
const app = express()

(async () => {
    try {
  
     await  mongoose.connect(`${process.env.MOGODB_URL}/${DB_NAME}`)
     app.on("error",(error)=>{
        console.log("error",error);
        throw error
     })

     app.listen(process.env.PORT, ()=>{
        console.log("App is listning on port");
             })
             
    }

     catch (error) {
      console.log(error,"error")
        
    }})(); */
