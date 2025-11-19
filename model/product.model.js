const { lowerCase } = require("lodash")
const {model , Schema , Types} = require("mongoose")
const slugify = require("slugify")

const DOUCUMENT_NAME = "Product"
const COLLECTION_NAME = "Products"


const productSchema = new Schema ({
    product_name : {type: String , required: true},
    product_thumb : {type: String , required: true},
    product_description : {type: String },
    product_slug: String,
    product_price: {type: Number , required: true},
    product_quantity: {type: Number , required: true},
    product_type: {type :String, required: true , enum: ['Electronics', 'Clothing', 'Furniture']},
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
    product_attributes: {type: Schema.Types.Mixed , required: true},

    // more
    product_ratingAverage:{
        type: Number,
        min: [1, 'Rating must be above 1'],
        max: [5, 'Rating must be less 5'],
        set: (val) => Math.round(val * 10)/10
    },
    product_variations: {type: Array, default: []},
    isDraft: {type: Boolean, default: true, index: true, select: false},
    isPublihed: {type: Boolean, default: false, index: true, select: false}

}, {
     collection: COLLECTION_NAME , timestamps: true
})

//create  index for search
productSchema.index({product_name: 'text', product_description: 'text'})
//document middleware
productSchema.pre('save', function(next) {
    this.product_slug = slugify(this.product_name, { lowerCase: true })
    next()
});


const clothingSchema = new Schema({
    brand: {type: String , required: true},
    size: String,
    material: String,
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
}, {
    collection: 'clothes',
    timestamps: true
})


const electronicSchema = new Schema({
    manufacturer: {type: String , required: true},
    size: String,
    material: String,
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},

}, {
      collection: 'clothes',
    timestamps: true
})

module.exports = {
    product: model(DOUCUMENT_NAME , productSchema),
    clothing: model('Clothing' , clothingSchema),
    electronic: model ('Electronics' , electronicSchema)
}
