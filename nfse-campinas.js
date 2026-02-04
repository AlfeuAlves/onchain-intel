const fs = require('fs');

/**
 * GERADOR DE LOTE RPS - CAMPINAS (CriptoGuia AI / iPainel)
 * Gera arquivo XML para importação em massa na prefeitura.
 */

const clientes = [
    {
        cnpj: "08563034000104",
        razaoSocial: "CLINICA BOGO E GALINDO",
        email: "contato@medclinicapicarras.com.br",
        valor: 59.90,
        licencas: 1,
        mesReferencia: "FEVEREIRO/2026"
    }
    // Adicione mais clientes aqui seguindo este padrão
];

function gerarXML(lista) {
    const dataEmissao = new Date().toISOString().split('T')[0];
    
    let rpsItems = lista.map((c, index) => `
    <Rps>
        <IdentificacaoRps>
            <Numero>${Date.now() + index}</Numero>
            <Serie>1</Serie>
            <Tipo>1</Tipo>
        </IdentificacaoRps>
        <DataEmissao>${dataEmissao}</DataEmissao>
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
            <Cnpj>24488605000131</Cnpj>
            <InscricaoMunicipal>003905373</InscricaoMunicipal>
        </Prestador>
        <Tomador>
            <IdentificacaoTomador>
                <CpfCnpj>
                    <Cnpj>${c.cnpj}</Cnpj>
                </CpfCnpj>
            </IdentificacaoTomador>
            <RazaoSocial>${c.razaoSocial}</RazaoSocial>
        </Tomador>
    </Rps>`).join('');

    const xmlCompleto = `<?xml version="1.0" encoding="utf-8"?>
<EnviarLoteRpsEnvio xmlns="http://www.abrasf.org.br/nfse.xsd">
    <LoteRps Id="Lote1">
        <NumeroLote>1</NumeroLote>
        <Cnpj>24488605000131</Cnpj>
        <InscricaoMunicipal>003905373</InscricaoMunicipal>
        <QuantidadeRps>${lista.length}</QuantidadeRps>
        <ListaRps>
            ${rpsItems}
        </ListaRps>
    </LoteRps>
</EnviarLoteRpsEnvio>`;

    fs.writeFileSync('LoteRPS_Campinas.xml', xmlCompleto);
    console.log(`Sucesso: Arquivo LoteRPS_Campinas.xml gerado com ${lista.length} notas.`);
}

gerarXML(clientes);
