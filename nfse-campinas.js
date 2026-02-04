const fs = require('fs');

/**
 * GERADOR DE LOTE RPS v3.0 - CAMPINAS
 * AJUSTE: Formatação com Pontos e Traços conforme Nota Fiscal real.
 */

const clientes = [
    {
        cnpj: "08.563.034/0001-04",
        razaoSocial: "CLINICA BOGO E GALINDO",
        valor: 59.90,
        licencas: 1,
        mesReferencia: "JANEIRO/2026"
    },
    {
        cnpj: "49.052.533/0001-06",
        razaoSocial: "TOMADOR DO SERVIÇO",
        valor: 299.80,
        licencas: 2,
        mesReferencia: "FEVEREIRO/2026"
    }
];

function gerarXML(lista) {
    const dataEmissao = new Date().toISOString().replace(/\.\d+Z$/, ''); 
    const numeroLote = "2026002"; 
    
    let rpsItems = lista.map((c, index) => `
            <Rps>
                <InfRps Id="rps${index + 1}">
                    <IdentificacaoRps>
                        <Numero>${index + 100}</Numero>
                        <Serie>E</Serie>
                        <Tipo>1</Tipo>
                    </IdentificacaoRps>
                    <DataEmissao>${dataEmissao}</DataEmissao>
                    <NaturezaOperacao>1</NaturezaOperacao>
                    <OptanteSimplesNacional>1</OptanteSimplesNacional>
                    <IncentivadorCultural>2</IncentivadorCultural>
                    <Status>1</Status>
                    <Servico>
                        <Valores>
                            <ValorServicos>${c.valor.toFixed(2)}</ValorServicos>
                            <IssRetido>2</IssRetido>
                            <BaseCalculo>${c.valor.toFixed(2)}</BaseCalculo>
                            <Aliquota>0.00</Aliquota>
                        </Valores>
                        <ItemListaServico>17.02</ItemListaServico>
                        <CodigoCnae>821999901</CodigoCnae>
                        <Discriminacao>REFERENTE A ${c.licencas},00 LICENÇA DO IPAINEL SENHA/GUICHE NO MES DE ${c.mesReferencia}.</Discriminacao>
                        <CodigoMunicipio>3509502</CodigoMunicipio>
                    </Servico>
                    <Prestador>
                        <CpfCnpj>
                            <Cnpj>24488605000131</Cnpj>
                        </CpfCnpj>
                        <InscricaoMunicipal>003905373</InscricaoMunicipal>
                    </Prestador>
                    <Tomador>
                        <IdentificacaoTomador>
                            <CpfCnpj>
                                <Cnpj>${c.cnpj.replace(/\D/g, '')}</Cnpj>
                            </CpfCnpj>
                        </IdentificacaoTomador>
                        <RazaoSocial>${c.razaoSocial}</RazaoSocial>
                    </Tomador>
                </InfRps>
            </Rps>`).join('');

    const xmlCompleto = `<?xml version="1.0" encoding="utf-8"?>
<EnviarLoteRpsEnvio xmlns="http://www.abrasf.org.br/nfse.xsd">
    <LoteRps Id="Lote${numeroLote}" versao="2.02">
        <NumeroLote>${numeroLote}</NumeroLote>
        <CpfCnpj>
            <Cnpj>24488605000131</Cnpj>
        </CpfCnpj>
        <InscricaoMunicipal>003905373</InscricaoMunicipal>
        <QuantidadeRps>${lista.length}</QuantidadeRps>
        <ListaRps>
            ${rpsItems}
        </ListaRps>
    </LoteRps>
</EnviarLoteRpsEnvio>`;

    fs.writeFileSync('LoteRPS_Campinas.xml', xmlCompleto);
    console.log(`Sucesso: Arquivo LoteRPS_Campinas v3.0 (Lote ${numeroLote}) gerado.`);
}

gerarXML(clientes);
