const { Router } = require("express");
const path = require("path");
const multer = require("multer");

const {
    createApartment,
    getApartments,
    getApartmentById,
    deleteApartmentById,
    updateApartmentById
} = require('../controllers/apartmentController')


const router = Router();

// you might also want to set some limits: https://github.com/expressjs/multer#limits
const upload = multer({
    dest: path.join(__dirname, `./../data/cache`)
});
/* name attribute of <file> element in your form */
const nameOfFileFromFrontend = upload.any();

router.get('/', getApartments)
// router.get('/withObject', getPhasesWithObject)
router.get('/:id', getApartmentById)
// router.get('/withObject/:id', getPhaseByIdWithObject)
// // router.get('/:name', getPathByName)
router.post('/', nameOfFileFromFrontend, createApartment);
router.delete('/:id', deleteApartmentById)
router.patch("/:id", updateApartmentById)

module.exports = {
    apartmentRouter: router
}