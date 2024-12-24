import bodyParser from "body-parser";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('public'));

app.get("/", (req,res) => {
    console.log(__dirname + "/public/index.ejs");
    res.render(__dirname + "/public/index.ejs");
});

app.listen(3000, () => {
    console.log(`Server running on port ${port}.`);
});
