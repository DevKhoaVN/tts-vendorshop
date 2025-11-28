const express = require("express");
const inventoryController = require("../../controller/inventory.controller");
const {asyncHanlder}  = require("../../utils/index");
const {authencation} = require("../../utils/authUtils")

const router = express.Router();

router.post("" , asyncHanlder(inventoryController.addStockToInventory))


module.exports = router