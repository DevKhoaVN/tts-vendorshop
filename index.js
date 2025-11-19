require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require ("helmet");
const compression = require("compression");
const app = express();

const PORT = 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());  
app.use(compression())  ;

//inti db
require("./database/init.db.js");

//init route
app.use('/' , require("./routes"));

app.use((req, res, next) => {
    const error = new Error("Not Found")
    error.status = 404
    next(error)
})
app.use((error, req, res, next) => {
    const status = error.status || 500
    res.status(status).json({
        status: "error",
        code: status ,
        message: error.message || "Internal Server Error"
    })
})
app.listen(PORT,()=> {
    console.log("server running");
})