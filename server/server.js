import express from "express";
import fs from "fs";
const app = express();
const __dirname = import.meta.dirname;
const dbPath = `${__dirname}/../db/osu.json`

app.get("/passwords", (req, res) => {
    fs.readFile(dbPath, 'utf8', (err, data) => {
        try {
            res.end(JSON.stringify(JSON.parse(data)))
        } catch (error) {
            res.end("Sorry, failed to fetch")
        }
    })
})

app.listen(8989, () => {
    console.log("Api open on port 8989")
})