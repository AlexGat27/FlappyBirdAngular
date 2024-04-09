const express = require("express")
const bodyParser = require("body-parser")
const gameRouter = require("./routes/gameRouter")

app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('/api/v1/game', gameRouter)

const port = 3000;
const hostname = '0.0.0.0'

app.listen(port, hostname, () => {console.log("Server has been started");})