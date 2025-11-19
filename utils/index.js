const _ = require ("lodash")
const crypto = require("crypto")
const { format } = require("path")
const JWT = require("jsonwebtoken")


const getInforData =  ({fields = [] , object = {}}) => {
    return _.pick(object , fields)
}

const asyncHanlder = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}

const generatePublicPrivateKey = () => {
    const {publicKey , privateKey} = crypto.generateKeyPairSync("rsa" , {
        modulusLength: 4096,
         publicKeyEncoding: {   
              type: 'pkcs1',
              format: "pem"
         },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: "pem"
        }
})

    
    return { publicKey,  privateKey };
};



module.exports = {
    getInforData , asyncHanlder, generatePublicPrivateKey
}