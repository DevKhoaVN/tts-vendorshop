const mongoose = require("mongoose");
const {db : {host , port, name}} = require ("../config/config.mongoose")
const connectString = `mongodb://${host}:${port}/${name}`

class Database {

    constructor() {
         const connectString = `mongodb://${host}:${port}/${name}`
        this.connect();
       
    }

    connect(type = "mongodb"){
         if(1 === 1){
            mongoose.set('debug' , true);
            mongoose.set('debug' , {color: true})
         }

         mongoose.connect(connectString).then( _ => console.log('Connected Mongodb Success'))
         .catch( err => console.log('Error Connect Mongodb !'))
    }

    static getInstace(){
        if(!Database.instance){
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceDatabase = Database.getInstace();
module.exports = instanceDatabase