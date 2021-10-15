// Requiring module
const express = require('express');
const path = require("path");
const app = express();
const cors = require('cors');

const { connectDb } = require("./services/db/db");
const { checkUser } = require("./middlewares/authMiddleware")

const { dataRouter } = require('./routes/dataRouter');
const {authRouter} = require('./routes/authRouter');
const { userRouter } = require("./routes/userRouter");
const { objectRouter } = require(("./routes/objectRouter"));

function crossss (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Methods", ["POST", "GET"] || "*");
    // res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}
app.use(cors());
require("dotenv").config();
app.use(express.urlencoded({extended: true}))
app.use(express.json({extended: true})) // if json come backend then it convert to obj in req.body


app.use('/api/data', express.static("./data/images"));
app.use('/api/data', checkUser, dataRouter);
app.use('/auth', authRouter)
// create user
app.use('/api/user', checkUser, userRouter);
app.use('api/object', checkUser, objectRouter)

// put the HTML file containing your form in a directory named "public" (relative to where this script is located)
app.use('/', express.static("./public"));
app.get("/", express.static(path.join(__dirname, "./public")));
// or using middilware app.use(express.static('public'));


const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, connectDb);