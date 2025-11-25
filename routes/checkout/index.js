const express = require("express");
const checkoutController = require("../../controller/checkout.controller");
const {asyncHanlder}  = require("../../utils/index");


const router = express.Router();

router.get("" , asyncHanlder(checkoutController.getDiscountAmount))

module.exports = router