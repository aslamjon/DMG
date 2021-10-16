const { Router } = require("express");
const { 
    createPath,
    getPaths,
    getPathByName,
    deletePathById } = require('../controllers/pathController');

const router = Router();

router.get('/', getPaths)
router.get('/:name', getPathByName)
router.post('/', createPath)
// router.patch('/:id', updateObjectById)
router.delete('/:id', deletePathById)

module.exports = {
    pathRouter: router
}