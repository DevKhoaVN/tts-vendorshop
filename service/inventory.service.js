const { NotFoundError } = require("../core/error.response");
const { inventory } = require("../model/inventory.model");
const { findProductById } = require("../model/repository/product.repo");

class InventoryService{
    static async addStockToInventory({shopId, productId, sotck, location= '124 Tam Trinh, Tan Hoang Minh, Ha Noi'}){
          const foundProduct = await findProductById(productId)
          if(!foundProduct) throw new NotFoundError('product not found , pls check again')
           
          const query = {
            inven_shopId: shopId,
            inven_productId: productId
          }, updateSet = {
            $inc: {
                inven_stock: +sotck
            },
            $set: {
                inven_location: location
            }
          }, options = {upsert: true, new: true}
          
          return await inventory.findOneAndUpdate(query, updateSet, options)
        
    }
    static async getOrderByUser(){}
    static async getOneOrderByUser(){}
    static async cancelOrderByUser(){}
    static async updateOrderStatusByShop(){}
}
module.exports = InventoryService