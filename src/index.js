// import express from "express";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import {DB_NAME} from '../src/constants.js'
// import app from './app.js'
// import connectDB from './DB/index.js'
// dotenv.config();

// const PORT = process.env.PORT || 5000;
// const MONGO_URL = process.env.MONGODB_URL;
// const db = DB_NAME;


// if (!MONGO_URL && !db) {
//   console.error("MONGODB_URL is not defined in the .env file");
//   process.exit(1);
// }
// console.log(MONGO_URL,db,"url and db done");

// mongoose
//   .connect(`${MONGO_URL}/${db}`)
//   .then(() => {
//     console.log("Connected to MongoDB");
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error("Error connecting to MongoDB", error);
//   });

// const dbconnect = async () => {
//   try {
//     await mongoose.connect(MONGO_URL);
//     console.log("Connected to MongoDB");

//     app.listen(PORT, () => {
//       console.log(`run gohya hu bhai ${PORT}`);
//     });
//   } catch (error) {
//     console.log("error agya hai", error);
//   }
// };
// connectDB();

import dotenv from 'dotenv';
import connectDB from './DB/index.js';
import  app  from './app.js';

// // Load environment variables from .env file
dotenv.config({
    path: './.env',
});


// Connect to the database
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`Server started at port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("Mongodb connection failed :: " , err)
})
