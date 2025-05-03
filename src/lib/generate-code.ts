import { writeFile } from 'fs/promises' // PRODUCTION:REMOVE

const OTP_FILE_PATH = '/tmp/otp.txt' // PRODUCTION:REMOVE

// PRODUCTION:REMOVE-NEXT-LINE
const writeOtpCode = async (otpCode: string): Promise<void> => {
  await writeFile(OTP_FILE_PATH, otpCode, { encoding: 'utf8' }) // PRODUCTION:REMOVE
} // PRODUCTION:REMOVE

export const generateToken = async () => {
  // Generate a random 6-digit code not starting with zero
  let sessionToken: string = ''
  // PRODUCTION:REMOVE-NEXT-LINE
  while (
    sessionToken === '' || // PRODUCTION:REMOVE
    sessionToken === '111111' || // PRODUCTION:REMOVE
    sessionToken === '123456' || // PRODUCTION:REMOVE
    sessionToken === '999999' // PRODUCTION:REMOVE
    // PRODUCTION:REMOVE-NEXT-LINE
  ) {
    sessionToken = String(Math.floor(100000 + Math.random() * 900000))
    // PRODUCTION:REMOVE-NEXT-LINE
  }

  await writeOtpCode(sessionToken) // PRODUCTION:REMOVE

  return sessionToken
}
