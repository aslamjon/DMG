const { Router } = require("express");
const path = require("path");
const multer = require("multer");

const { createObject, getObjects, getObjectById, deleteObjectById } = require("../controllers/objectController")

const router = Router();

// you might also want to set some limits: https://github.com/expressjs/multer#limits
const upload = multer({
    dest: path.join(__dirname, `./../data/cache`)
});
const nameOfFileFromFrontend = upload.single("file");

router.get('/', getObjects)
router.get('/:id', getObjectById)
/* name attribute of <file> element in your form */
router.post('/create', nameOfFileFromFrontend, createObject)
router.post('/delete/:id')

module.exports = {
  objectRouter: router
}