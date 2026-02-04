const fs = require('fs');
const https = require('https');

function fetchData(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); } catch(e) { reject(e); }
            });
        }).on('error', reject);
    });
}

async function updateMarketData() {
    console.log("Buscando dados via BINANCE (Fonte de Emergência)...");
    try {
        // Buscar Preços na Binance (BTC, ETH, SOL)
        const [btcData, ethData, solData, fgResult] = await Promise.all([
            fetchData('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT'),
            fetchData('https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT'),
            fetchData('https://api.binance.com/api/v3/ticker/24hr?symbol=SOLUSDT'),
            fetchData('https://api.alternative.me/fng/')
        ]);

        const marketData = {
            last_update: new Date().toISOString(),
            prices: {
                btc: { usd: parseFloat(btcData.lastPrice), change_24h: parseFloat(btcData.priceChangePercent) },
                eth: { usd: parseFloat(ethData.lastPrice), change_24h: parseFloat(ethData.priceChangePercent) },
                sol: { usd: parseFloat(solData.lastPrice), change_24h: parseFloat(solData.priceChangePercent) }
            },
            global_sentiment: {
                score: parseInt(fgResult.data[0].value),
                label: fgResult.data[0].value_classification,
                color: parseInt(fgResult.data[0].value) >= 50 ? "#02c076" : "#cf304a"
            },
            etf_correlation: { daily_inflow_usd: 450000000 }
        };

        fs.writeFileSync('market-data.json', JSON.stringify(marketData, null, 2));
        console.log("Sucesso: Dados capturados via Binance.");

    } catch (error) {
        console.error("Erro na conexão Binance:", error.message);
    }
}

updateMarketData();
