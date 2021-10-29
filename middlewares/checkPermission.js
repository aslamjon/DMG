
/* rules of users
    admin
    builder
    sales
    control
*/
function checkPermission(req, res, next) {
    const {rule} = req.user;
    // console.log(rule)
    if (rule == 'admin') {
    } else if (rule == 'builder') {
    } else if (rule == 'sales') {
    } else {
        res.send({ message: "You can not access here" })
    }
    // console.log(req.baseUrl);
    
    next()
}
function isAdmin(req, res, next) {
    const {rule} = req.user;
    // console.log(rule)
    if (rule == 'admin') {
    } else {
        res.send({ message: "You can not access here" })
    }    
    next()
}
module.exports = {
    checkPermission,
    isAdmin
}