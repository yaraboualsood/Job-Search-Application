import nodemailer from "nodemailer";

// function to generate OTP
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  

//function to send email
export const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "yaramaher87@gmail.com",
            pass: "assdqgvkmeqxtzgu",
        },
    });


    const info = await transporter.sendMail({
        from: '"Yara 👻" <yaramaher87@gmail.com>',
        to: to ? to : "yarasmaher@gmail.com",
        subject: subject ? subject : "hi",
        html: html ? html : "hello",
    });

    if (info.accepted.length) {
        return true
    }
    return false


}