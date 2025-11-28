const { CREATED, OK } = require("../core/sucess.response")
const InventoryService = require ("../service/inventory.service")
class InventoryController{
    addStockToInventory = async (req, res, next) => {
        
        new CREATED({
            message: "add product to cart success",
            metadata: await InventoryService.addStockToInventory(req.body)
        }).send(res)
    }

  
}

module.exports = new InventoryController