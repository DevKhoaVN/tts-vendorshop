const {model, Schema} = require("mongoose")

const DOCUMENT_NAME= "Key"
const COLLECTION_NAME= "Keys"
var KeyTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Shop"
    },

    publicKey: {
        type: String,
        required: true
    },
    privateKey: {
        type: String,
        required: true
    },

    refreshTokenUsed: {
        type: Array,
        default: []
     },

    refreshToken: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    }
},{
    timestamps: true,
    COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, KeyTokenSchema)