const controller = require('../controllers/gamesController')
const express = require('express')
const router = express.Router()

router.get('/getGames', controller.getAllGames);

module.exports = router