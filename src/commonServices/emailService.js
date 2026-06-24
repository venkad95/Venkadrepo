const nodemailer = require("nodemailer");

// Create a transporter using SMTP

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER || 'imvenkadesan@gmail.com',
    pass: process.env.SMTP_PASS || 'wdey vpbz tymc eywu'
  },
});

const sendEmail = async(email, otp) =>{
  try {
    const info = await transporter.sendMail({
      from: `"Admin Team" <${process.env.SMTP_USER}>`, // sender address
      to: email, // list of recipients
      subject: "Your OTP Code", // subject line
      text: `Your OTP code is: ${otp}`, // plain text body
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; max-width: 400px; margin: auto;">
          <h2 style="color: #333;">Your OTP Code</h2>
          <p style="font-size: 16px; color: #555;">Use the following OTP to complete your verification process:</p>
          <div style="font-size: 24px; font-weight: bold; color: #007bff; margin: 20px 0;">${otp}</div>
          <p style="font-size: 14px; color: #777;">This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
          <p style="font-size: 12px; color: #aaa;">If you did not request this, please ignore this email.</p>
        </div>
      `, // HTML body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
}
exports.sendEmail = sendEmail;