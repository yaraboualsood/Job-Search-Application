import mongoose from "mongoose";

const connectionDB= async ()=>{
    return await mongoose.connect("mongodb://127.0.0.1:27017/exam1")
    .then(()=>{
        console.log("successfully connected to database")
    }).catch((err)=>{
        console.log({message:"failed to connect", err})
    })
}

export default connectionDB