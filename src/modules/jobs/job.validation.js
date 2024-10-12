import joi from "joi"


//ADD JOB
export const jobValidation = {
    body: joi.object({
        jobTitle: joi.string().min(4).required().messages({
            "any.required": "job title is required",
            "string.min": "job title is too short",
        }),
        jobLocation: joi.string().valid('onsite', 'remotely', 'hybrid').required().messages({
            "any.required": "job location is required",
        }),
        workingTime: joi.string().valid('part-time', 'full-time').required().messages({
            "any.required": "working time is required",
        }),
        seniorityLevel: joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO').required().messages({
            "any.required": "seniority Level is required"
        }),
        jobDescription: joi.string().required().messages({
            "any.required": "job description is required"
        }),
        technicalSkills: joi.string().required().messages({
            "any.required": "technical skills is required"
        }),
        softSkills: joi.string().required().messages({
            "any.required": "soft skills is required"
        }),
        companyId: joi.string().required().messages({
            "any.required": "soft skills is required"
        }),
    })
}


//UPDATE JOB
export const updateJobValidation = {
    body: joi.object({
        jobTitle: joi.string().min(4).messages({
            "string.min": "job title is too short",
        }),
        jobLocation: joi.string().valid('onsite', 'remotely', 'hybrid'),
        workingTime: joi.string().valid('part-time', 'full-time').required(),
        seniorityLevel: joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'),
        jobDescription: joi.string(),
        technicalSkills: joi.string(),
        softSkills: joi.string(),
    }),
    params: joi.object({
        id: joi.string().hex().min(24).max(24).required().messages({
            "any.required": "id required",
            "string.length" : "id doesn't exist"
        }),
    })

}

// DELETE JOB

export const deleteJobValidation = {
    params: joi.object({
        id: joi.string().hex().min(24).max(24).required().messages({
            "any.required": "id required",
            "string.length" : "id doesn't exist"
        }),
    })
}


//GET ALL JOBS FOR A SPECIFIC COMPANY 

export const getAllJobsSpecificCompanyValidation = {
    query: joi.object({
        companyName: joi.string().required().messages({
            "any.required": "id required",
        }),
    })
}


//FILTER JOBS

export const filterJobsValidation = {
    query: joi.object({
        workingTime: joi.string(),
        jobLocation: joi.string(),
        seniorityLevel: joi.string(),
        jobTitle: joi.string(),
        technicalSkills: joi.string()
    })
}


//APPLY FOR A JOB

export const applyJob = {
    body: joi.object({
        userTechSkills: joi.string().required().messages({
            "any.required": "user tech skills required",
        }),
        userSoftSkills: joi.string().required().messages({
            "any.required": "user soft skills required",
        }),
       
    }),
    params: joi.object({
        jobId:joi.string().hex().min(24).max(24).required().messages({
            "any.required": "id required",
            "string.length" : "id doesn't exist"
        }),
    })
}
