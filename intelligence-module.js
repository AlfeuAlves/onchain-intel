const fs = require('fs');

function translateTransaction(tx) {
    const { chain, value, asset } = tx;
    
    let interpretation = "";
    let sentiment = "neutro";

    if (value > 1) {
        interpretation = `Detectamos uma movimentação de ${value} ${asset}. Movimentos acima de 1 unidade indicam atividade de investidores de médio e grande porte, influenciando a liquidez do mercado.`;
        sentiment = "bullish";
    } else {
        interpretation = `Transação de ${value} ${asset} detectada na rede. O fluxo constante de pequenas transações mostra que a rede está sendo usada ativamente para pagamentos e transferências rápidas.`;
        sentiment = "neutro";
    }

    return {
        title: `Fluxo em ${asset}`,
        text: interpretation,
        sentiment: sentiment,
        timestamp: tx.timestamp || new Date().toLocaleTimeString('pt-BR')
    };
}

let rawTransactions = [];
try {
    const rawData = fs.readFileSync('raw-transactions.json', 'utf8');
    rawTransactions = JSON.parse(rawData);
} catch (e) {
    rawTransactions = [{ chain: "Bitcoin", asset: "BTC", value: 0.1, timestamp: "Sincronizando" }];
}

const insights = rawTransactions.slice(0, 3).map(translateTransaction);

fs.writeFileSync('ai-insights.json', JSON.stringify(insights, null, 2));
console.log("Inteligência atualizada para o Feed Rápido.");
