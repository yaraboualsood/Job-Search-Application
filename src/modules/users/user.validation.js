import joi from "joi"


//SIGN UP
export const signUpValidation = {
    body: joi.object({
        firstName: joi.string().min(3).max(15).required().messages({
            "any.required": "first name is required",
            "string.min": "first name is too short",
        }),
        lastName: joi.string().min(3).max(15).required().messages({
            "any.required": "last name is required",
            "string.min": "last name is too short",
        }),
        email: joi.string().email().required().messages({
            "any.required": "email is required",
        }),
        password: joi.string().pattern(new RegExp(/^.{8,}$/)).required().messages({
            "any.required": "password is required"
        }),
        // cPassword:joi.string().valid(joi.ref("password")).required(),
        recoveryEmail: joi.string().email(),
        DOB: joi.date().required(),
        mobileNumber: joi.number().required().messages({
            "any.required": "mobile number is required"
        }),
        role: joi.string().valid('User', 'Company_HR').required().messages({
            "any.required": "role is required"
        }),
        status: joi.string().valid('online', 'offline')
    })
}




//SIGN IN
export const signInValidation = {
    body: joi.object({
        email: joi.string().email().required().messages({
            "any.required": "email is required",
        }),
        password: joi.string().pattern(new RegExp(/^.{8,}$/)).required().messages({
            "any.required": "password is required"
        }),
        recoveryEmail: joi.string().email(),
        mobileNumber: joi.number(),

    })
}


//UPDATE ACCOUNT
export const updateValidation = {
    body: joi.object({
        firstName: joi.string().min(3).max(15).messages({
            "string.min": "first name is too short",
        }),
        lastName: joi.string().min(3).max(15).messages({
            "string.min": "last name is too short",
        }),
        email: joi.string().email().messages({
        }),
        recoveryEmail: joi.string().email(),
        DOB: joi.date().required(),
        mobileNumber: joi.number()
    })
}


//GET  PROFILE DATA FOR ANOTHER USER
export const getDataAnotherAcc = {
    params: joi.object({
        userId:  joi.string().hex().min(24).max(24).required().messages({
             "any.required": "id required",
            "string.length" : "id doesn't exist"
        }), 
        

    })
}


//UPDATE PASSWORD
export const updatePassValidation = {
    body: joi.object({
        newPassword: joi.string().pattern(new RegExp(/^.{8,}$/)).required().messages({
            "any.required": "new password is required",
            "string.pattern.base": "new password is not valid"

        }),

        oldPassword: joi.string().pattern(new RegExp(/^.{8,}$/)).required().messages({
            "any.required": "old password is required",

        })
    })
}



//FORGET PASSWORD
export const forgetPassword = {
    body: joi.object({
        email: joi.string().email().required().messages({
            "any.required": "email is required"
        })
    })
}



//RESET PASSWORD
export const resetPassValidation = {
    body: joi.object({
        email: joi.string().email().required().messages({
            "any.required": "email is required"
        }),
        otp: joi.string().required().messages({
            "any.required": "OTP is required"
        }),
        newPassword: joi.string().pattern(new RegExp(/^.{8,}$/)).required().messages({
            "any.required": "new password is required",
            "string.pattern.base": "new password is not valid"
        }),
       
    })
}



// GET ALL ACCOUNTS ASSOCIATED TO A SPECIFIC RECOVERY EMAIL
export const getAccsRecoveryEmail = {
    params: joi.object({
        recoveryEmail: joi.string().email().required().messages({
            "any.required": "recovery email is required"
        })
    })
}
