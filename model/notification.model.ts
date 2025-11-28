const {model , Schema , Types } = require("mongoose")

const DOCUMENT_NAME ='Notification'
const COLLECTION_NAME = 'Notifications'
/**
 * ORDER-001: order success
 * ORDER-002: order failed
 * PROMOTION-001: new PROMOTION
 */
const notiSchema = new Schema({
    noti_type: {type: Array , required: true, enum:['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001']},
    noti_senderId: {type: Number , required: true},
    noti_receivedId: {type: Number , required: true},
    noti_content: {type: String , required: true},
    noti_options: {type: Object , default: {}},
    
}, {
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'ModifiedOn'
    },
    collection: COLLECTION_NAME
})

module.exports = {
    Notification: model(DOCUMENT_NAME, notiSchema)
}