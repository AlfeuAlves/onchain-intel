const http = require('http');
const fs = require('fs');

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    if (req.method === 'POST' && req.url === '/ask') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { question } = JSON.parse(body);
                const q = question.toLowerCase();
                
                // LER DADOS REAIS E NOTÍCIAS
                let prices = { btc: 102540, eth: 2755, sol: 100 };
                let news = "Sem notícias recentes no momento.";
                try {
                    const market = JSON.parse(fs.readFileSync('market-data.json', 'utf8'));
                    prices = { btc: market.prices.btc.usd, eth: market.prices.eth.usd, sol: market.prices.sol.usd };
                    
                    if (fs.existsSync('market-news.json')) {
                        const newsData = JSON.parse(fs.readFileSync('market-news.json', 'utf8'));
                        news = newsData.top_stories.join(" | ");
                    }
                } catch(e) {}

                let answer = "";
                if (q.includes("acontece") || q.includes("noticia") || q.includes("notícia") || q.includes("novidade")) {
                    answer = `Acabei de ler no CoinTelegraph as seguintes notícias: ${news}. O mercado está agitado e esses fatos explicam parte da volatilidade de hoje.`;
                } else if (q.includes("brother") || q.includes("fala") || q.includes("opa")) {
                    answer = "Fala, meu brother Alfeu! Tudo na paz por aqui, monitorando as baleias pra você. E com você, como estão as coisas?";
                } else if (q.includes("tudo bem") || q.includes("como vai") || q.includes("contigo")) {
                    answer = "Tudo ótimo, Alfeu! Melhor agora conversando com você. O mercado está tenso (Índice 17), mas eu sigo firme aqui no posto.";
                } else if (q.includes("solana") || q.includes("sol")) {
                    answer = `A Solana está em $${prices.sol.toLocaleString()}. É o destaque do momento, mesmo com o pânico geral ela segura a onda.`;
                } else if (q.includes("btc") || q.includes("bitcoin")) {
                    answer = `O Bitcoin está em $${prices.btc.toLocaleString()}. O índice 17 assusta o leigo, mas pro investidor sério como você, é hora de observar o fluxo.`;
                } else if (q.includes("vale a pena") || q.includes("comprar")) {
                    answer = "Como seu Mentor, não posso dar dica de compra, mas olha o índice: 17 (Medo Extremo). Historicamente, comprar no pânico deu bons frutos, mas cautela sempre!";
                } else {
                    answer = "Entendi sua dúvida, Alfeu. Nesse momento de Medo Extremo, o segredo é olhar os fundamentos que mostrei nas páginas internas. Quer falar sobre alguma moeda específica?";
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ answer }));
            } catch (e) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ answer: "Fala Alfeu! Tive um soluço, mas já estou de pé. Como posso te ajudar?" }));
            }
        });
    }
});

server.listen(8083, () => console.log("Cérebro Híbrido v6 Ativo."));
