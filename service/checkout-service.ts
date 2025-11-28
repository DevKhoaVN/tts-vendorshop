const { filter } = require("lodash")
const { NotFoundError, BadRequestError } = require("../core/error.response")
const { order} = require("../model/order.model")
const { findDiscountCodeExist } = require("../model/repository/discount.repo")
const { checkProductByServer } = require("../model/repository/product.repo")
const { findModelExist } = require("../utils")
const { getDiscountAmount } = require("./discount.service")
const { acquireLock, releaseLock } = require("./redis")

class CheckoutService{
    /*   
     payload: 
      {
          cartId,
          userId,
          shop_order_ids: [
             {
                shopId,
                shop_discount: [],
                items_product: [
                    {
                       price,
                       quantity,
                        productId
                    }
                ]

             }
          ]
      }
    */
    static async checkoutReview({cardId, userId, shop_order_ids}){
       // check cartid ton tai khong
       const foundCart = findModelExist({model: cart , filter: { _id: cardId , cart_state: 'active'}})
       if(foundCart) throw new NotFoundError('Cart not exist in system')

       const checkout_order = {
          totalPrice: 0,
          feeShip: 0,
          totalDiscount: 0,
          totalCheckout: 0
       },  shop_order_ids_new = []
       
       for(let i = 0 ; i < shop_order_ids.length; i ++){

            const {shopId, shop_discount= [], item_products = []} = shop_order_ids[i]
            const checkProductServer = await checkProductByServer(item_products)
            console.log("checkProductServer:: ", checkProductByServer)

            if(!checkProductByServer) throw new NotFoundError('Product not found in system')

            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            // tong tien truoc khi xu li
             checkout_order.totalCheckout += checkoutPrice
             const itemCheckout = {
                shopId,
                shop_discount,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductByServer
             }
            
             // kiem tra discount co ton tai hay khong  | shop_discount > 0
             if(shop_discount.length > 0){
                // gia su 1 discount
                const {  
                  totalOrder,
                  discount,
                  totalPrice
               } = await getDiscountAmount({
                  codeId: shop_discount[0].codeId,
                  userId,
                  shopId,
                  products: checkProductByServer })

               // tong tien giam gia 
               checkout_order.totalDiscount += discount
               if(discount > 0){
                  itemCheckout.priceApplyDiscount = checkoutPrice - discount
               }
             }

             // tong tien cuoi cung
             checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
             shop_order_ids_new.push(itemCheckout)
            
       }
       
       return {
         shop_order_ids,
         shop_order_ids_new,
         checkout_order
       }
    }

    static async orderByUser({
      shop_order_ids,
      cartId,
      userId,
      user_address = {},
      user_payment = {}
    }) {
      const { shop_order_ids_new, checkout_order } = await this.checkoutReview({
         cartId,
         userId,
         shop_order_ids
      })

        // check xem vuot ton kho khong
        // chuyen doi product sang mang 

        const products = shop_order_ids_new.flatMap( order => order.items_product) 
        console.log("[1] :: " , products)

        const acquiredLocks = []
        const lockValues = new Map() // để release đúng value
        try {
         
         for (const { productId, quantity } of products) {
         const lockKey = await acquireLock(productId, quantity, cartId);
      
         if (!lockKey) {
            throw new BadRequestError(`Sản phẩm ${productId} đã hết hàng hoặc đang được đặt bởi người khác!`);
         }

          acquiredLocks.push(lockKey);
          lockValues.set(lockKey, cartId); // lưu lại value để release đúng
         }

         const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new 
         })

         // neu tao order thnah cong , xoa het san pham trong gio hang
         return newOrder

        } catch (error) {
          console.error("Order failed, releasing all locks...", error.message)
          for (const lockKey of acquiredLocks) {
             await releaseLock(lockKey, cartId);
          }
            throw error
        }

    }
}

module.exports = CheckoutService