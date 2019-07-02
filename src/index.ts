import GoogleCloud from './cloud';
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { getFileName } from './helper'

const port = 8080
const app = express()
const router = express.Router()

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(morgan("combined", { stream: accessLogStream }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const googleCloud = new GoogleCloud();

router.post('/upload-json', async (req, res) => {
  const { uidl } = req.body
  if (uidl) {
    const fileName = getFileName()
    try {
      const response = await googleCloud.uploadUIDL(uidl, fileName)
      return res.status(200).json({ message: 'UIDL Saved Successfully', ...response })
    } catch (e) {
      return res.status(500).json({ message: 'Failed in Saving UIDL' })
    }
  } else {
    return res.status(400).json({ message: 'UIDL missing from the request' })
  }
})

app.use('/', router);
app.listen(port, () => {
  console.log('Server running succesfully')
})

