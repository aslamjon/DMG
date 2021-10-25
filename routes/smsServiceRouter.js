const { Router } = require("express");

const { saveUrl, getUrl } = require('../controllers/smsServiceController');

const router = Router();

router.get('/', getUrl)
router.post('/', saveUrl)


module.exports = {
    smsRouter: router
}