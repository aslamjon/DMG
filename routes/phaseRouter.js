const { Router } = require("express");
const path = require("path");
const multer = require("multer");
const { createPhase, getPhases, getPhasesWithObject, getPhasById, getPhaseByIdWithObject, deletePhaseById, updatePhaseById } = require('../controllers/phaseController');

const router = Router();

// you might also want to set some limits: https://github.com/expressjs/multer#limits
const upload = multer({
    dest: path.join(__dirname, `./../data/cache`)
});
/* name attribute of <file> element in your form */
const nameOfFileFromFrontend = upload.any();

router.get('/', getPhases)
router.get('/withObject', getPhasesWithObject)
router.get('/:id', getPhasById)
router.get('/withObject/:id', getPhaseByIdWithObject)
// router.get('/:name', getPathByName)
router.post('/', nameOfFileFromFrontend, createPhase);
router.delete('/:id', deletePhaseById)
router.patch("/:id", updatePhaseById)

module.exports = {
    phaseRouter: router
}