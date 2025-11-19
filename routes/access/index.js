const express = require("express");
const accessController = require("../../controller/access.controller");
const {asyncHanlder}  = require("../../utils/index");
const { authencation } = require("../../utils/authUtils");
const router = express.Router();

router.post("/shop/signup" , asyncHanlder(accessController.signup))
router.post("/shop/login" , asyncHanlder(accessController.login))
// authenction
router.use(authencation)

router.post("/shop/logout" , asyncHanlder(accessController.logout))
router.post("/shop/handleRefreshToken" , asyncHanlder(accessController.handleRefreshToken))

module.exports = router