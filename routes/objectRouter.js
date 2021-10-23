const { Router } = require("express");
const path = require("path");
const multer = require("multer");

const { createObject, getObjects, getObjectById, updateObjectById, deleteObjectById } = require("../controllers/objectController")

const router = Router();

// you might also want to set some limits: https://github.com/expressjs/multer#limits
const upload = multer({
    dest: path.join(__dirname, `./../data/cache`)
});
/* name attribute of <file> element in your form */
const nameOfFileFromFrontend = upload.any();

router.get('/', getObjects)
router.get('/:id', getObjectById)
router.post('/', nameOfFileFromFrontend, createObject)
router.patch('/:id', updateObjectById)
router.delete('/:id', deleteObjectById)

module.exports = {
  objectRouter: router
}