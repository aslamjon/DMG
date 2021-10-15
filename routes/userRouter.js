const { Router } = require("express");

const { createUser } = require("../controllers/userController");

const router = Router();

router.post('/create', createUser)

module.exports = {
  userRouter: router
}