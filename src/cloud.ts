import { Storage } from "@google-cloud/storage";
import { config } from "./config";
import { CACHE_CONTROL, APPLICATION_TYPE } from "./constants";

class GoogleCloud {
  private bucket: any;

  constructor() {
    const storage = new Storage();
    this.bucket = storage.bucket(config.bucketName);
  }

  public async fetchUIDL(fileName: string) {
    const file = this.bucket.file(fileName);
    try {
      const exists = await file.exists();
      if (!exists[0]) {
        return;
      }
      const content = await file.download();
      return JSON.parse(content);
    } catch (e) {
      console.error(e);
      throw Error("Something went wrong");
    }
  }

  public async uploadUIDL(uidl: any, fileName: string) {
    try {
      const file = this.bucket.file(fileName);

      const bufferStream = Buffer.from(JSON.stringify(uidl));
      await file.save(bufferStream, {
        metadata: {
          contentType: APPLICATION_TYPE,
          cacheControl: CACHE_CONTROL
        }
      });
      return file;
    } catch (e) {
      console.error(e);
      throw Error("Something went wrong");
    }
  }
}

export default GoogleCloud;
