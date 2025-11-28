const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'clothing-app',
    brokers: ['localhost:9092']
})

const consumer = kafka.consumer({ groupId: 'clothing-group' })

async function run() {
    await consumer.connect()
    await consumer.subscribe({ topic: 'order-topic', fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                key: message.key?.toString(),
                value: message.value.toString()
            })
        }
    })
}

run().catch(console.error)
