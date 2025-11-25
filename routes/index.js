const express = require("express");
const router = express.Router();


router.use("/api/v1/comment", require("./comment"))
router.use("/api/v1/invnetory", require("./inventory"))
router.use("/api/v1/checkout", require("./checkout"))
router.use("/api/v1/cart", require("./cart"))
router.use("/api/v1/discount", require("./discount"))
router.use("/api/v1/product" , require("./product"))
router.use("/api/v1" , require("./access"))




module.exports = router