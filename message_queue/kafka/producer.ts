const { json } = require('express')
const {Kafka} = require('kafkajs')

const kafka = new Kafka({
    clientId: 'clothing0-app',
    brokers: ['localhost:9092']
})

const producer = kafka.producer()

const runProducer = async () => {
    await producer.connect()
    await producer.send({
        topic: 'noti-topic',
        messages: [
            {
                key: 'order1', value: JSON.stringify({orderId: 123, total: 5000})
            }
        ]
    })

    await producer.disconnect()
}

runProducer().catch(console.error)
