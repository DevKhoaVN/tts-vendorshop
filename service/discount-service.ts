/*
   Discount service
   1 - generate discount code [Shop | Admin]
   2 - get discount amount [User]
   3 - get all discount [User | Shop]
   4 - verify discount code [User]
   5 - delete discount code [Shop | Admin]
   6 - cancel discount code [User]
*/

const { BadRequestError } = require("../core/error.response")
const discountModel = require("../model/discount.model")
const { discount } = require("../model/discount.model")
const { createDiscountCode, findDiscountCodeExist, findAllDiscountCodeUnselect } = require("../model/repository/discount.repo")
const { findAllProducts } = require("../model/repository/product.repo")
const {convertToObjectMongodb} = require ("../utils/index")

class DiscountService{
    static async  createDiscountCode(payload){
        const {
             code, start_date , end_date , is_active , ShopId,
              min_order_value, product_ids, applies_to, name, description, 
            type, value, max_uses, uses_count, max_uses_per_use
        } = payload

        // check data
        if(new Date() > new Date(start_date) || new Date() > new Date(end_date)){
            throw new BadRequestError("Discount code has expired!")
        }

        if(new Date(start_date) > new Date(end_date)){
             throw new BadRequestError("start date > end date!")
        }
        const foundDiscount = await findDiscountCodeExist({discount_code : code})
        if(foundDiscount && foundDiscount.discount_is_active ){
            throw new BadRequestError("Discount code alreday exist")
        }

        const discount = await createDiscountCode({
            code, start_date , end_date , is_active , ShopId,
            min_order_value, product_ids, applies_to, name, description, 
            type, value, max_uses, uses_count, max_uses_per_use
        })

        return discount

    }

    static async updateDiscountCode() {}

    // get discoutn all product
    static async getAllDiscountWithProduct({
        codeId, limit , page
    }){
       // create index for discount_code
       const findDiscount = await findDiscountCodeExist({_id: codeId})
       if(!findDiscount  || !findDiscount.discount_is_active) throw new BadRequestError('Discount not exist!')


       const {discount_applies_to, discount_product_ids, discount_shopId} = findDiscount
       
       let products = null
       if(discount_applies_to === 'all'){
            //get All product
            products = await findAllProducts({
                filter: {
                    product_shop : convertToObjectMongodb(discount_shopId),
                    isPublihed: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name' , 'product_price']
            })
       }

       if(discount_applies_to === 'specific'){

             products = await findAllProducts({
                filter: {
                   _id: {$in: discount_product_ids},
                    isPublihed: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name' , 'product_price']
            })
       }

       return products
    }

    static async getAllDiscountCodeByShop({limit , page, shopId}){
      
        const discounts = await findAllDiscountCodeUnselect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectMongodb(shopId),
                discount_is_active: true
            },
            model: discount,
            unSelect: ['__v', 'discount_shopId']

        })
        return discounts
    }

    //applied discount shop
    static async getDiscountAmount ({code, userId, products}){
        const findDiscount = findDiscountCodeExist({discount_code: code})
        if(!findCode) throw new BadRequestError("Discount code not exist")

        const {
            discount_is_active, discount_max_uses,discount_min_order_value,discount_type,
            discount_start_date, discount_end_date,discount_max_uses_per_user, discount_users_used
         } = findDiscount

        if(discount_is_active) throw new BadRequestError("Discount expried!")
        if(!discount_max_uses) throw new BadRequestError("Discount are out!")
        if(new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date))  throw new BadRequestError("Discount expried!")
        
        let totalOrder
        if(discount_min_order_value > 0){
             totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
             },0)

             if(totalOrder < discount_min_order_value) throw new BadRequestError('discount require minium order vale of ',discount_min_order_value )
        }

        if(discount_max_uses_per_user > 0){
            const countUserUsedDiscount =  discount_users_used.filter(d => d.userId == userId)
            if(countUserUsedDiscount.length > discount_max_uses_per_user) throw BadRequestError('over use discount')
        }

        //check discount la fix amount hay pecent
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)
         return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
         }
    }

    static async deleteDiscountCode({codeId, shopId}){
        const deleted = await discount.findOneAndDelete({
            _id: codeId,
            discount_ShopId: convertToObjectMongodb(shopId)  
        })

        return deleted
    }

    //cancel discount
    static async cancelDiscountCode({code , userId}){
        const findDiscount = await findDiscountCodeExist({
            discount_code: code
        })

        if(!findDiscount)   throw new BadRequestError("Discount code not exist")
        const reuslt = discount.findByIdAndUpdate(findDiscount._id, {
            $pull: {
                 discount_users_used: userId
            },

            $inc: {
                discount_max_uses: 1,
                discount_used_count: -1
            }
    })
    }
}

module.exports = DiscountService