const express = require("express");
const productController = require("../../controller/product.controller");
const {asyncHanlder}  = require("../../utils/index");
const { authencation } = require("../../utils/authUtils");

const router = express.Router();
router.get("/search/:keySearch", asyncHanlder(productController.getListSearchProducts))
router.get("", asyncHanlder(productController.findAllProducts))
router.get("/:product_id", asyncHanlder(productController.findProduct))

router.post("/create" ,authencation, asyncHanlder(productController.createProduct))
router.patch("/:productId" ,authencation, asyncHanlder(productController.updateProduct))
router.post("/publish/:id" ,authencation,  asyncHanlder(productController.publishProductByShop))
router.post('/unpublished/:id',authencation,  asyncHanlder(productController.unPublishProductByShop))
router.get('/drafts/all',authencation,  asyncHanlder(productController.getAllDraftsForShop))
router.get('/published/all',authencation,  asyncHanlder(productController.getAllPublishForShop))


module.exports = router