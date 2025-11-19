const shopModel = require("../model/shop.model")
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.service");
const {createTokenPair} = require("../utils/authUtils");
const {UnauthorizedError, BadRequestError, ForbiddenRequestError} = require ("../core/error.response")
const { findByEmail } = require("./shop.service");
const JWT = require("jsonwebtoken")
const {generatePublicPrivateKey, getInforData} = require ("../utils/index")
const saltRounds = 10;

const RoleShop = {
  Shop : "Shop",
  Admin: "Admin",
  Editor: "Editor",
  Write : "Write"
}
class AcessService{
   static signUp = async ({name , email , password}) => {
    try {
        //step1: check email exist
        const holderShop = await shopModel.findOne({email}).lean()
        if(holderShop){
            return {
                code : "xxx",
                message: "Shop already registed!"
            }
        }
      
        const passwordHashed = await bcrypt.hash(password, saltRounds)

        const newShop = await shopModel.create({
            name ,email , password : passwordHashed , role: [RoleShop.Shop]
        })

        if(newShop){
        
            const {publicKey , privateKey} = generatePublicPrivateKey();

            const publicKeyString = await KeyTokenService.createKeyToken({userId: newShop._id , publicKey , privateKey})
           
            if(!publicKeyString){
                return {
                    code : "xxx",
                    "message": "publicKeyStrin error!"
                }
            }

            //create token pair
            const tokens = await createTokenPair({userId: newShop._id , email}, publicKey , privateKey)

            console.log("CREATED TOKEN SUCCESS :: ", tokens)

            return {
                code: 201,
                metadata: {
                    shop : getInforData({fields: ['name' , 'email'] , object:newShop}),
                    tokens
                }
            }
        }

        return {
            code:200,
            metadata: null
        }

    } catch (error) {
        return {
            code: 'xxx',
            message: error.message,
            status: 'error'
        }
    }
   }

   static logIn = async ({email , password , refreshToken = null}) => {
      // check shop
      const foundShop = await findByEmail(email);
      if(!foundShop) throw new BadRequestError("Shop not regiserted")

      //check password
      const isMatch = await bcrypt.compare(password , foundShop.password)
      if(!isMatch) throw new UnauthorizedError("Authentication not match")
 
     // tao public  va private key
     const {publicKey , privateKey } = generatePublicPrivateKey();
     const tokens = await createTokenPair({userId: foundShop._id , email} , publicKey , privateKey)
     console.log("token : " , tokens)

     await KeyTokenService.createKeyToken({
        userId: foundShop._id,
        refreshToken: tokens.refreshToken,
        acessToken: tokens.accessToken,
        privateKey,
        publicKey
     })

     return {
        shop: getInforData({fields: ['_id' , 'name' , 'email'] , object: foundShop}),
        tokens
     }
   }

   static logOut = async (keyStore) => {
        const deleteKey = await KeyTokenService.removeKeyById(keyStore.user)
        return deleteKey
   }

    static handleRefreshToken = async ({refreshToken}) => {
   
     const foundToken = await KeyTokenService.findRefreshTokenUsed(refreshToken)
    
     if(foundToken) {
        // decode ra xem thang nao
        const {userId , email} = JWT.verify(refreshToken , foundToken.publicKey)
        console.log("possible hack refresh token" , userId , email)

        // xoa key toan bo
        await KeyTokenService.deleteKeyById(foundToken.user)

        throw new ForbiddenRequestError("Something wrong happend. Pls relogin")

   }

   // chua co thi tra ra token
    const hoderToken = await KeyTokenService.findRefreshToken(refreshToken)
    const refreshToken = refreshToken.trim()
    if(!hoderToken) throw new UnauthorizedError("Shop not registered")

    const {userId , email} = JWT.verify(refreshToken , hoderToken.publicKey)
    console.log("decode refresh token" , userId , email)
    
    const foundShop = await findByEmail(email)
    if(!foundShop) throw new BadRequestError("Shop not regiserted")

    // tao cap token moi
    const tokens = await createTokenPair({userId , email} , hoderToken.publicKey , hoderToken.privateKey)
    console.log("new token after refresh token" , tokens)

    await hoderToken.uodateOne({
        $set: {
            refreshToken: tokens.refreshToken
        },
        $addToSet:{
            refreshTokenUsed: refreshToken
        }
    })

    return {
        user: {userId , email},
        tokens
    }
    }

}
module.exports = AcessService