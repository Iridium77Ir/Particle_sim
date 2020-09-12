const express = require("express")
const app = express()
var path = require("path")

app.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"))
})

app.get("/:num", async (req, res) => {
    res.sendFile(path.join(__dirname + "/" + req.params.num + "/index.html"))
})
app.get("/:num/artJs.js", async (req, res) => {
    res.sendFile(path.join(__dirname + "/" + req.params.num + "/artJs.js"))
})

app.listen(3009)