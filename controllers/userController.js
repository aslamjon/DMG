const { UserModel } = require("../models/user.model");
const bcrypt = require("bcryptjs");

async function createUser(req, res) {
  const { username, password, rule } = req.body;

  const usernameExists = await UserModel.findOne({ username });
  if (usernameExists) {
    res.status(400).send({
      message: "Username is already exists",
    });
  } else {
    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));
    const newUser = new UserModel({
      username,
      rule,
      password: hashedPassword
    })
    try {
      await newUser.save();
      res.status(200).send({
        message: 'User has been created'
      })
    } catch (error) {
      throw error;
    }
  }
}

module.exports = {
  createUser
}