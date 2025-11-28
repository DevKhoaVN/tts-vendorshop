const amqp = require('amqplib')
const message = 'hello toi la khoa den tu vtc fuck '
const runReducer = async () => {
    try {
        const connection= await amqp.connect('amqp://localhost')
        const channel =  await connection.createChannel()

      
        const exchangeName = 'logs'
        await channel.assertExchange(exchangeName, 'fanout', {durable: true})

        for(let i = 0; i <=1 ; i++){
             const msg = `Message ${i}`;
             channel.publish(exchangeName, '', Buffer.from(msg))
        }
       
        console.log("message : " ,message)
    } catch (error) {
        console.error(error)
    }
}

 runReducer().catch(console.error)