
const {Types} = require('mongoose')
const { discount } = require('../discount.model')
const { unSelectData, getSelectData } = require('../../utils')

const createDiscountCode = async ({
     code, start_date , end_date , is_active , ShopId,
     min_order_value, product_ids, applies_to, name, description, 
     type, value, max_uses, uses_count, max_uses_per_use
}) => {
     return await discount.create({
     discount_name: name ,
     discount_description: description,
     discount_type: type, 
     discount_value: value,
     discount_code: code,
     discount_start_date: new Date(start_date),
     discount_end_date: new Date(end_date),
     discount_max_uses: max_uses, 
     discount_used_count: uses_count,
     discount_max_uses_per_user: max_uses_per_use ,
     discount_min_order_value: min_order_value || 0, 
     discount_shopId: ShopId, 


     discount_is_active: is_active,
     discount_applies_to: applies_to, 
     discount_product_ids:applies_to === 'all' ? [] : product_ids
     })
}

const findDiscountCodeExist  = async (filter) => {
    return discount.findOne(filter).lean()
}

const findAllDiscountCodeUnselect = async ({
    limit = 50, page = 1, sort = 'ctime' , filter, unSelect, model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort ==='ctime' ? {_id: -1} : {_id: 1}
    const products = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unSelectData(unSelect))
    .lean()

    return products
}


const findAllDiscountCodeSelect = async ({
    limit = 50, page = 1, sort = 'ctime' , filter, unSelect, model
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort ==='ctime' ? {_id: -1} : {_id: 1}
    const products = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(unSelect))
    .lean()

    return products
}
module.exports = {
    createDiscountCode,
    findDiscountCodeExist,
    findAllDiscountCodeUnselect,
    findAllDiscountCodeSelect
}