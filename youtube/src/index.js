// require('dotenv').config({path: './env'})
                // OR
import dotenv from "dotenv"
dotenv.config({
    path: './env'
})


import connectDB from "./db/index.js";


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server id running on PORT: ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("Mongo DB connection failed !!!", err);
})








// APPROACH -1 Cnnection of DB 

// import { DB_NAME } from "./constants";
// import mongoose from "mongoose";

// import express from "express"
// const app=express()

// // It is a type of function where we connect DB
// ; (async () => {
//     try{
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//        app.on("error", () => { //app.on is a listeners of express
//        console.log("ERRR: ", error);
//        throw error
//        })
        
//        app.listen(process.env.PORT, () => {
//         console.log(`App is listening on port ${process.env.PORT}`);
//        })
//     }catch(error){
//        console.error("ERROR: ", error)
//        throw err
//     }
// })()