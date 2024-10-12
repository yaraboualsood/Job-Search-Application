import { Schema, model } from "mongoose";

const userSchema = new Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    recoveryEmail: {
        type: String
    },
    DOB: {
        type: Date,
        required: true
    },
    mobileNumber: {
        type: Number,
        unique: true,
        required: true
    },
    role: {
        type: String,
        enum: ['User', 'Company_HR'],
        required: true
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
    }, 
    confirmed:{
        type: Boolean,
        default: false
    },
    otpCode: String,
    otpExprire: Date
}, {
    versionKey: false
})


const userModel = model("User", userSchema)

export default userModel;