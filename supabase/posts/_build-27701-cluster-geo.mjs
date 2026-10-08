/** GEO cluster ISO 27701 (Semrush): portas + respostas diretas nos pilares P0/P1. */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));

function insertAfterNesteArtigo(body, block) {
  const introEnd = body.indexOf("<p><strong>Neste artigo:</strong></p>");
  if (introEnd < 0) return null;
  const closeUl = body.indexOf("</ul>", introEnd);
  if (closeUl < 0) return null;
  let end = closeUl + "</ul>".length;
  while (end < body.length && (body[end] === "\r" || body[end] === "\n")) end += 1;
  return body.slice(0, introEnd) + block + "\n" + body.slice(end);
}

function patchImplementar() {
  const slug = "como-implementar-a-iso-27701";
  let body = readFileSync(path.join(dir, `${slug}.html`), "utf8");
  if (body.includes('id="respostas-diretas"')) {
    console.log(`${slug} já GEO`);
    return;
  }
  const block = `<div class="post-portas">
  <a href="#respostas-diretas"><strong>Respostas diretas</strong><span>9 passos, médio porte</span></a>
  <a href="#passos-27701"><strong>Passos</strong><span>Ordem numerada</span></a>
  <a href="#controlador-operador"><strong>Papéis</strong><span>Controlador e operador</span></a>
  <a href="#anexo-a"><strong>Anexo A</strong><span>A1, A2, A3</span></a>
  <a href="/certificacao-iso-27701-etapas-e-requisitos/"><strong>Certificar</strong><span>Critérios e etapas</span></a>
</div>

<h2 id="respostas-diretas">Respostas diretas: implementar ISO 27701 (médio porte)</h2>
<ul>
<li><strong>Passos:</strong> escopo, inventário de tratamentos, papéis, políticas, risco de privacidade (6.1), controles A1/A2/A3, operação com registro, auditoria interna, organismo. <a href="#passos-27701">Lista completa</a>.</li>
<li><strong>Prazo típico:</strong> cerca de <strong>6 a 12 meses</strong> até certificação, se segurança e inventário já tiverem base.</li>
<li><strong>ISO 27001 antes?</strong> <strong>Não</strong> é obrigatório desde a 27701:2025. Integrar SGSI e SGPI reduz retrabalho. <a href="/qual-a-relacao-da-iso-27001-com-a-iso-27701/">27001 e 27701</a>.</li>
<li><strong>LGPD:</strong> SGPI apoia conformidade; <strong>não substitui</strong> a lei. <a href="/iso-27701-lgpd-gdpr-conformidade/">27701 e LGPD/GDPR</a>.</li>
<li><strong>Consultoria:</strong> método e evidência; certificado vem do organismo. <a href="/consultoria-iso-27701/">Consultoria ISO 27701</a>.</li>
</ul>

`;
  const next = insertAfterNesteArtigo(body, block);
  if (!next) throw new Error(`${slug}: estrutura inesperada`);
  writeFileSync(path.join(dir, `${slug}.html`), next, "utf8");
  console.log(`${slug} GEO ok`);
}

function patchLgpd() {
  const slug = "iso-27701-lgpd-gdpr-conformidade";
  let body = readFileSync(path.join(dir, `${slug}.html`), "utf8");
  if (body.includes('id="respostas-diretas"')) {
    console.log(`${slug} já GEO`);
    return;
  }
  const block = `<div class="post-portas">
  <a href="#respostas-diretas"><strong>Respostas diretas</strong><span>LGPD, GDPR, SGPI</span></a>
  <a href="#pergunta-lgpd"><strong>Como ajuda</strong><span>Conformidade</span></a>
  <a href="#27701-vs-27001-lgpd"><strong>27001 x 27701</strong><span>Quem cobre o quê</span></a>
  <a href="/como-implementar-a-iso-27701/"><strong>Implementar</strong><span>Médio porte</span></a>
  <a href="/certificacao-iso-27701-etapas-e-requisitos/"><strong>Certificar</strong><span>Etapas</span></a>
</div>

<h2 id="respostas-diretas">Respostas diretas: ISO 27701, LGPD e GDPR</h2>
<ul>
<li><strong>Substitui a LGPD?</strong> <strong>Não.</strong> A norma organiza SGPI com tratamentos, papéis, riscos e evidência. Bases legais, titulares e ANPD continuam na lei.</li>
<li><strong>Como ajuda:</strong> inventário, controlador/operador, RIPD/DPIA quando couber, direitos do titular, incidentes, auditoria interna. <a href="#pergunta-lgpd">Detalhe</a>.</li>
<li><strong>27001:</strong> segurança da informação (art. 46 LGPD). <strong>27701:</strong> privacidade em sistema de gestão. <a href="#27701-vs-27001-lgpd">Tabela comparativa</a>.</li>
<li><strong>Certificação:</strong> prova auditada de SGPI, não selo de conformidade legal. <a href="/certificacao-iso-27701-etapas-e-requisitos/">Certificação ISO 27701</a>.</li>
<li><strong>GDPR:</strong> mesmos blocos (registro, DPA, DPIA, transferência) com evidência neutra em jurisdição.</li>
</ul>

`;
  const marker = "<h2 id=\"pergunta-lgpd\">";
  const idx = body.indexOf(marker);
  if (idx < 0) throw new Error(`${slug}: h2 pergunta-lgpd ausente`);
  body = body.slice(0, idx) + block + "\n" + body.slice(idx);
  writeFileSync(path.join(dir, `${slug}.html`), body, "utf8");
  console.log(`${slug} GEO ok`);
}

