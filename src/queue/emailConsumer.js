const amqplib = require("amqplib");
const nodemailer = require("nodemailer");

let channel;

async function initEmailWorker() {
    const connection = await amqplib.connect("amqp://localhost");
    channel = await connection.createChannel();

    await channel.assertExchange("email_exchange", "direct", { durable: true });

    const queue = await channel.assertQueue("email_queue", { durable: true });

    channel.bindQueue(queue.queue, "email_exchange", "send_email");

    channel.prefetch(5);

    console.log("Email Worker: Listening...");

    channel.consume(queue.queue, async msg => {
        try {
            const data = JSON.parse(msg.content);

            console.log("Sending email:", data);
            

            await sendEmail(data.to, data.subject, data.message);

            channel.ack(msg);
        } catch (err) {
            console.error("Email send failed:", err);
            channel.nack(msg, false, true); // retry
        }
    });
}

// Simple email sender
async function sendEmail(to, subject, message) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    await transporter.sendMail({
        from: "Stock Alerts <alerts@example.com>",
        to,
        subject,
        text: message
    });
}

initEmailWorker();
