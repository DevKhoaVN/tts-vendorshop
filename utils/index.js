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

const getSelectData = (select= []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}
const unSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefineValueInObject = (object = {}) => {
     Object.keys(object).forEach(k => {
        if(object[k] == null){
            delete object[k]
        }
    })
    return object
}

const updateNestedObjectPaser = (object) => {
    const final = {}
    Object.keys(object).forEach(k => {
        if(typeof(object[k]) ==='object' && !Array.isArray(object[k])){
            const response = updateNestedObjectPaser(object[k])
            Object.keys(response).forEach( a => {
                final[`${k}.${a}`] = res[a]
            })
        }else{
            final[k] =  object[k]
        }
    })
}
module.exports = {
    getInforData , 
    asyncHanlder,
    generatePublicPrivateKey,
    getSelectData,
    unSelectData,
    removeUndefineValueInObject,
    updateNestedObjectPaser
}