require('dotenv').config();
const express=require('express');
const app=express();
const stockTicks=require('./src/socket/stockTicks');
const { stockConsumer } = require('./src/queue/stockConsumer');

app.listen(4000,function(){
    console.log("Server is running on port 3000");
});

app.use(express.json());

const stockRoute=require('./src/routes/stocks.route');
const alertRoute=require('./src/routes/alert.route');
const alertHistoryRoute=require('./src/routes/alertHistory.route');

app.use('/api',stockRoute);
app.use('/api',alertRoute);
app.use('/api',alertHistoryRoute);

stockConsumer().catch(err => console.error('Consumer error:', err));