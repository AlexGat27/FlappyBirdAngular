const fs = require('fs')

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
}

module.exports = new GameController()