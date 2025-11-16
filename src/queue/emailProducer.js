const amqplib = require("amqplib");

let channel;

async function initEmailProducer() {
    const connection = await amqplib.connect("amqp://localhost");
    channel = await connection.createChannel();

    await channel.assertExchange("email_exchange", "direct", { durable: true });
}

async function sendEmailJob(payload) {
    if (!channel) await initEmailProducer();

    channel.publish(
        "email_exchange",
        "send_email",
        Buffer.from(JSON.stringify(payload)),
        { persistent: true }
    );
}

module.exports = { sendEmailJob };
