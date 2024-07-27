import express from "express";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = `${__dirname}/db/osu.json`;
const counterPath = `${__dirname}/db/visitcount.json`;

let count = 0;
let lastStarUser = null;
let lastWatchUser = null;
let lastPushMessage = null;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

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

        if (!err && data) {
            count = Number(data);
        } else if (!err && !data) {
            console.log('File is empty');
            return res.send(err)
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

app.use(express.json());
app.post("/git-webhook", (req, res) => {
    const eventType = req.headers["x-github-event"];
    const payload = req.body;

    if (payload && payload.repository && payload.repository.owner) {
        if (eventType === 'star') {
            lastStarUser = payload.repository.owner.login;
        } else if (eventType === 'watch') {
            lastWatchUser = payload.repository.owner.login;
        }
    }

    if (eventType === 'push' && payload && payload.head_commit) {
        lastPushMessage = payload.head_commit.message;
    }

    console.log(`Most Recent Star: ${lastStarUser}`);
    console.log(`Most Recent Watcher: ${lastWatchUser}`);
    console.log(`Most Recent Push: ${lastPushMessage}`);

    res.status(200).end();
});

app.get("/last-payload", (req, res) => {
    res.send({
        MostRecentStar: lastStarUser,
        MostRecentWatcher: lastWatchUser,
        MostRecentPush: lastPushMessage
    });
});

app.listen(8989, () => {
    console.log("API Enabled <3")
})