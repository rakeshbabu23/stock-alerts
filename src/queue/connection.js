const amqplib=require('amqplib');

const connection=async()=>{
    return amqplib.connect('amqp://localhost');
}

module.exports=connection;