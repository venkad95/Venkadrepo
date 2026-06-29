import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const FROM = `"Admin Team" <${process.env.SENDGRID_FROM_EMAIL}>`;

// ── Core send (SendGrid for BOTH local & production) ──────────────────────────
const sendEmail = async ({ from, to, subject, html }) => {
  const msg = { from, to, subject, html };
  const [response] = await sgMail.send(msg);
  console.log(
    `✅ Email sent via SendGrid [${process.env.NODE_ENV}] → ${to} (status: ${response.statusCode})`
  );
  return response;
};

// ── OTP Verification Email ────────────────────────────────────────────────────
export const emailVerificationSent = async (email, otp) => {
  try {
    const info = await sendEmail({
      from: FROM,
      to: email,
      subject: 'Your OTP Code',
      html: `
        <div style="
          font-family: Arial, sans-serif; 
          text-align: center; 
          padding: 20px; 
          background-color: #f9f9f9; 
          border: 1px solid #ddd; 
          border-radius: 8px; 
          max-width: 400px; 
          margin: auto;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      ">
          <h2 style="color: #02750a; margin-bottom: 10px;">Verify Your Account</h2>
          <p style="font-size: 16px; color: #555; margin-bottom: 20px;">
            Use the OTP below to complete your verification process:
          </p>
          <div style="
            font-size: 28px; 
            font-weight: bold; 
            color: #02750a; 
            background: #e6f7e6; 
            padding: 10px 20px; 
            border-radius: 8px; 
            display: inline-block; 
            margin-bottom: 20px;
          ">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #555; margin-bottom: 10px;">
            This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.
          </p>
          <p style="font-size: 12px; color: #aaa; margin-top: 20px;">
            If you did not request this, please ignore this email.
          </p>
        </div>
      `,
    });
    return info;
  } catch (error) {
    console.error('❌ Error sending OTP email:', error?.response?.body ?? error.message);
    throw error;
  }
};

export const forgotPasswordEmail = async(user, resetLink) => {
  try{
    const verifyEmail = await sendEmail({
      from: FROM,
      to: user.email,
      subject: 'Reset Your Password',
      html: `
        <div style="
          font-family: Arial, sans-serif; 
          text-align: center; 
          padding: 20px; 
          background-color: #f9f9f9; 
          border: 1px solid #ddd; 
          border-radius: 8px; 
          max-width: 500px; 
          margin: auto; 
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        ">
          <h2 style="color: #02750a; margin-bottom: 10px;">Reset Your Password</h2>
          <p style="font-size: 16px; color: #555; margin-bottom: 20px;">
            Hi <strong>${user.firstName}</strong>,
          </p>
          <p style="font-size: 16px; color: #555; margin-bottom: 20px;">
            You requested to reset your password. Click the button below to reset it:
          </p>
          <a href="${resetLink}" style="
            display: inline-block; 
            padding: 12px 20px; 
            background-color: #02750a; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
            font-size: 16px; 
            font-weight: bold;
            margin-bottom: 20px;
          ">
            Reset Password
          </a>
          <p style="font-size: 14px; color: #777; margin-top: 20px;">
            If you did not request this, please ignore this email.
          </p>
          <p style="font-size: 12px; color: #aaa; margin-top: 10px;">
            This link will expire in 10 minutes.
          </p>
        </div>
      `,
    });
    return verifyEmail;
  }
  catch(error){
    console.error('❌ Error sending forgot password email:', error?.response?.body ?? error.message);
    throw error;
  }
}

export { sendEmail };