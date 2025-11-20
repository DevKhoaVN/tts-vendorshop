const { BadRequestError, NotFoundError } = require("../core/error.response")
const {product , electronic , clothing} = require("../model/product.model")
const {findAllDraftsForShop, publishProductByShop, queryProduct, unPublishProductByShop, searchProduct, findAllProducts, findProduct} = require("../model/repository/product.repo")
const { removeUndefineValueInObject } = require("../utils")

//define factory class to create product

class ProductFactory{
    /*
       type: Clothing , Electronic
       payoad
    */
    static createProductClass(type, payload){
         switch(type){
            case "Clothing":
                return new Clothing(payload)

            case "Electronic":
                return new Electronics(payload)

            default: 
                 throw new BadRequestError("Invalid type product: ",type)
         }
    }

     static async createProduct(type, payload){
         const productClass = this.createProductClass(type, payload)
         console.log("class : " ,productClass)
         return await productClass.createProduct()
    }
    //query

    static async findAllDraftsForShop({product_shop , limit= 50 , skip = 0}){
        const query = {product_shop , isDraft: true}
        return await queryProduct({query , limit, skip })
    }

     static async findAllPublishForShop({product_shop , limit= 50 , skip = 0}){
        const query = {product_shop , isPublihed: true}
        return await queryProduct({query , limit, skip })
    }

    static async publishProductByShop({product_shop , product_id}){
        return await publishProductByShop({product_shop, product_id})
    }

    static async unPublishProductByShop({product_shop , product_id}){
        return await unPublishProductByShop({product_shop, product_id})
    }
    static async searchProducts({keySearch}) {
        return await searchProduct({keySearch})
    }
    static async findProduct({product_id}){
       return await findProduct({product_id , unSelect: ['__v']})
    }

    static async findAllProducts({limit = 3 , sort = 'ctime', page = 1, filter = {isPublihed: true}} = {}){
        console.log("linit :", limit)
        return await findAllProducts({limit, sort, page, filter, select: [
            'product_name' , 'product_thumb', 'product_price', 'product_ratingAverage' 
        ]})
    }

    static async updateProduct({type, payload, productId}){
       const productClass =  this.createProductClass(type, payload)

       return await productClass.updateProduct(productId)
    }
}

//     product_name
//     product_thumb
//     prouduct_description 
//     prouduct_price
//     prouduct_quantity
//     prouduct_type
//     product_shop
//     product_attributes

class Product{
    constructor({ 
        product_name,  product_thumb, product_description, product_price,
        product_quantity, product_type, product_shop, product_attributes
    }){
        this.product_name = product_name,
        this.product_thumb = product_thumb,
        this.product_description = product_description,
        this.product_price = product_price,
        this.product_quantity = product_quantity,
        this.product_type = product_type,
        this.product_shop = product_shop,
        this.product_attributes = product_attributes
    }

    async createProduct(product_id){
        return await product.create({...this, _id: product_id})
    }   

    async updateProduct(productId, bodyUpdate){
        return await product.findByIdAndUpdate(productId, bodyUpdate, {
            new: true
        })
    }
}

class Clothing extends Product{
    async createProduct(){
        const newClothing = await clothing.create({
            ...this.product_attributes , product_shop: this.product_shop
        })
        if(!newClothing) throw new BadRequestError("create new clothing error")

        const newProduct = await super.createProduct(newClothing._id);
        if(!newProduct) throw new BadRequestError("create new product error")

        return newProduct
    }

    async updateProduct(productId){
        const objectParams  = removeUndefineValueInObject(this)


        if(objectParams.product_attributes){
            //update child
            await clothing.findByIdAndUpdate(
                productId,
                { $set: objectParams.product_attributes },
                { new: true }
            )
        }

        const updateProduct = await super.updateProduct(productId, objectParams)
        return updateProduct
    }
}

class Electronics extends Product{
    async createProduct(){
        const newElectronic = await electronic.create(this.product_attributes)
        if(!newElectronic) throw new BadRequestError("create new electronic error")

        const newProduct = await super.createProduct();
        if(!newProduct) throw new BadRequestError("create new product error")

        return newProduct
    }
}

module.exports = ProductFactory