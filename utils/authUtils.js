const { error } = require("console")
const JWT = require("jsonwebtoken")
const { asyncHanlder } = require("./index")
const { BadRequestError } = require("../core/error.response")
const { findUserById } = require("../service/keyToken.service")
const KeyTokenService = require("../service/keyToken.service")

const createTokenPair = async (payload , publicKey , privateKey) => {
  
    try {

      
        const accessToken = await JWT.sign(payload , privateKey, {
           algorithm: 'RS256',
           expiresIn: '2 days'
        }) 
        
        const refreshToken = await JWT.sign(payload, privateKey, {
           algorithm: 'RS256',
           expiresIn: '7 days'
        })

        JWT.verify(accessToken , publicKey , (error , decode) => {
            if(error){
                console.error("error verify: " , error)
            }else{
                console.log("decode verify")
            }
        })
        console.log("token : " , refreshToken , accessToken)
        return {accessToken , refreshToken}

    } catch (error) {
        
    }
}

const authencation = asyncHanlder(async (req , res , next) => {

    //get userId
    const userId = req.headers['x-client-id']
    if(!userId) throw new BadRequestError("Invalid request UserId")
    
    const keyStore = await KeyTokenService.findUserById(userId)
    if(!keyStore) throw new BadRequestError("Not found key store")
    //get access token 
    const accessToken = req.headers['x-access-token']
    if(!accessToken) throw new BadRequestError("Invalid request AccessToken")

    try {
        const decode =  JWT.verify(accessToken ,keyStore.publicKey)
        if(userId !== decode.userId) throw new BadRequestError("Invalid user")
        req.keyStore = keyStore
        req.user = decode

        return next()
    }catch (error) {
       throw error
    }


})

module.exports = {createTokenPair , authencation}