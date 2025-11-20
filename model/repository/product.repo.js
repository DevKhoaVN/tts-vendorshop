const { Types } = require("mongoose")
const {product , electronic, clothing} = require ("../product.model")
const {getSelectData, unSelectData}  = require ("../../utils/index")

const findAllDraftsForShop = async ({query, limit , skip}) => {
    return await product.find(query)
    .populate('product_shop', 'name email -_id')
    .sort({updateAt: -1})
    .skip(skip)
    .limit(limit)
    .lean()
}

const queryProduct = async({query , limit , skip}) => {
    return await product.find(query)
    .populate('product_shop', 'name email -_id')
    .sort({updateAt: -1})
    .skip(skip)
    .limit(limit)
    .lean()
}

const publishProductByShop = async({product_shop, product_id}) =>{

    const foundShop = await product.findOne({
        product_shop,
        _id:  product_id
    })

    if(!foundShop) return null
    foundShop.isDraft = false
    foundShop.isPublihed = true

    const { modifiedCount } = await foundShop.updateOne(foundShop)

    return modifiedCount
}

const unPublishProductByShop = async({product_shop, product_id}) =>{

    const foundShop = await product.findOne({
        product_shop,
        _id:  product_id
    })

    if(!foundShop) return null
    foundShop.isDraft = true
    foundShop.isPublihed = false

    const { modifiedCount } = await foundShop.updateOne(foundShop)

    return modifiedCount
}

const searchProduct = async ({keySearch}) => {

    const result = await product.find({
        $text: {$search: keySearch},
        isPublihed: true
    }, {score: {$meta: 'textScore'}})
    .sort({score: {$meta: 'textScore'}})
    .lean()

    return result
}

const findAllProducts = async ({limit  , sort , page, filter, select}) => {
   const skip = (page - 1) * limit
   const sortBy = sort === "ctime" ? {_id: -1} : {_id: 1}
   const products = product.find(filter)
   .sort(sortBy)
   .skip(skip)
   .limit(limit)
   .select(getSelectData(select))
   .lean()

   return products
}

const findProduct = async ({product_id , unSelect}) => {
    const productDetail = product.findOne({_id: product_id, isPublihed: true}).select(unSelectData(unSelect))
    return productDetail
}
module.exports = {
    findAllDraftsForShop ,
    publishProductByShop , 
    queryProduct ,
    unPublishProductByShop ,
    searchProduct,
    findAllProducts,
    findProduct
}
