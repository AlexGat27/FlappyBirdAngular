const authMiddleware = (req, res, next) => {
    const jwtHeader = req.headers["authorisation"];
    const token = jwtHeader && jwtHeader.split(' ')[1];
    if (token == null || token === undefined) return res.sendStatus(401).json({message: "Пользователь не авторизован"});
    next();
}

module.exports = authMiddleware