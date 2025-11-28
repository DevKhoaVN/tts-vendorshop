const express = require("express");
const discountController = require("../../controller/discount.controller");
const {asyncHanlder}  = require("../../utils/index");
const {authencation} = require("../../utils/authUtils")

const router = express.Router();

router.post("/amount" , asyncHanlder(discountController.getDiscountAmount))
router.get("/list_product_code" , asyncHanlder(discountController.getAllDiscountCodeProduct))

router.post("" ,authencation,  asyncHanlder(discountController.createDiscountCode))
router.get("" ,authencation,  asyncHanlder(discountController.getAllDiscountCode))
router.delete("" ,authencation,  asyncHanlder(discountController.deleteDiscountCode))

module.exports = router