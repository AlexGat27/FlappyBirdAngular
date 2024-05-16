const controller = require('../controllers/authController')
const authMiddleware = require('../middlewares/middlewares')
const express = require('express')
const router = express.Router()

router.post('/login', controller.login);
router.post('/register', controller.register);
router.get('/getUser', authMiddleware, controller.getUser);


module.exports = router