import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express();
const port = 3000;

app.get("/", (req,res) => {
    console.log(__dirname + "/index.html");
    res.sendFile(__dirname + "/index.html");
});

app.listen(3000, () => {
    console.log(`Server running on port ${port}.`);
});
