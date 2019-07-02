import crypto from 'crypto'

export const getFileName = () => {
  return crypto.randomBytes(16).toString('hex')
}