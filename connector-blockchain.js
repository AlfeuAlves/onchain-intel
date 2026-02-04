const fs = require('fs');
const https = require('https');

/**
 * Módulo 4.2 - Connector (Blockchain.com API)
 * Busca transações reais da rede Bitcoin em tempo real.
 */

function fetchBitcoinTxs() {
    return new Promise((resolve, reject) => {
        // Endpoint que retorna as últimas transações do Bitcoin
        https.get('https://blockchain.info/unconfirmed-transactions?format=json', (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(new Error("Erro ao processar JSON do Bitcoin"));
                }
            });
        }).on('error', (err) => reject(err));
    });
}

async function syncRealTransactions() {
    console.log("Conectando à rede Bitcoin para capturar transações reais...");
    try {
        const result = await fetchBitcoinTxs();
        const txs = result.txs || [];

        // Captura agressiva para dinamismo (Solicitação do Alfeu)
        // Pegamos as últimas 15 transações independente do valor para manter o feed "vivo"
        const displayTxs = txs.slice(0, 15).map(tx => {
             const totalSatoshis = tx.out.reduce((acc, out) => acc + out.value, 0);
             const valueBTC = (totalSatoshis / 100000000).toFixed(6);
             return {
                chain: "Bitcoin",
                asset: "BTC",
                value: parseFloat(valueBTC),
                hash: tx.hash.substring(0, 8) + "...",
                timestamp: new Date().toLocaleTimeString('pt-BR') // Apenas hora para dinamismo
            };
        });

        fs.writeFileSync('raw-transactions.json', JSON.stringify(displayTxs, null, 2));
        console.log(`Sucesso: ${displayTxs.length} transações reais capturadas.`);

    } catch (error) {
        console.error("Erro na conexão on-chain:", error.message);
    }
}

syncRealTransactions();
