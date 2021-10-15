const { Router } = require("express");

const { createObject, getObjects } = require("../controllers/objectController")

const router = Router();

router.get('/', getObjects)
router.post('/create', createObject)

module.exports = {
  objectRouter: router
}