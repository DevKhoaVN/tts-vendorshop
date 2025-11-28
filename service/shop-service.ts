const shopModel = require("../model/shop.model");

const findByEmail = async (email) => await shopModel.findOne({email}).select("name email password").lean();

module.exports = {
    findByEmail
}