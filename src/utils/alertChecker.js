const redisClient=require('../lib/redis/redisClient');

const alertRequiredPeople=async (stockSymbol, price) => {
    const alertsAbove = await priceAboveThresholdAlert(stockSymbol, price);
    const alertsBelow = await priceBelowThresholdAlert(stockSymbol, price);
    const alertGreaterThanOpenPrice=await priceAboveOpenPriceAlert(stockSymbol, price);
    const alertLessThanOpenPrice=await priceBelowOpenPriceAlert(stockSymbol, price);
    return { alertsAbove, alertsBelow,alertGreaterThanOpenPrice,alertLessThanOpenPrice };
}

const priceAboveThresholdAlert=async (stockSymbol, threshold) => {
    const alerts = await redisClient.zrangebyscore(stockSymbol, threshold, '+inf');
    return alerts.map(alert => JSON.parse(alert));
}

const priceBelowThresholdAlert=async (stockSymbol, threshold) => {
    const alerts = await redisClient.zrangebyscore(stockSymbol, '-inf', threshold);
    return alerts.map(alert => JSON.parse(alert));
}

const priceBelowOpenPriceAlert=async (stockSymbol, openingPrice) => {
    const alerts = await redisClient.zrangebyscore(stockSymbol, '-inf', openingPrice);
    return alerts.map(alert => JSON.parse(alert));
}

const priceAboveOpenPriceAlert=async (stockSymbol, openingPrice) => {  
    const alerts = await redisClient.zrangebyscore(stockSymbol, openingPrice, '+inf');
    return alerts.map(alert => JSON.parse(alert));
}

module.exports={priceAboveOpenPriceAlert,priceBelowOpenPriceAlert,priceAboveThresholdAlert,priceBelowThresholdAlert};