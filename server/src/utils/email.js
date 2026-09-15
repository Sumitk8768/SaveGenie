import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendOtpEmail = async (email, otp) => {
    console.log("[Send OTP Email] Sending verification email:", {
        to: email,
        smtpHost: process.env.SMTP_HOST,
        smtpPort: Number(process.env.SMTP_PORT),
        hasSmtpUser: Boolean(process.env.SMTP_USER),
        hasSmtpPassword: Boolean(process.env.SMTP_PASS),
        hasFromAddress: Boolean(process.env.SMTP_FROM),
    });

    try {
        const result = await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: "SaveGenie Email Verification",
            text: `Your SaveGenie verification code is ${otp}. It expires in 10 minutes.`,
        });

        console.log("[Send OTP Email] Email sent successfully:", {
            to: email,
            messageId: result.messageId,
        });

        return result;
    } catch (error) {
        console.error("[Send OTP Email] Failed:", {
            to: email,
            message: error.message,
        });
        throw error;
    }
};
