// Requiring module
const express = require('express');
const path = require("path");
const app = express();
const cors = require('cors');

const { connectDb } = require("./services/db/db");
const { checkUser } = require("./middlewares/authMiddleware")
const { checkPermission, isAdmin } = require('./middlewares/checkPermission');

const { dataRouter } = require('./routes/dataRouter');
const {authRouter} = require('./routes/authRouter');
const { userRouter } = require("./routes/userRouter");
const { objectRouter } = require(("./routes/objectRouter"));
const { pathRouter } = require(("./routes/pathRouter"));
const { phaseRouter } = require("./routes/phaseRouter")
const { dwellingRouter } = require("./routes/dwellingRouter");
const { floorRouter } = require('./routes/floorRouter');
const { apartmentRouter } = require('./routes/apartmentRouter');
const { smsRouter } = require('./routes/smsServiceRouter');

// function crossss (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     // res.header("Access-Control-Allow-Methods", ["POST", "GET"] || "*");
//     // res.header("Access-Control-Allow-Headers", "Content-Type");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// }
app.use(cors());
require("dotenv").config();
app.use(express.urlencoded({extended: true}))
app.use(express.json({extended: true})) // if json come backend then it convert to obj in req.body


app.use('/api/data', express.static("./data/images"));
app.use('/api/data', checkUser, dataRouter);
// login | /auth/login
app.use('/auth', authRouter)
// create user | /api/user/create
app.use('/api/user', checkUser, userRouter);
app.use('/api/object', checkUser, checkPermission, objectRouter)
app.use('/api/path', checkUser, checkPermission, pathRouter)
app.use('/api/phases', checkUser, phaseRouter);
app.use('/api/dwelling', checkUser, dwellingRouter);
app.use('/api/floor', checkUser, floorRouter);
app.use('/api/apartment', checkUser, apartmentRouter);
app.use('/api/sms', smsRouter);

// put the HTML file containing your form in a directory named "public" (relative to where this script is located)
app.use('/', express.static("./public"));
app.get("/", express.static(path.join(__dirname, "./public")));
// or using middilware app.use(express.static('public'));

// Error handle
app.use(function(err, req, res, next) {
    // console.log("[Global error middleware]", err.message);
    res.status(500).send({
        message: err.message
    })
    next();
})


const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, connectDb);