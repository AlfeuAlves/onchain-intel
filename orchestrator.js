const { exec } = require('child_process');

/**
 * Módulo Orquestrador (GabrielBot)
 * Executa todos os conectores e módulos de inteligência em sequência.
 */

function runCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erro ao executar ${command}:`, error.message);
                return resolve(); // Continua para o próximo mesmo com erro
            }
            console.log(`Sucesso [${command}]:`, stdout.trim());
            resolve();
        });
    });
}

async function runUpdateCycle() {
    console.log(`--- Iniciando Ciclo de Atualização: ${new Date().toLocaleString()} ---`);
    
    // 0. Diagnóstico de Saúde
    await runCommand('node health-check.js');

    // 0.1 Scraping de Notícias
    await runCommand('node news-scraper.js');

    // 1. Buscar Preços e Índice Global
    await runCommand('node connector-market.js');
    
    // 2. Buscar Transações Reais (Blockchain)
    await runCommand('node connector-blockchain.js');
    await runCommand('node connector-ethereum.js');
    await runCommand('node connector-eth-stats.js');
    await runCommand('node connector-solana.js');
    
    // 3. Gerar Insights da IA
    await runCommand('node intelligence-module.js');
    
    // 4. Calcular Sentimento dos Ativos
    await runCommand('node sentiment-module.js');

    console.log("--- Ciclo de Atualização Concluído ---");
}

// Execução imediata ao iniciar
runUpdateCycle();
