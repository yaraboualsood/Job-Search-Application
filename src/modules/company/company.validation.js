import joi from "joi"


//ADD JOB
export const companyValidation = {
    body: joi.object({
        companyName: joi.string().required().messages({
            "any.required": "company name is required",
        }),
        description: joi.string().required().messages({
            "any.required": "jdescription is required",
        }),
        industry: joi.string().required().messages({
            "any.required": "industry is required",
        }),
        address: joi.string().required().messages({
            "any.required": "address is required"
        }),
        numberOfEmployees: joi.number().required().messages({
            "any.required": "number of employees is required"
        }),
        companyEmail: joi.string().email().required().messages({
            "any.required": "company email is required"
        }),
    })
}

//UPDATE COMAPNY
export const updateCompanyValidation = {
    body: joi.object({
        companyName: joi.string(),
        description: joi.string(),
        industry: joi.string(),
        address: joi.string(),
        numberOfEmployees: joi.number(),
        companyEmail: joi.string().email(),
    }),
    params: joi.object({
        id: joi.string().hex().min(24).max(24).required().messages({
            "any.required": "id required",
            "string.length" : "id doesn't exist"
        }),
    })
}

// DELETE & GET COMPANY
export const deleteAndGetCompanyValidation = {
    params: joi.object({
        id: joi.string().hex().min(24).max(24).required().messages({
            "any.required": "id required",
            "string.length" : "id doesn't exist"
        }),
    })
}


//SEARCH COMPANY  -------------- msh shghal msh fhma leh
export const searchCompanyValidation = {
    params: joi.object({
        companyName: joi.string().required().messages({
            "any.required": "company name is required"
        })
    })
}

//GET ALL APPLICIATIONS FOR A SPECIFIC JOB

export const getAllApplicationsForJob= {
    params: joi.object({
        jobId: joi.string().hex().min(24).max(24).required().messages({
            "any.required": "id required",
            "string.length" : "id doesn't exist"
        }),
    })
}
