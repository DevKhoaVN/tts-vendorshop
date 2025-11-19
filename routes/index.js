const express = require("express");
const router = express.Router();

router.use("/api/v1" , require("./access"))
router.use("/api/v1/product" , require("./product"))

module.exports = router