const amqp = require('amqplib');

const runConsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const queueName = 'order-topic-new-op';
        const exchangeName = 'logs';
        const dlxExchange = 'NotificationDLX';
        const dlxRoutingKey = 'notification.dead';

        // 1. Declare fanout exchange
        await channel.assertExchange(exchangeName, 'fanout', { durable: true });

        // 2. Declare queue 
        await channel.assertQueue(queueName, {
            durable: true,

            arguments: {
                'x-dead-letter-exchange': dlxExchange,
                'x-dead-letter-routing-key': dlxRoutingKey,
                'x-message-ttl': 5000 
            }
        });

        // 3. Bind queue vào exchange
        await channel.bindQueue(queueName, exchangeName, "");

        console.log(`👂 Waiting for messages in ${queueName}...`);

        // 4. Consume message ngay lập tức
        setTimeout(() => {
            channel.consume(queueName, (message) => {
            if (!message) return;
            const content = message.content.toString();
            console.log('📩 Received:', content);

        
            const isError = content.includes("fail");
            if (isError) {
    
                channel.nack(message, false, false); 
            } else {
                channel.ack(message);
            }
        }, { noAck: false });

        }, 10000)
    } catch (error) {
        console.error('Error in consumer:', error);
    }
};

runConsumer();
