const express = require('express')
const controller = require('../controllers/gamesController')
const router = express.Router()

router.get('/getGames', controller.getAllGames);

module.exports = router