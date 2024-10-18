import connectDB from './DB/index.js';
import app from './app.js';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config({
    path: './.env',
});

// Connect to the database
connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server started at port ${process.env.PORT}`);
    });
}).catch((err) => {
    console.log("Mongodb connection failed: ", err);
});
 