function patchConsultoria() {
  const slug = "consultoria-iso-27701";
  let body = readFileSync(path.join(dir, `${slug}.html`), "utf8");
  if (body.includes('id="respostas-diretas"')) {
    console.log(`${slug} já GEO`);
    return;
  }
  const block = `<div class="post-portas">
  <a href="#respostas-diretas"><strong>Respostas diretas</strong><span>O que faz, o que não faz</span></a>
  <a href="#faz"><strong>Entregáveis</strong><span>SGPI</span></a>
  <a href="#escolher"><strong>Como escolher</strong><span>Checklist</span></a>
  <a href="/como-implementar-a-iso-27701/"><strong>Implementar</strong><span>Passo a passo</span></a>
  <a href="/certificacao-iso-27701-etapas-e-requisitos/"><strong>Certificar</strong><span>Organismo</span></a>
</div>

<h2 id="respostas-diretas">Respostas diretas: consultoria ISO 27701</h2>
<ul>
<li><strong>O que faz:</strong> diagnóstico, escopo SGPI, inventário, risco de privacidade, controles A1/A2/A3, documentação, auditoria interna e preparação para estágios 1 e 2. <a href="#faz">Lista</a>.</li>
<li><strong>Emite certificado?</strong> <strong>Não.</strong> Certificação ISO 27701 é do organismo acreditado; consultoria e certificação são contas separadas.</li>
<li><strong>Resolve LGPD?</strong> Apoia gestão e evidência; jurídico, DPO e operação da lei ficam com a empresa. <a href="/iso-27701-lgpd-gdpr-conformidade/">27701 e LGPD</a>.</li>
<li><strong>27701 sozinha ou com 27001?</strong> Desde 2025 pode certificar só SGPI; integrar ao SGSI costuma encurtar A3 e fornecedores. <a href="#27701-sozinha">Comparativo</a>.</li>
<li><strong>Como escolher:</strong> quem também certifica, versão 2025, papéis controlador/operador, evidência de titular e incidente. <a href="#escolher">Perguntas</a>.</li>
</ul>

`;
  const next = insertAfterNesteArtigo(body, block);
  if (!next) throw new Error(`${slug}: estrutura inesperada`);
  body = next.replace(/norma=ISO%2027001/g, "norma=ISO%2027701");
  writeFileSync(path.join(dir, `${slug}.html`), body, "utf8");

  const metaPath = path.join(dir, `${slug}.meta.json`);
  const meta = JSON.parse(readFileSync(metaPath, "utf8"));
  if (!meta.faq.some((f) => f.pergunta.toLowerCase().includes("consultoria iso 27701"))) {
    meta.faq.unshift({
      pergunta: "O que uma consultoria ISO 27701 faz na prática?",
      resposta:
        "<p>Implanta ou melhora o SGPI: tratamentos, riscos, controles e preparação para auditoria. Não emite certificado. <a href=\"/consultoria-iso-27701/#faz\">Detalhe neste artigo</a>.</p>",
    });
    writeFileSync(metaPath, JSON.stringify(meta, null, 2) + "\n", "utf8");
  }
  console.log(`${slug} GEO ok`);
}

