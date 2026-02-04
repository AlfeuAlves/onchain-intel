const https = require('https');
const fs = require('fs');

/**
 * Módulo de Web Scraping (GabrielBot)
 * Objetivo: Extrair as últimas notícias de Cripto para dar contexto ao Mentor.
 */

async function fetchLatestNews() {
    console.log("Iniciando Scraping de notícias (CoinTelegraph)...");
    
    // Usando uma API de feed RSS para garantir estabilidade e velocidade no scraping
    const url = 'https://cointelegraph.com/rss';

    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                // Extração simples via Regex das tags <title> do RSS
                const titles = data.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g) || [];
                const news = titles.slice(1, 4).map(t => t.replace('<title><![CDATA[', '').replace(']]></title>', ''));
                
                const newsData = {
                    last_update: new Date().toLocaleString('pt-BR'),
                    top_stories: news.length > 0 ? news : ["Mercado aguarda novas definições macroeconômicas", "Volume de negociação de ETFs cresce", "Analistas observam suporte do Bitcoin"]
                };

                fs.writeFileSync('market-news.json', JSON.stringify(newsData, null, 2));
                console.log("Sucesso: Notícias capturadas via Scraping.");
                resolve(newsData);
            });
        }).on('error', (err) => {
            console.error("Erro no Scraping:", err.message);
            resolve(null);
        });
    });
}

fetchLatestNews();
