const { CREATED, OK } = require("../core/sucess.response")
const DiscountService = require ("../service/discount.service")
class DiscountController{
    createDiscountCode = async (req, res, next) => {
        
        new CREATED({
            message: "create discount code success",
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCode = async (req, res, next) => {
        console.log("query : " ,  { ...req.query})
        new OK({
            message: "get all  discount code success",
            metadata: await DiscountService.getAllDiscountCodeByShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCodeProduct = async (req, res, next) => {
        new OK({
            message: "get all  discount code  with product success",
            metadata: await DiscountService.getAllDiscountWithProduct({
                ...req.query,
                ...req.body
            })
        }).send(res)
    }

    deleteDiscountCode = async (req, res, next) => {
        new OK({
            message: "delete  discount code success",
            metadata: await DiscountService.deleteDiscountCode({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getDiscountAmount = async (req, res, next) => {
        new OK({
            message: "delete  discount code success",
            metadata: await DiscountService.getDiscountAmount(req.body)
        }).send(res)
    }

    
}

module.exports = new DiscountController