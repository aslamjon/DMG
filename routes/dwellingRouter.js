const { Router } = require("express");
const path = require("path");
const multer = require("multer");

const { createDwelling, getDwelling, getDwellingById, deleteDwellingById, updatePhaseById } = require('../controllers/dwellingController')


const router = Router();

// you might also want to set some limits: https://github.com/expressjs/multer#limits
const upload = multer({
    dest: path.join(__dirname, `./../data/cache`)
});
/* name attribute of <file> element in your form */
const nameOfFileFromFrontend = upload.any();

router.get('/', getDwelling)
// router.get('/withObject', getPhasesWithObject)
router.get('/:id', getDwellingById)
// router.get('/withObject/:id', getPhaseByIdWithObject)
// // router.get('/:name', getPathByName)
router.post('/', nameOfFileFromFrontend, createDwelling);
router.delete('/:id', deleteDwellingById)
router.patch("/:id", updatePhaseById)

module.exports = {
    dwellingRouter: router
}