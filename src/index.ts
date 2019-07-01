import GoogleCloud from './cloud';
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan';
import debug from 'debug';

const port = 8080
const app = express()
const router = express.Router()

app.use(morgan("combined"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const googleCloud = new GoogleCloud();

router.post('/upload-json', async (req, res) => {
  const { uidl } = req.body
  if (uidl) {
    const result = await googleCloud.uploadJSON(uidl)
    console.log(result)
    return res.status(200).json({ message: 'JSON received' })
  } else {
    return res.status(400).json({ message: 'UIDL missing' })
  }
})

app.use('/', router);
app.listen(port, () => {
  debug(`App is running at port ${8080}`)
})

