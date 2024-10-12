import mongoose, { Schema, model } from "mongoose";


const applicationSchema = new Schema({

    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userTechSkills: {
        type: [String],
        required: true
    },
    userSoftSkills: {
        type: [String],
        required: true
    },
    userResume: {
        type: String,
        required: true
    }
},{
    versionKey:false
})

const applicationModel = model("Application", applicationSchema)

export default applicationModel;