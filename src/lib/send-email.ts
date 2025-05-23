import nodemailer from 'nodemailer'

/**
 * Sends an email using SMTP with the provided details
 *
 * @param fromAddress - The email address to send from
 * @param toAddress - The email address to send to
 * @param subject - The subject of the email
 * @param content - The HTML content of the email
 * @returns A promise that resolves when the email is sent
 * @throws Error if SMTP configuration is missing or if sending fails
 */
export const sendEmail = async (
  fromAddress: string,
  toAddress: string,
  subject: string,
  content: string
): Promise<void> => {
  // Get SMTP configuration from environment variables
  const port = process.env.SMTP_SERVER_PORT
  const host = process.env.SMTP_SERVER_HOST
  const user = process.env.SMTP_SERVER_USER
  const password = process.env.SMTP_SERVER_PASSWORD

  // Validate that all required SMTP configuration is present
  if (!port || !host || !user || !password) {
    throw new Error(
      'Missing SMTP configuration. Please set SMTP_SERVER_PORT, SMTP_SERVER_HOST, SMTP_SERVER_USER, and SMTP_SERVER_PASSWORD environment variables.'
    )
  }

  // Create a transporter with the SMTP configuration
  const transporter = nodemailer.createTransport({
    port: parseInt(port, 10),
    host,
    auth: {
      user,
      pass: password,
    },
    secure: true, // Use TLS
  })

  // Define the email options
  const mailOptions = {
    from: fromAddress,
    to: toAddress,
    subject,
    html: content,
  }

  try {
    // Send the email
    await transporter.sendMail(mailOptions)
    console.log(`Email sent successfully to ${toAddress}`)
  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error(
      `Failed to send email: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

export const sendOtpToUserViaEmail = async (email: string, otp: string) => {
  await sendEmail(
    'noreply@cls.cloud',
    email,
    'Your Mini-Auth Verification Code',
    `<h1>Verification Code</h1>
         <p>Your verification code is: <strong>${otp}</strong></p>
         <p>This code will expire in 15 minutes.</p>`
  )
  console.log(`Email with OTP code sent to ${email}`)
}
