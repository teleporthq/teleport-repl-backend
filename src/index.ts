import express from "express";
import bodyParser from "body-parser";
import GoogleCloud from "./cloud";
import { getFileName } from "./helper";

const port = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const googleCloud = new GoogleCloud();

app.post("/upload-uidl", async (req, res) => {
  const { uidl } = req.body;
  if (!uidl) {
    return res.status(400).json({ message: "UIDL missing from the request" });
  }

  const fileName = getFileName();
  try {
    await googleCloud.uploadUIDL(uidl, fileName);
    return res
      .status(200)
      .json({ message: "UIDL saved successfully", fileName });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Failed in saving UIDL" });
  }
});

app.get("/fetch-uidl/:fileName", async (req, res) => {
  const { fileName } = req.params;
  if (!fileName) {
    return res
      .status(400)
      .json({ message: "Filename is missing from the request" });
  }

  try {
    const uidl = await googleCloud.fetchUIDL(fileName);
    if (!uidl) {
      return res.status(404).json({ message: "File not found" });
    }
    return res.status(200).json({ uidl });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Failed in fetching UIDL" });
  }
});

app.get("/", async (req, res) => res.send("REPL API server"));

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server running on ${port}`);
  });
}

export { app };
