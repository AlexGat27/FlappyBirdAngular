const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
const keys = require('../config/keys')
const bcrypt = require("bcrypt")

class AuthController{
    async login(req, res){
        const { login, password } = req.body;
        const potentialUser = await userModel.getUserByUsername(login);
        if (!potentialUser){
            res.status(400).json({message: 'Пользователь не найден'})
        }
        const passwordMatch = await bcrypt.compare(password, potentialUser.password);
        if (passwordMatch) {
            const token = jwt.sign({
                id: potentialUser.id,
            }, keys.jwt, {expiresIn: 60 * 60 * 24});
            res.status(200).json({ 
                token: `Bearer ${token}`,
            });
        } else {
            res.status(401).json({ message: 'Неправильное имя пользователя или пароль' });
        }
    }
    async register(req, res){
        const { login, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);

        try {
            // Создаем нового пользователя
            await userModel.createUser(login, hashPassword);

            // Если пользователь успешно создан, отправляем ответ клиенту
            res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
        } catch (error) {
            // Если произошла ошибка при создании пользователя, отправляем ошибку клиенту
            console.error('Ошибка при регистрации пользователя:', error);
            res.status(500).json({ message: 'Произошла ошибка при регистрации пользователя' });
        }
    }

    async getUser(req, res){
        const jwtHeader = req.headers["authorisation"];
        const token = jwtHeader && jwtHeader.split(' ')[1];
        const data = jwt.verify(token, keys.jwt);
        console.log(data, keys.jwt)
        await userModel.getUserById(data.id).then(data => {
            res.json(data);
        }).catch(er => {
            console.log(er);
            res.status(404).json({error: er});
        })
    }
}

module.exports = new AuthController()