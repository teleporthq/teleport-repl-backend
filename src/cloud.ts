import { Storage } from '@google-cloud/storage'
import config from '../config.json'
import { APPLICATION_TYPE, CACHE_CONTROL } from './constants'
import { UIDLUploadResponse } from './types'

class GoogleCloud {
  private bucket: any;
  
  constructor() {
    const storage = new Storage()
    this.bucket = storage.bucket(config.bucketName)
  }

  public async fetchUIDL(fileName: string) {
    const file = this.bucket.file(fileName)
    
    return new Promise(async (resolve, reject) => {
      try {
        const exists = await file.exists()
        if (exists) {
          try {
            const content = await file.download()
            return resolve(content.toString())
          } catch(e) {
            return reject(e)
          }
        } 
      } catch(e) {
        return reject(e)
      }
    })
  }

  public async uploadUIDL(uidl: any, fileName: string) {
    const blob = this.bucket.file(fileName)

    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: APPLICATION_TYPE,
        cacheControl: CACHE_CONTROL
      }
    })
    
    return new Promise<UIDLUploadResponse>((resolve, reject) => {
      blobStream.end(uidl)

      blobStream
        .on('finish', async () => {
          await blob.makePublic()

          const result: any = {
            fileName,
          }
          return resolve(result)
        })
        .on('error', (error) => {
          console.error(error)
          return reject(error)
        })
    })
  }
}

export default GoogleCloud;