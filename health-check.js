const https = require('https');
const fs = require('fs');

/**
 * Módulo de Diagnóstico (GabrielBot)
 * Verifica a saúde das APIs externas usadas pelo sistema.
 */

function checkHealth(name, url) {
    return new Promise((resolve) => {
        const start = Date.now();
        const req = https.get(url, (res) => {
            resolve({
                name: name,
                status: res.statusCode === 200 ? "ONLINE" : "OFFLINE",
                latency: `${Date.now() - start}ms`,
                last_check: new Date().toLocaleString('pt-BR')
            });
        });

        req.on('error', () => {
            resolve({ name: name, status: "OFFLINE", latency: "N/A", last_check: new Date().toLocaleString('pt-BR') });
        });

        req.setTimeout(3000, () => {
            req.destroy();
            resolve({ name: name, status: "OFFLINE", latency: "Timeout", last_check: new Date().toLocaleString('pt-BR') });
        });
    });
}

async function runHealthCheck() {
    console.log("Iniciando Diagnóstico do Sistema...");
    
    const results = await Promise.all([
        checkHealth("Binance API", "https://api.binance.com/api/v3/ping"),
        checkHealth("Alternative.me", "https://api.alternative.me/fng/"),
        checkHealth("Blockchain.info", "https://blockchain.info/unconfirmed-transactions?format=json"),
        checkHealth("BlockCypher", "https://api.blockcypher.com/v1/eth/main")
    ]);

    fs.writeFileSync('health-status.json', JSON.stringify(results, null, 2));
    console.log("Diagnóstico concluído e salvo em health-status.json");
}

runHealthCheck();
