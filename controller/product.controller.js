const ProductService = require("../service/product.service")
const {OK , CREATED} = require("../core/sucess.response")

class ProductController{
    createProduct = async (req, res, next) => {
        console.log("body: " , req.body)
        new CREATED({
            message: "Created product success",
            metadata: await ProductService.createProduct(req.body.type ,{
                ...req.body.payload ,
                product_shop: req.user.userId
            })
        }).send(res)
    }
}

module.exports = new ProductController