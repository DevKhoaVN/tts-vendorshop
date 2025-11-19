const express = require("express");
const productController = require("../../controller/product.controller");
const {asyncHanlder}  = require("../../utils/index");

const router = express.Router();

router.post("/create" , asyncHanlder(productController.createProduct))

module.exports = router