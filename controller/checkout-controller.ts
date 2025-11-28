const { OK } = require("../core/sucess.response")
const CheckoutService = require ("../service/checkout.service")
class CheckoutController{
    addToCart = async (req, res, next) => {
        
        new OK({
            message: "add product to cart success",
            metadata: await CheckoutService.checkoutReview(req.body)
        }).send(res)
    }

}

module.exports = new CheckoutController