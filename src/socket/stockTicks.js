const WebSocket = require('ws');
const finnhubToken = process.env.FINNHUB_API_TOKEN;
const { productStockTick } = require('../queue/stockProducer');

const ws = new WebSocket(`wss://stream.binance.com:9443/ws/!miniTicke@arr`);

ws.on('open', () => {
  console.log('Connected to server');
  // ws.send(JSON.stringify({
  //   type: "subscribe",
  //   symbol: "BINANCE:BTCUSDT"
  // }));
});

ws.on('message', (msg) => {
  const tick = JSON.parse(msg);
 // console.log('Received:', tick);
  productStockTick(tick);
});

ws.on('close', () => {
  console.log('Disconnected from server');
});

module.exports = ws;
