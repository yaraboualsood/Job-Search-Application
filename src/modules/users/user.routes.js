import { Router } from "express";
import * as UC from "./user.controller.js"
import { validation } from "../../middleware/validation.js";
import * as UV from "./user.validation.js";
import { auth } from "../../middleware/auth.js";

const router = Router() 

//===============================================SIGN UP=====================================================
router.post('/signup', validation(UV.signUpValidation) ,UC.signUp)

//to confirm email
router.get('/confirmEmail/:token', UC.confirmEmail)


//===============================================LOG IN======================================================
router.post('/signin', validation(UV.signInValidation),UC.signIn)


//============================================UPDATE ACCOUNT=================================================
router.put('/',validation(UV.updateValidation),auth(),UC.updateUser)


//============================================DELETE ACCOUNT=================================================
router.delete('/',auth(),UC.deleteUser)

//=========================================GET USER ACCOUNT DATA=============================================
router.get('/profile', auth() ,UC.getUser)

//===================================GET PROFILE DATA FOR ANOTHER USER=======================================

router.get('/profile/:userId', validation(UV.getDataAnotherAcc) ,UC.getAnotherUser)

//============================================UPDATE PASSWORD================================================
router.put('/profile/password',auth(),validation(UV.updatePassValidation),UC.updatePassword)


//============================================FORGET PASSWORD================================================
router.post('/profile/password', validation(UV.forgetPassword),UC.forgetPassword)


//===========================================RESET PASSWORD==================================================
router.post('/profile/resetPassword',validation(UV.resetPassValidation),UC.resetPassword)


//======================GET ALL ACCOUNTS ASSOCIATED TO A SPECIFIC RECOVERY EMAIL=============================
router.get('/accounts/:recoveryEmail', validation(UV.getAccsRecoveryEmail), UC.getAllAccountsByRecoveryEmail);

export default router