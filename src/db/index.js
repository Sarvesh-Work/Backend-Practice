 
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


export const ConnectDB= async ()=>{
    try {
        const connection=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("connected with dataBase")
        
    } catch (error) {
       console.log("FAILED TO CONNECT WITH MONGODB",error)
       throw error 
    }

}