const pro = {
     app: {
        port: 3000
     },

     db: {
        host: process.env.PRO_DATABASE_HOST ,
        port: process.env.PRO_DATABASE_PORT,
        name: process.env.PRO_DATABASE_DB_NAME,

     }
}

const dev = {
     app: {
        port: 3005
     },

     db: {
       host: process.env.DEV_DATABASE_HOST ,
       port: process.env.DEV_DATABASE_PORT,
       name: process.env.DEV_DATABASE_DB_NAME,
        
     }
}

const config = {pro , dev} 
const env = process.env.NODE_ENV || 'dev'
module.exports = config[env]