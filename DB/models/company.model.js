import mongoose,{ Schema, model } from "mongoose";


const companySchema = new Schema({

    companyName: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    numberOfEmployees: {
        type: Number,
        required: true
    },
    companyEmail: {
        type: String,
        unique: true,
        required: true
    },
    companyHR: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // jobId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Job',
    //     required: true
    // }
    
}, {
    versionKey: false
})

const companyModel = model("Company", companySchema)

export default companyModel;