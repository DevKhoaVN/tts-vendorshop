/*
  add product to cart
  reduce product quantity by one
  inc roduct quantity
  get cart
  delete cart
  delete cart item
*/

const { compare } = require("bcryptjs")
const { BadRequestError, NotFoundError } = require("../core/error.response")
const { cart } = require("../model/cart.model")
const { findProductById } = require("../model/repository/product.repo")
const { findModelExist } = require("../utils")
const { product } = require("../model/product.model")

class CartService {
    static async createCart({userId , products}){
        const filter = {cart_userId: userId, cart_state: 'active'},
        updateOrInsert = {
            $addToSet: {
                cart_products: products
            }
        }, options = {upsert: true, new: true}

        return await cart.findOneAndUpdate(filter, updateOrInsert, options)

    }

    static async addToCart({userId , product}){
        const findCart = await findModelExist({model: cart , filter: {cart_userId: userId}})
        if(!findCart){
            //create cart
            return await this.createCart({userId, product})
        }

        if(!findCart.cart_products.length){
            findCart.cart_products = [product]
            return await findCart.save()
        } 
        // if cart exist and have product
        return await this.updateUserCartQuantity({userId, product})
    }

    static async updateUserCartQuantity({userId, product}){
       const {productId, quantity} = product
  
       const  filter  = {
            cart_userId: userId,
            cart_state: 'active',
           "cart_products.productId": productId
       }, updateSet = {
         $inc: {
            "cart_products.quantity": quantity
         }
       },options = {upsert: true , new: true}

       console.log("i hamerrrrrrrr")
       // product exist so update it
         return await cart.findOneAndUpdate(filter, updateSet, options)    
    }

    static async getListUserCart ({userId}){
        return await cart.findOne({cart_userId: userId, cart_state: 'active'}).lean()
    }

    //update card
    /*
     shop_order_ids:[
       {
          shopId,
          item_products: [
             {
                product_id
                quantity,
                price,
                shopId,
                old_quanity,
           }]
       }
     ]
    */
    static async addToCartV2({userId, item_products = []}){
        const {productId, quantity, old_quantity} = item_products[0]
        console.log({productId, quantity, old_quantity})
        //check product
        const foundProduct = await findProductById(productId)
        if(!foundProduct) throw new NotFoundError('Not found product')

        if(quantity === 0){
           // deleted
           return await this.deleteUserCart({userId, productId})
        }

        return await this.updateUserCartQuantity({
            userId, product:{
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    static async deleteUserCart({userId, productId}){
        const filter = { cart_userId: userId, cart_state: 'active'},
        updateSet = {
            $pull: {
                cart_products: {
                   productId
                }
            }
        }

        const  deleteCart =  await cart.updateOne(filter,updateSet)
        return deleteCart
    }
}

module.exports = CartService