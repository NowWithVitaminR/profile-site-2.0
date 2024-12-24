import bodyParser from "body-parser";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express();
const port = 3000;
let DefaultPage = "index.ejs";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.render(DefaultPage, { PageName: "landing.ejs" });
});

app.get("/about", (req, res) => { 
  res.render(DefaultPage, { PageName: "about.ejs" });
});

app.get("/contact", (req, res) => {
  res.render(DefaultPage, { PageName: "contact.ejs" });
});

app.get("/gallery", (req, res) => {
  res.render(DefaultPage, { PageName: "gallery.ejs" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});