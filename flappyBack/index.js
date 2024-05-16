const express = require("express")
const bodyParser = require("body-parser")
const gameRouter = require("./routes/gameRouter")
const authRouter = require("./routes/authRouter")

app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('/api/v1/game', gameRouter)
app.use('/api/v1/auth', authRouter)

const port = 3000;
const hostname = '0.0.0.0'

app.listen(port, hostname, () => {console.log("Server has been started");})