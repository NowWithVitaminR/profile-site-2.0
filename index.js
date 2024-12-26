import bodyParser from "body-parser";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
let DefaultPage = "index.ejs";

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// routes
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
  const folder = req.query.name; // Get the `name` query parameter

  if (!folder) {
    return res.status(400).send("Gallery name is required");
  }

  const imagesDir = path.join(__dirname, "public/images", folder);

  // Read the contents of the specified directory
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      return res.status(404).send("Gallery not found");
    }

    // Filter out only image files
    const images = files.filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file));

    // Render the gallery page and pass the images and folder name
    res.render(DefaultPage, { PageName: "gallery.ejs", images, folder });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
