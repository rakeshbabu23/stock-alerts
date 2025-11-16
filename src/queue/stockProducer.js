const amqplib = require('amqplib');

let channel;


const initProducer = async () => {
  const connection = await amqplib.connect('amqp://localhost');
  channel = await connection.createChannel();
  await channel.assertExchange('stock_ticks_exchange','direct',{durable:false});
  console.log("Producer initialized");
}

const productStockTick = async (tick) => {
  if(!channel) await initProducer();
  channel.publish('stock_ticks_exchange','ticks',Buffer.from(JSON.stringify(tick)));
  console.log("Produced tick:", tick);
}

module.exports = { productStockTick };
