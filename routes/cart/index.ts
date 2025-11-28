const express = require("express");
const cartController = require("../../controller/cart.controller");
const {asyncHanlder}  = require("../../utils/index");
const {authencation} = require("../../utils/authUtils")

const router = express.Router();

router.get("" , asyncHanlder(cartController.listToCart))
router.delete("" , asyncHanlder(cartController.delete))

router.post("/update" ,  asyncHanlder(cartController.update))
router.post("" ,  asyncHanlder(cartController.addToCart))

module.exports = router