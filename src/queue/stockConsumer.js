const amqplib = require('amqplib');
const redisClient = require('../lib/redis/redisClient');
const { priceAboveOpenPriceAlert, priceAboveThresholdAlert, priceBelowThresholdAlert,priceBelowOpenPriceAlert } = require('../utils/alertChecker');
const { sendEmailJob } = require('./emailProducer');

let connection;
let channel;

const initConsumer = async () => {
    connection = await amqplib.connect('amqp://localhost');
    channel = await connection.createChannel();
    channel.prefetch(1);
};


const stockConsumer = async () => {
    if (!channel) await initConsumer();

    await channel.assertExchange('stock_ticks_exchange','direct',{durable:false});
    const queue = await channel.assertQueue('stocks_ticks_queue',{durable:false});
    await channel.bindQueue(queue.queue,'stock_ticks_exchange','ticks');

    channel.consume(queue.queue, async msg => {
        if (msg) {
            channel.ack(msg);
            const subscribedStocks=await redisClient.sMembers('stocks:subscribed');
            const subscribedStocksSet=new Set(subscribedStocks);
            const stockData=JSON.parse(msg.content);
            const updatedStocks=stockData.filter(st=>subscribedStocksSet.has(st.s));
            for(const stock of updatedStocks){
                const thresholdAboveAlerts=await priceAboveThresholdAlert(stock.s, parseFloat(stock.c));
                const thresholdBelowAlerts=await priceBelowThresholdAlert(stock.s, parseFloat(stock.c));
                const openPriceAboveAlerts=await priceAboveOpenPriceAlert(stock.s, parseFloat(stock.o));
                const openPriceBelowAlerts=await priceBelowOpenPriceAlert(stock.s, parseFloat(stock.o));
                const allAlerts=[...thresholdAboveAlerts,...thresholdBelowAlerts,...openPriceAboveAlerts,...openPriceBelowAlerts];
                for(const alert of allAlerts){
                    sendEmailJob(alert)
                }
               
                const subscribedAlerts=await redisClient.sMembers(`alerts:subscribed`);
                const hasRecurringalerts=subscribedAlerts.has('RECURRING_INTEVAL');
                if(hasRecurringalerts){
                    const fifteenMinsAlertsKey=`alert:recurring:${stock.s}:15m`;
                    const data = await redisClient.hGetAll(fifteenMinsAlertsKey);
                    if(Object.keys(data).length !== 0){
                        let emails = data.emails ? JSON.parse(data.emails) : [];
                        let lastRun = data.lastRun ? parseInt(data.lastRun) : 0;
                        const currentTime=Date.now();
                        if(currentTime - lastRun >= 15*60*1000){
                            for(const email of emails){
                                const alertPayload={user_email:email,alert_type:'RECURRING_INTEVAL',stock:stock.s,current_price:parseFloat(stock.c)};
                                sendEmailJob(alertPayload);
                            }
                            await redisClient.hSet(fifteenMinsAlertsKey, "lastRun", currentTime);
                        }
                    }
                    const oneHourAlertsKey=`alert:recurring:${stock.s}:1h`;
                    const oneHourData = await redisClient.hGetAll(oneHourAlertsKey);
                    if(Object.keys(oneHourData).length !== 0){
                        let emails = oneHourData.emails ? JSON.parse(oneHourData.emails) : [];
                        let lastRun = oneHourData.lastRun ? parseInt(oneHourData.lastRun) : 0;
                        const currentTime=Date.now();
                        if(currentTime - lastRun >= 60*60*1000){
                            for(const email of emails){
                                const alertPayload={user_email:email,alert_type:'RECURRING_INTEVAL',stock:stock.s,current_price:parseFloat(stock.c)};
                                sendEmailJob(alertPayload);
                            }
                            await redisClient.hSet(oneHourAlertsKey, "lastRun", currentTime);
                        }
                    }
                    
                }
            }

        }
    });

};

module.exports = { stockConsumer };
