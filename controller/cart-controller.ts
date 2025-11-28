const { CREATED, OK } = require("../core/sucess.response")
const CartService = require ("../service/cart.service")
class CartController{
    addToCart = async (req, res, next) => {
        
        new CREATED({
            message: "add product to cart success",
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    update = async (req, res, next) => {
        new OK({
            message: "get all  discount code success",
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }

    delete = async (req, res, next) => {
        new OK({
            message: "delete product  success",
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res)
    }

    listToCart = async (req, res, next) => {
        new OK({
            message: "get list cart success",
            metadata: await CartService.getListUserCart(req.body)
        }).send(res)
    }


}

module.exports = new CartController