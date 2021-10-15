const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')

const { UserModel } = require("../models/user.model");

async function login(req, res) {
    const secret = process.env.SALT;
    const { username, password } = req.body;
    
    try {
        const user = await UserModel.findOne({username});
        
        if (!user) {
            res.status(400).send({ message: "Login is incorrect" });
        }
        
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(400).send({ message: "Password is incorrect" });
        }

        const token = jwt.sign({ userId: user.id, username: username, role: user.role }, secret, {
            expiresIn: "1d",
        });
        /* 
            jwt.sign -> create token
            secret -> secret for virify
            expiresIn: "1d"  -> token live 1 day. 
        */ 
        res.status(200).send({
            token: token,
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    login,
};

// 1. Find User by username
// 2. if it exists, compare password with database
// 3. if comparison is successfull, access granted and generate jwt
