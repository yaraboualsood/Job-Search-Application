import companyModel from '../../../DB/models/company.model.js'
import jobModel from '../../../DB/models/job.model.js';
import applicationModel from '../../../DB/models/application.model.js';
import { asyncHandler } from '../../../utils/globalErrorHandling.js';


// ===============================================ADD COMPANY=====================================================
export const addCompany = asyncHandler(async (req, res, next) => {

    const { companyName, description, industry, address, numberOfEmployees, companyEmail, jobId} = req.body
    const { role } = req.user;
    if (role !== 'Company_HR') {
        return next(new Error('Unauthorized', 401))

    }
    const company = await companyModel.create({ companyName, description, industry, address, numberOfEmployees, companyEmail, jobId ,companyHR: req.user._id })
    res.status(201).json({ message: "company added successfully", company });

})

// =============================================UPDATE COMPANY=====================================================
export const updatecompany = asyncHandler(async (req, res, next) => {

    const { role } = req.user;
    if (role !== 'Company_HR') {
        return next(new Error('Unauthorized', 401))

    }
    const { id } = req.params
    const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body
    const updatedCompany = await companyModel.findOneAndUpdate({ _id: id, companyHR: req.user._id }, { companyName, description, industry, address, numberOfEmployees, companyEmail }, { new: true })
    res.status(200).json({ message: "successfully updated", updatedCompany })

})


// =============================================DELETE COMPANY=====================================================
export const deleteCompany = asyncHandler(async (req, res, next) => {
    const { role } = req.user;
    if (role !== 'Company_HR') {
        return next(new Error('Unauthorized', 401))
    }
    const { id } = req.params
    const deletedCompany = await companyModel.findOneAndDelete({ _id: id, companyHR: req.user._id }, { new: true })
    res.status(200).json({ message: "successfully deleted", deletedCompany })


})


//!==================================================GET COMPANY DATA=========================================

export const getCompanyData = asyncHandler(async (req, res, next) => {
    const { role } = req.user;
    if (role !== 'Company_HR') {
        return next(new Error('Unauthorized', 401))
    }
    const { id } = req.params
    const company = await companyModel.findById(id)
    if (!company) {
        return next(new Error('company not found', 404))
    }
    const jobs = await jobModel.find({ addedBy: company.companyHR._id }).populate('addedBy', 'firstName lastName email');
    res.status(200).json({ company, jobs });
}
)
// ====================================SEARCH FOR COMPANY WITH NAME=============================================

export const searchCompanyByName = asyncHandler(async (req, res, next) => {
    const { role } = req.user;
    if (role !== 'Company_HR' && role !== 'User') {
        return next(new Error('Unauthorized', 401))
    }

    const { companyName } = req.params;
    if (!companyName) {
        return next(new Error('Company name is required',404))
    }

    const companies = await companyModel.find({ companyName: { $regex: companyName, $options: 'i' } });
    if (companies.length === 0) {
        return next(new Error('No companies found',404))
    }

    res.status(200).json({ companies });

})


//? =====================================GET ALL APPLICIATIONS FOR A SPECIFIC JOB==================================

export const getAllApplicationsForJob = asyncHandler(async (req, res, next) => {
    const { role } = req.user;
    if (role !== 'Company_HR') {
        return next(new Error('Unauthorized', 401))
    }

    const { jobId } = req.params;
    const job = await jobModel.findById(jobId).populate('addedBy');
    if (!job) {
        return next(new Error('job not found',404))
    }

  
    if (job.addedBy._id.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized to access this job\'s applications', 401))
    }

    const applications = await applicationModel.find({ jobId }).populate('userId');

    if (applications.length === 0) {
        return next(new Error('No applications found for this job',404))
    }

    res.status(200).json({ applications });
})