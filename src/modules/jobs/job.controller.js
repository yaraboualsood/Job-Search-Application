import applicationModel from "../../../DB/models/application.model.js";
import companyModel from "../../../DB/models/company.model.js";
import jobModel from "../../../DB/models/job.model.js";
import { asyncHandler } from "../../../utils/globalErrorHandling.js";


// ===============================================ADD JOB=====================================================
export const addJob = asyncHandler(async (req, res, next) => {

    const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, companyId } = req.body
    const { role } = req.user;
    if (role !== 'Company_HR') {
        return next(new Error('Unauthorized', 401))

    }
    const job = await jobModel.create({ jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, companyId,addedBy: req.user._id})
    res.status(201).json({ message: "job added successfully", job });


})

// =============================================UPDATE JOB=====================================================
export const updateJob = asyncHandler(async (req, res, next) => {

    const { role } = req.user;
    if (role !== 'Company_HR') {
        // return res.status(401).json({ msg: 'Unauthorized' });
        return next(new Error('Unauthorized', 401))
    }
    const { id } = req.params
    const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body
    const updatedJob = await jobModel.findOneAndUpdate({ _id: id, addedBy: req.user._id }, { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills }, { new: true })
    res.status(200).json({ message: "successfully updated", updatedJob })


})


// =============================================DELETE JOB=====================================================
export const deleteJob = asyncHandler(async (req, res, next) => {
    const { role } = req.user;
    if (role !== 'Company_HR') {
        return next(new Error('Unauthorized', 401))

    }
    const { id } = req.params
    const deletedJob = await jobModel.findOneAndDelete({ _id: id, addedBy: req.user._id }, { new: true })
    res.status(200).json({ message: "successfully deleted", deletedJob })

})


//!=====================================GET ALL JOBS WITH THEIR COMPANYS INFO==================================
export const getAllJobsWithCompanyInfo = asyncHandler(async (req, res, next) => {

    const { role } = req.user;
    if (role !== 'Company_HR' && role !== 'User') {
        return next(new Error('Unauthorized', 401))
    }
    const company = await companyModel.find()
    const jobs = await jobModel.find()
        .populate({
            path: 'addedBy',
            model: 'User',
            match: {
                addedBy: company.companyHR
            }
        })

    res.status(200).json({ jobs, company });
})


//!===================================GET ALL JOBS FOR A SPECIFIC COMPANY======================================
export const getAllJobsForASpecificCompany = asyncHandler(async (req, res, next) => {

    const { role } = req.user;
    if (role !== 'Company_HR' && role !== 'User') {
        return next(new Error('Unauthorized', 401))
    }

    const { companyName } = req.query
    const company = await companyModel.findOne({ companyName })
    console.log(company)
    if (!company) {
        return next(new Error('company name not found', 404))
    }

    const jobs = await jobModel.find()
        .populate({
            path: 'addedBy',
            model: 'User',
            match: {
                addedBy: company.companyHR._id
            }
        })
    res.status(200).json({ jobs, company });

})


//?=================================GET ALL JOBS THAT MATCH THE FOLLOWING FILTERS=============================
export const getFilteredJobs = asyncHandler(async (req, res) => {

    const { role } = req.user;
    if (role !== 'User' && role !== 'Company_HR') {
        return next(new Error('Unauthorized', 401))
    }

    const {
        workingTime,
        jobLocation,
        seniorityLevel,
        jobTitle,
        technicalSkills } = req.query;


    const query = {};
    if (workingTime) {
        query.workingTime = { $regex: `^${workingTime}$`, $options: 'i' };
    }

    if (jobLocation) {
        query.jobLocation = { $regex: `^${jobLocation}$`, $options: 'i' };
    }

    if (seniorityLevel) {
        query.seniorityLevel = { $regex: `^${seniorityLevel}$`, $options: 'i' };
    }

    if (jobTitle) {
        query.jobTitle = { $regex: jobTitle, $options: 'i' };
    }

    if (technicalSkills) {
        const skillsArray = technicalSkills.split(',').map(skill => skill.trim().toLowerCase());
        query.technicalSkills = { $all: skillsArray };
    }

    const jobs = await jobModel.find(query);

    res.status(200).json({ jobs });

})



//?===========================================APPLY TO JOB===================================================

export const applyJob = asyncHandler(async (req, res, next) => {

    const { role } = req.user;
    if (role !== 'User') {
        return next(new Error('Unauthorized', 401))
    }

    const { jobId } = req.params;
    const { userTechSkills, userSoftSkills} = req.body;

    const application = await applicationModel.create({
        jobId,
        userId: req.user._id,
        userTechSkills,
        userSoftSkills,
        userResume: req.file.path,
    })

    res.status(201).json({ msg: 'Applied to job successfully' , application })
})