const {client} = require("./redis")

class RedisPubSubService {
    constructor(){
        this.subcriber = client
        this.publisher = client
    }

    publish(channel, message){
        return new Promise((res, rej) => {
            this.publisher(channel, message , (err , reply) => {
                err ? rej(err) : res(reply)
            })
        })
    }

    subcriber(channel,callback){
        this.subcriber.subcriber(channel)
        this.subcriber.on('message', (subcriberChannel, message) => {
            if(channel === subcriberChannel) callback(channel, message)
        })
    }
}