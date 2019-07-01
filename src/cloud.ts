import { Storage } from '@google-cloud/storage'
import config from '../config.json';
import crypto from 'crypto'

class GoogleCloud {
  private bucket: any;
  
  constructor() {
    const storage = new Storage()
    this.bucket = storage.bucket(config.bucketName)
  }

  public async uploadJSON(data: any) {
    const filePath: string = this.generateFileName()
    const blob = this.bucket.file(filePath)
    
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: 'application/json',
        cacheControl: 2592000
      }
    })

    try {
      const result = await blobStream.end(JSON.stringify(data))
      return result
    } catch (e) {
      throw new Error(e)
    }
  }

  private generateFileName() {
    return crypto.randomBytes(16).toString('hex')
  }
}

export default GoogleCloud;