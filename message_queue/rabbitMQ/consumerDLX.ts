const amqp = require ("amqplib")


const runConsumerDLX = async () => {
   try {
    const con = await amqp.connect('amqp://localhost')
    const channel = await con.createChannel()

    const notificationExchangeDLX = 'dlxExchange'
    const notificationRoutingDLX = 'dlxRoutingKey'
    const notiQueueHandler = 'notificationQueueHostFix'

    //1. create exchange
    await channel.assertExchange(notificationExchangeDLX, 'direct', {
        durable: true
    })

    //2. create queue
    const queueResult = await channel.assertQueue(notiQueueHandler, {
        durable: true
    })
    
    //3 bind queue
    await channel.bindQueue(queueResult.queue, notificationExchangeDLX, notificationRoutingDLX)

    //4 send message
   
    await channel.consume(queueResult.queue,  mesFailed => {
        console.log("message failed: ", mesFailed.content.toString())
    }, {
        noAck: true
    })
   
   } catch (error) {
    console.error(  'error : ' , error)
   }
}

runConsumerDLX().then(rs => console.log(rs)).catch(console.error)