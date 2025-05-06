import * as fs from 'fs'
import { setTimeout } from 'timers/promises'

import { OTP_FILE_PATH } from '../../src/constants'

/**
 * Reads the OTP code from the backend file, retries if not present, and clears the file after reading.
 * @param maxRetries - Maximum number of retries
 * @param retryDelay - Delay between retries in milliseconds
 * @param otpFilePath - Path to the OTP file (default: OTP_FILE_PATH)
 * @returns The OTP code as a string
 */
export async function readOtpCode(
  maxRetries = 10,
  retryDelay = 200,
  otpFilePath = OTP_FILE_PATH
): Promise<string> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      if (fs.existsSync(otpFilePath)) {
        const code = fs.readFileSync(otpFilePath, 'utf8').trim()
        if (code.length > 0) {
          // Clear the file after reading to avoid conflicts with other tests
          fs.writeFileSync(otpFilePath, '')
          return code
        }
      }
    } catch (e) {
      // Log error for debug purposes
      console.log(
        `Error reading OTP file (attempt ${attempt + 1}/${maxRetries}):`,
        e
      )
    }
    await setTimeout(retryDelay)
  }
  throw new Error(
    `Failed to read OTP code from ${otpFilePath} after ${maxRetries} attempts`
  )
}
