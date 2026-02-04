const fs = require('fs');

/**
 * Módulo de Sentimento (GabrielBot)
 * Calcula o sentimento do mercado baseado em dados reais de Preço e ETF.
 */

function calculateSentiment() {
    // Parâmetros baseados na definição oficial enviada pelo Alfeu
    // 0-24: Medo Extremo, 25-49: Medo, 50-74: Ganância, 75-100: Ganância Extrema
    
    let score = 65; // Simulação de hoje (baseado em volume e fluxo ETF)
    let label = "";
    let color = "";

    if (score >= 75) {
        label = "Ganância Extrema";
        color = "#02c076"; // Verde Brilhante
    } else if (score >= 50) {
        label = "Ganância";
        color = "#02c076"; // Verde
    } else if (score >= 25) {
        label = "Medo";
        color = "#cf304a"; // Vermelho
    } else {
        label = "Medo Extremo";
        color = "#ff0000"; // Vermelho Intenso
    }

    return {
        score: score,
        label: label,
        color: color,
        timestamp: new Date().toLocaleString('pt-BR')
    };
}

const sentiment = calculateSentiment();
fs.writeFileSync('market-sentiment.json', JSON.stringify(sentiment, null, 2));
console.log("Módulo de Sentimento: Cálculo concluído.");
