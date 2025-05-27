export const generateToken = async () => {
  // Generate a random 6-digit code not starting with zero
  let sessionToken: string = ''
    sessionToken = String(Math.floor(100_000 + Math.random() * 900_000))

  return sessionToken
}
