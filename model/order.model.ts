const {model , Schema , Types } = require("mongoose")

const DOCUMENT_NAME ='Order'
const COLLECTION_NAME = 'Orders'

const orderSchema = new Schema({
    order_userId: {type: String , required: true, enum:['active', 'compeleted', 'failed', 'pending'], default: 'active'},
    order_checkout: {type: Object, default: {}},
    order_shipping: {type: Object, default: {}},
    order_payment: {type: Object, default: {}},
    order_products: {type: Array, default: []},
    order_trackingNumber: {type: String, default: '20251208'},
    order_status: {type: String, enum: ['pending', 'comfirmed', 'shipped', 'cancel', 'delivered'], default: 'pending'}
  
}, {
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'ModifiedOn'
    },
    collection: COLLECTION_NAME
})

module.exports = {
    order: model(DOCUMENT_NAME, orderSchema)
}