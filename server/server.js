import express from "express";
import fs from "fs";
const app = express();
const __dirname = import.meta.dirname;
const dbPath = `${__dirname}/../db/osu.json`
const counterPath = `${__dirname}/../db/visitcount.json`;

app.get("/passwords", (req, res) => {
    fs.readFile(dbPath, 'utf8', (err, data) => {
        try {
            res.end(JSON.stringify(JSON.parse(data)))
        } catch (error) {
            res.end("Sorry, failed to fetch")
        }
    })
})

app.get("/visit", (req, res) => {
    fs.readFile(counterPath, 'utf8', (err, data) => {
        let count = 0;
        if (!err && data) {
            count = Number(data);
        }
        count++;
        fs.writeFile(counterPath, count.toString(), err => {
            if (err) {
                console.log('Error writing file :3', err);
            } else {
                console.log(`Count incremented to ${count} <3`);
            }
        });
        res.send({ count: count });
    });
});

app.listen(8989, () => {
    console.log("Api open on port 8989")
})