function patchRelacao() {
  const slug = "qual-a-relacao-da-iso-27001-com-a-iso-27701";
  let body = readFileSync(path.join(dir, `${slug}.html`), "utf8");
  if (!body.includes('id="respostas-diretas"')) {
    const head = `<p><strong>Resposta direta:</strong> A <strong>ISO 27001</strong> estrutura o <strong>SGSI</strong> (segurança da informação). A <strong>ISO/IEC 27701</strong> estrutura o <strong>SGPI</strong> (privacidade de dados pessoais). Até a edição de 2019 a 27701 era extensão da 27001; desde a <strong>27701:2025</strong> ela é certificável <strong>sem</strong> ISO 27001, embora integrar os dois ainda economize controles e evidências.</p>
<p>Cluster: <a href="/iso-27701-2025-o-que-muda-independencia-da-iso-27001/">ISO 27701:2025</a> · <a href="/certificacao-iso-27701-etapas-e-requisitos/">certificação</a> · <a href="/como-implementar-a-iso-27701/">implementar</a> · <a href="/iso-27701-lgpd-gdpr-conformidade/">LGPD</a> · <a href="/consultoria-iso-27701/">consultoria</a>.</p>

<div class="post-portas">
  <a href="#respostas-diretas"><strong>Respostas diretas</strong><span>SGSI x SGPI</span></a>
  <a href="#relacao-27001-27701"><strong>Relação</strong><span>Extensão e 2025</span></a>
  <a href="/iso-27701-2025-o-que-muda-independencia-da-iso-27001/"><strong>Edição 2025</strong><span>Independência</span></a>
  <a href="/como-implementar-a-iso-27701/"><strong>Implementar 27701</strong><span>Passos</span></a>
</div>

<h2 id="respostas-diretas">Respostas diretas: ISO 27001 e ISO 27701</h2>
<ul>
<li><strong>Diferença:</strong> 27001 = segurança de toda informação; 27701 = privacidade (controlador, operador, risco ao titular).</li>
<li><strong>Certificar 27701 sem 27001?</strong> <strong>Sim</strong> desde 2025. Antes, só junto com SGSI certificado.</li>
<li><strong>Privacidade:</strong> 27001 protege dados como informação; 27701 exige requisitos e Anexo A de privacidade (A1, A2, A3).</li>
<li><strong>LGPD:</strong> 27701 aproxima gestão; não substitui lei. <a href="/iso-27701-lgpd-gdpr-conformidade/">27701 e LGPD</a> · <a href="/relacao-do-lgpd-com-a-iso-27001/">LGPD e 27001</a>.</li>
<li><strong>Transição 2019→2025:</strong> prazo até cerca de <strong>2028</strong> para certificados na versão anterior. <a href="/iso-27701-2025-o-que-muda-independencia-da-iso-27001/">O que mudou</a>.</li>
</ul>

`;
    body = head + body;
    writeFileSync(path.join(dir, `${slug}.html`), body, "utf8");
  }
  body = readFileSync(path.join(dir, `${slug}.html`), "utf8");
  body = body.replace(
    "<h2>Mas afinal, qual é a relação da ISO 27001 com a ISO 27701?</h2>",
    '<h2 id="relacao-27001-27701">Mas afinal, qual é a relação da ISO 27001 com a ISO 27701?</h2>',
  );
  body = body.replace(
    /(<strong>Isso mudou na edição de 2025<\/strong>) — (a 27701 virou)/,
    "$1: $2",
  );
  writeFileSync(path.join(dir, `${slug}.html`), body, "utf8");
  console.log(`${slug} GEO ok`);
}

function patchHubLeiaMais() {
  const slug = "iso-27701-2025-o-que-muda-independencia-da-iso-27001";
  let body = readFileSync(path.join(dir, `${slug}.html`), "utf8");
  const cluster = `<h2 id="aprofunde">Cluster ISO 27701 (implementar, certificar, LGPD)</h2>
<ul>
<li><a href="/certificacao-iso-27701-etapas-e-requisitos/">Certificação ISO 27701: critérios e etapas</a></li>
<li><a href="/como-implementar-a-iso-27701/">Como implementar a ISO 27701 (médio porte)</a></li>
<li><a href="/iso-27701-lgpd-gdpr-conformidade/">ISO 27701 e LGPD/GDPR</a></li>
<li><a href="/qual-a-relacao-da-iso-27001-com-a-iso-27701/">Qual a relação da ISO 27001 com a ISO 27701?</a></li>
<li><a href="/consultoria-iso-27701/">Consultoria ISO 27701</a></li>
<li><a href="/iso-27001/">ISO 27001: o que é e como implementar</a></li>
<li><a href="/relacao-do-lgpd-com-a-iso-27001/">LGPD e ISO 27001</a></li>
</ul>
`;
  if (body.includes('id="aprofunde"')) {
    console.log("hub 27701 cluster links já ok");
    return;
  }
  body = body.replace("<h2>Leia mais</h2>\n<ul>", cluster);
  body = body.replace(/\u2014/g, ", ");
  writeFileSync(path.join(dir, `${slug}.html`), body, "utf8");
  console.log("hub 27701 cluster links ok");
}

patchImplementar();
patchLgpd();
patchConsultoria();
patchRelacao();
patchHubLeiaMais();
