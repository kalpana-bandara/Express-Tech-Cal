const axios = require('axios')
const ejs = require('ejs')
const path = require('path')
const env = require('dotenv')
const express = require('express')
const https = require('https')

const app = express()

app.use(express.urlencoded({
    extended: false
}))
app.use(express.static(path.join(__dirname, 'public')))
app.set("view engine", "ejs")


app.get("/", (req, res) => {
    res.render('homepage')
})


app.get('/analysis', (req, res) => {

    let coin = req.query.coinName
    let time = req.query.timeSelect

    if (!coin) {
        res.redirect("/")
    } else {
        async function loadData() {
            const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImthbHBhbmFiYW5kYXJhLmluZm9AZ21haWwuY29tIiwiaWF0IjoxNjQ1MzI4ODkyLCJleHAiOjc5NTI1Mjg4OTJ9.0NFKTikfzJmTMvBqm1P-a_EAhKvr9m64He78ecXqbEU"
            await axios.post("https://api.taapi.io/bulk", {
                    "secret": KEY,
                    "construct": {
                        "exchange": "binance",
                        "symbol": `${coin.toUpperCase()}/USDT`,
                        "interval": time,
                        "indicators": [{
                                "indicator": "rsi"
                            },
                            {
                                "indicator": "macd",
                            },
                            {
                                "indicator": "fibonacciretracement"
                            },
                            {
                                "indicator": "ema",
                                "optInTimePeriod": 200
                            },
                            {
                                "indicator": "avgprice"
                            },
                            {
                                "indicator": "supertrend"
                            }
                        ]
                    }
                })
                .then(response => {

                    function findFib(price) {

                        if (price > fib) {
                            bullorBear = "Price is above 0.618"
                        } else {
                            bullorBear = "Price is below 0.618"
                        }
                    }

                    function findEma(ema) {
                        if (avgPrice > ema) {
                            averageEMA = "Price is above 200 EMA"
                        } else {
                            averageEMA = "Price is below 200 EMA"
                        }
                    }

                    function findMACD(blue, red) {

                        if ((blue && red) > 0) {
                            if (blue < red) {
                                macd = "In an Uptrend"
                            } else {
                                macd = "In an Uptrend But had Bearish Crossover"
                            }
                        } else {
                            if (blue > red) {
                                macd = "In an Downtrend"
                            } else {

                                macd = "In an downtrend but had Bullish Crossover"
                            }
                        }

                    }

                    function findRSI(x){

                        if(x > 70){
                            rsii = "OverBought"
                        }else if(rsi < 30){
                            rsii = "OverSold"
                        }

                        if(rsi > 50) {
                            rsii = "Uptrend"
                        }else{
                            rsii = "Downtrend"
                        }

                        
                    }

                    const blueMacd = response.data.data[1].result.valueMACDSignal
                    const redMacd = response.data.data[1].result.valueMACD


                    const rsi = response.data.data[0].result.value
                    const trend = response.data.data[2].result.trend

                    const fib = response.data.data[2].result.value
                    const fibStart = response.data.data[2].result.startPrice
                    const fibEnd = response.data.data[2].result.endPrice

                    const emaVal = response.data.data[3].result.value

                    const avgPrice = response.data.data[4].result.value

                    const supertrendAdvice = response.data.data[5].result.valueAdvice
                    const supertrendValue = response.data.data[5].result.value

                    findFib(avgPrice)
                    findEma(emaVal)
                    findMACD(blueMacd, redMacd)
                    findRSI(rsi)

                    res.render('analysis', {
                        coinName: req.query.coinName,
                        rsiValue: rsi,
                        rsiTrend : rsii,
                        trendD: trend,
                        mac: macd,
                        fibValue: fib,
                        fibS: fibStart,
                        fibE: fibEnd,
                        bullrBear: bullorBear,
                        EMA: averageEMA,
                        supertrendA: supertrendAdvice,
                        supertrendV: supertrendValue,
                        price: avgPrice
                    })



                })
                .catch(error => {
                    console.log(error)

                });
        }
        loadData()

    }

})

app.get('/api/pivots/:coin', (req, res) => {

    let coinU = req.params.coin

    async function loadPivot() {
        const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImthbHBhbmFiYW5kYXJhLmluZm9AZ21haWwuY29tIiwiaWF0IjoxNjQ1MzI4ODkyLCJleHAiOjc5NTI1Mjg4OTJ9.0NFKTikfzJmTMvBqm1P-a_EAhKvr9m64He78ecXqbEU"
        await axios.post('https://api.taapi.io/bulk', {
                "secret": API_KEY,
                "construct": {
                    "exchange": "binance",
                    "symbol": `${coinU.toUpperCase()}/USDT`,
                    "interval": '1d',
                    "indicators": [{
                            "indicator": "candle",
                            "backtrack": 1


                        },
                        {
                            "indicator": "avgprice",
                        }

                    ]
                }
            })
            .then(response => {
                let candleprev = response.data.data[0].result
                let cPrice = response.data.data[1].result.value
                let guess
                let pp = (candleprev.high + candleprev.low + candleprev.close) / 3
                let r1 = (pp * 2) - candleprev.low
                let s1 = (pp * 2) - candleprev.high
                let r2 = pp + (candleprev.high - candleprev.low)
                let s2 = pp - (candleprev.high - candleprev.low)
                let r3 = pp * 2 + (candleprev.high - 2 * candleprev.low)
                let s3 = pp * 2 - (2 * candleprev.high - candleprev.low)
                let r4 = pp * 3 + (candleprev.high - 3 * candleprev.low)
                let s4 = pp * 3 - (3 * candleprev.high - candleprev.low)

                if (cPrice > pp) {
                    guess = "Current price is above Pivot Point!"
                } else {
                    guess = "Current price is above Pivot Point!"
                }

                res.json({
                    "resistnce1": r1,
                    "resistance2": r2,
                    "resistance3": r3,
                    "resistance4": r4,
                    "pivot": pp,
                    "support1": s1,
                    "support2": s2,
                    "support3": s3,
                    "support4": s4,
                    "bowblow": guess

                })


            })
            .catch(error => {
                console.log(error)
            })
    }
    loadPivot()

})



app.listen(process.env.PORT || 3000)
