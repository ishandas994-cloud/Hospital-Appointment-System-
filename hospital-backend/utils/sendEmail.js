import nodemailer from 'nodemailer'

// Reusable transporter — configured once, used everywhere
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS    // Use Gmail App Password, not real password
  }
})

// sendEmail({ to, subject, html })
// Called after booking, cancellation, etc.
// NOTE: email failure does NOT throw — we log it and move on
//       so the API response still succeeds even if email fails

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"MediCare Hospital" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    })
    console.log(`📧 Email sent to ${to}`)
  } catch (error) {
    console.error(`❌ Email failed: ${error.message}`)
    // Do NOT throw — email is non-critical
  }
}
