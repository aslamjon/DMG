

function checkPermission(req, res, next) {
    const {rule} = req.user;
    // console.log(rule)
    if (rule == 'admin') {
    } else if (rule == 'builder') {
    } else {
        res.send({ message: "You can not access in URL" })
    }
    // console.log(req.baseUrl);
    
    next()
}
module.exports = {
    checkPermission
}