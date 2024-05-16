const sqlite3 = require('sqlite3').verbose();
require('dotenv').config()

// Класс для работы с пользователями
class UserModel {
    constructor() {
        this.db = new sqlite3.Database(process.env.DB_PATH);
        this.initUserTable();
    }

    // Метод для создания таблицы пользователей, если она не существует
    initUserTable() {
        this.db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            flappyScore INTEGER DEFAULT 0,
            arkanoidScore INTEGER DEFAULT 0,
            nupogodiScore INTEGER DEFAULT 0
        )`);
    }

    // Метод для создания нового пользователя
    async createUser(username, password) {
        return new Promise((resolve, reject) => {
            this.db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(`Пользователь ${username} успешно добавлен в БД`)
                    resolve({ id: this.lastID });
                }
            });
        })
    }

    // Метод для получения всех пользователей
    async getAllUsers() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM users', function(err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async getUserByUsername(username) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM users WHERE username == ?',
             [username], function(err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    async getUserById(id) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT username, flappyScore, arkanoidScore, nupogodiScore FROM users WHERE id == ?',
             [id], function(err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    async setRecord(scoreName, value, id){
        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE users SET '${scoreName}' = '${value}' WHERE id = '${id}'`, (er) =>{
                if (er) {reject(er)}
                else { resolve("Рекорд успешно сохранен") }
            })
        })
    }

}

module.exports = new UserModel();