

import { app } from "./app.js";
import { ConnectDB } from "./db/index.js";
import dotenv from "dotenv"

dotenv.config({path:"/env"})

ConnectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is running on :${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("Connection failed with mongodb !!!",err)
})