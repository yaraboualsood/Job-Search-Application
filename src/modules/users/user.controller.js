import userModel from "../../../DB/models/user.model.js";
import bcrypt from "bcrypt"
import { generateOTP, sendEmail } from "../../service/sendEmail.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../../../utils/globalErrorHandling.js";


//===============================================SIGN UP=====================================================
export const signUp = asyncHandler(async (req, res, next) => {

    const { firstName, lastName, email, password, recoveryEmail, DOB, mobileNumber, role, status } = req.body
    const username = `${firstName}${lastName}`;

    //check if email already exists
    const emailExist = await userModel.findOne({ email })
    if (emailExist) {
        return next(new Error("Email already exists", 409))
    }
    // Check if username already exists
    const usernameExist = await userModel.findOne({ username });
    if (usernameExist) {
        return next(new Error("Username already exists", 409))

    }

    //send confirmation email
    const token = jwt.sign({ email }, "confirmedSignature")
    const link = `http://localhost:3000/users/confirmEmail/${token}`

    const checkSentEmail = await sendEmail(email, "Confirm Your Email", `<a href='${link}'>Click to Confirm Your Email!</a>`)
    if (!checkSentEmail) {
        return next(new Error("Failed to send email", 500))

    }

    //hash password 
    const hashedPassword = bcrypt.hashSync(password, 10)

    //create user in db
    await userModel.create({ firstName, lastName, username, email, password: hashedPassword, recoveryEmail, DOB, mobileNumber, role, status })
    return res.status(201).json({ message: "User registered successfully", user: email, username });

})

// confirm email
export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params
    const decoded = jwt.verify(token, "confirmedSignature")

    if (!decoded?.email) {
        return next(new Error("Invalid payload", 400))
    }
    const user = await userModel.findOneAndUpdate({ email: decoded.email, confirmed: false }, { confirmed: true }, { new: true })
    if (!user) {
        return next(new Error("user not found or has already been confirmed", 404))

    }
    res.status(200).json({ msg: "email confirmed" })
})

//===============================================SIGN IN======================================================

export const signIn = asyncHandler(async (req, res, next) => {
    const { email, password, recoveryEmail, mobileNumber } = req.body
    const userExist = await userModel.findOne(
        {
            $or: [
                { email },
                { recoveryEmail },
                { mobileNumber }
            ]

            , confirmed: true
        }
    )
    if (!userExist || !bcrypt.compareSync(password, userExist.password)) {
        // return res.status(400).json({ msg: "Invalid email or password, Email not confirmed" })
        return next(new Error("Invalid email or password, Email not confirmed", 400))
    }

    // Update user status to 'online'
    userExist.status = 'online';
    await userExist.save();


    const token = jwt.sign({ id: userExist._id, email }, "yara")
    res.status(200).json({ message: "logged in successfully", token })
})

//============================================UPDATE ACCOUNT=================================================

export const updateUser = asyncHandler(async (req, res, next) => {

    const { email, mobileNumber, recoveryEmail, DOB, lastName, firstName } = req.body
    // if (req.user.status = 'online') {
    const updatedUser = await userModel.findByIdAndUpdate(req.user._id, { email, mobileNumber, recoveryEmail, DOB, lastName, firstName }, { new: true })
    res.status(200).json({ message: "successfully updated", updatedUser })
    // }
    //    return  res.status(400).json({ message: "user not logged in" })
})


//============================================DELETE ACCOUNT=================================================
export const deleteUser = asyncHandler(async (req, res, next) => {

    const user = await userModel.findByIdAndDelete(req.user._id, { new: true })
    res.status(200).json({ message: "successfully deleted", user })

})


//=========================================GET USER ACCOUNT DATA=============================================

export const getUser = asyncHandler(async (req, res, next) => {

    res.status(200).json({ message: "done", user: req.user })

})

//===================================GET PROFILE DATA FOR ANOTHER USER=======================================

export const getAnotherUser = asyncHandler(async (req, res, next) => {

    const { userId } = req.params
    const diffUser = await userModel.findOne({ _id: userId })
    res.status(200).json({ message: "done", diffUser })

})


//============================================UPDATE PASSWORD================================================
export const updatePassword = asyncHandler(async (req, res, next) => {

    const { oldPassword, newPassword } = req.body

    const isMatch = await bcrypt.compare(oldPassword, req.user.password);
    if (!isMatch) {
        // return res.status(400).json({ msg: 'Incorrect old password' });
        return next(new Error('Incorrect old password', 401))

    }
    //hash password 
    const hashedPassword = bcrypt.hashSync(newPassword, 10)
    const updatedUser = await userModel.findByIdAndUpdate(req.user._id, { password: hashedPassword }, { new: true })
    return res.status(200).json({ message: "password successfully updated", updatedUser })


})

//============================================FORGET PASSWORD================================================
export const forgetPassword = asyncHandler(async (req, res, next) => {

    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        // return res.status(404).json({ msg: 'User not found' });
        return next(new Error('User not found', 404))

    }

    const otp = generateOTP();
    user.otpCode = otp;
    user.otpExprire = Date.now() + 3600000; // OTP valid for 1 hour
    await user.save();
    const checkSentEmail = await sendEmail(email, "OTP", `<h1>${otp}</h1>`)
    if (!checkSentEmail) {
        // return res.status(404).json({ msg: "Failed to send email" });
        return next(new Error("Failed to send email", 404))

    }
    return res.status(200).json({ msg: 'OTP sent to email' });

})


//===========================================RESET PASSWORD==================================================
export const resetPassword = asyncHandler(async (req, res) => {

    const { email, otp, newPassword } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
        // return res.status(404).json({ msg: 'user not found' })
        return next(new Error('User not found', 404))

    }

    if (user.otpCode !== otp || user.otpExprire < Date.now()) {
        // return res.status(400).json({ msg: 'Invalid or expired OTP' })
        return next(new Error('Invalid or expired OTP', 400))

    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    user.password = hashedPassword;
    user.otpCode = null;
    user.otpExpiration = null;
    await user.save();

    return res.status(200).json({ msg: 'Password reset successfully' });

})


//======================GET ALL ACCOUNTS ASSOCIATED TO A SPECIFIC RECOVERY EMAIL=============================
export const getAllAccountsByRecoveryEmail = asyncHandler(async (req, res, next) => {
    const { recoveryEmail } = req.params;
    const users = await userModel.find({ recoveryEmail });

    if (!users.length) {
        // return res.status(404).json({ msg: 'No accounts found for this recovery email' });
        return next(new Error('No accounts found for this recovery email', 404))
    }

    res.status(200).json(users);
})