const {model , Schema , Types } = require("mongoose")

const DOCUMENT_NAME ='Comment'
const COLLECTION_NAME = 'Comments'

const commentchema = new Schema({
    comment_productId: {type: Schema.Types.ObjectId , ref:'Product'},
    comment_userId: {type: Number , default: 1},
    comment_content: {type: String, default: 'text'},
    comment_left: {type: Number, default: 'text'},
    comment_right: {type: Number, default: 0},
    comment_content: {type: String, default: 0},
    comment_content: {type: String, default: 0},
    comment_parentId: {type:Schema.Types.ObjectId, ref: DOCUMENT_NAME}
}, {
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'ModifiedOn'
    },
    collection: COLLECTION_NAME
})

module.exports = {
    comment: model(DOCUMENT_NAME, commentchema)
}