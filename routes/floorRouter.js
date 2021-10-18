const { Router } = require("express");
const path = require("path");
const multer = require("multer");

const {
    createFloor,
    getFloors,
    getFloorById,
    deleteFloorById,
    updateFloorById
} = require('../controllers/floorController')


const router = Router();

// you might also want to set some limits: https://github.com/expressjs/multer#limits
const upload = multer({
    dest: path.join(__dirname, `./../data/cache`)
});
/* name attribute of <file> element in your form */
const nameOfFileFromFrontend = upload.any();

router.get('/', getFloors)
// router.get('/withObject', getPhasesWithObject)
router.get('/:id', getFloorById)
// router.get('/withObject/:id', getPhaseByIdWithObject)
// // router.get('/:name', getPathByName)
router.post('/', nameOfFileFromFrontend, createFloor);
router.delete('/:id', deleteFloorById)
router.patch("/:id", updateFloorById)

module.exports = {
    floorRouter: router
}