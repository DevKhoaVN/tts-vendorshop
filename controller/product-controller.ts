const ProductService = require("../service/product.service")
const {OK , CREATED} = require("../core/sucess.response")
const { product } = require("../model/product.model")

class ProductController{

    updateProduct = async (req, res, next) => {
           console.log("body: " , req.body)
        new OK({
            message: "updateProduct success",
            metadata: await ProductService.updateProduct({
                type: req.body.type ,
                payload: req.body.payload ,
                productId: req.params.productId
            })
        }).send(res)
    }

    createProduct = async (req, res, next) => {
     
        new CREATED({
            message: "Created product success",
            metadata: await ProductService.createProduct(req.body.type ,{
                ...req.body.payload ,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getAllDraftsForShop = async (req, res, next) => {
        new OK({
            message: "Get list Draft success",
            metadata: await ProductService.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }
    getAllPublishForShop = async (req, res, next) => {
        new OK({
            message:" Get list Publish success",
            metadata: await ProductService.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {

        new OK({
            message: `Public product id ${req.params.id} success` ,
            metadata: await ProductService.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res)
    }

    unPublishProductByShop = async (req, res, next) => {

        new OK({
            message: `Un Public product id ${req.params.id} success` ,
            metadata: await ProductService.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res)
    }

    getListSearchProducts = async (req, res, next) => {
        new OK({
            message: `searchProducts success` ,
            metadata: await ProductService.searchProducts(req.params)
        }).send(res)
    }

    findAllProducts = async (req, res, next) => {
        new OK({
            message: `findAllProducts success` ,
            metadata: await ProductService.findAllProducts()
        }).send(res)
    }

    findProduct = async (req, res, next) => {
        new OK({
            message: `findProduct success` ,
            metadata: await ProductService.findProduct({
                product_id: req.params.product_id
            })
        }).send(res)
    }
}

module.exports = new ProductController