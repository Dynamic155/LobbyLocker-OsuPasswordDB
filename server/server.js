import express from "express";
const app = express();

app.get("/passwords", (req, res) => {
    res.end("chuckle nuts")
})

app.listen(8989, () => {
    console.log("Api open on port 8989")
})