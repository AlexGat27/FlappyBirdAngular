const fs = require('fs')
const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
const keys = require('../config/keys')

class GameController{
    getAllGames(req, res){
        console.log("Я вызвался")
        fs.readFile('./models/games.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Ошибка сервера');
            }
            const games = JSON.parse(data);
            return res.json(games);
        });
    }

    async saveRecord(req, res){
        const {scoreName, value} = req.body;
        const jwtHeader = req.headers["authorisation"];
        const token = jwtHeader && jwtHeader.split(' ')[1];
        const data = jwt.verify(token, keys.jwt);
        await userModel.setRecord(scoreName, value, data.id).then(message => {
            res.json({message: message})
        }).catch(er => {
            console.log(er);
            res.status(400).json({error: er});
        })
    }
}

module.exports = new GameController()