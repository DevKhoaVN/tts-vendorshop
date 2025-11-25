const express = require("express");
const commetController = require("../../controller/comment.controller");
const {asyncHanlder}  = require("../../utils/index");
const {authencation} = require("../../utils/authUtils")

const router = express.Router();

router.get("" , asyncHanlder(commetController.getComments))
router.post("" ,authencation, asyncHanlder(commetController.createComment))



module.exports = router