/** Pontes 27001/LGPD/consultoria → cluster ISO 27701 (Semrush fase 2). */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));

const CLUSTER = `<li><a href="/iso-27701-2025-o-que-muda-independencia-da-iso-27001/">ISO 27701:2025 (hub privacidade)</a></li>
<li><a href="/como-implementar-a-iso-27701/">Como implementar a ISO 27701</a></li>
<li><a href="/certificacao-iso-27701-etapas-e-requisitos/">Certificação ISO 27701</a></li>
<li><a href="/iso-27701-lgpd-gdpr-conformidade/">ISO 27701 e LGPD/GDPR</a></li>
<li><a href="/consultoria-iso-27701/">Consultoria ISO 27701</a></li>
<li><a href="/qual-a-relacao-da-iso-27001-com-a-iso-27701/">ISO 27001 e ISO 27701</a></li>`;

function insertAfterNesteArtigoList(body, block) {
  const introEnd = body.indexOf("<p><strong>Neste artigo:</strong></p>");
  if (introEnd < 0) return null;
  const closeUl = body.indexOf("</ul>", introEnd);
  if (closeUl < 0) return null;
  let end = closeUl + "</ul>".length;
  while (end < body.length && (body[end] === "\r" || body[end] === "\n")) end += 1;
  return body.slice(0, end) + "\n\n" + block + "\n" + body.slice(end);
}

function patchIso27001Hub() {
  const slug = "iso-27001";
  let body = readFileSync(path.join(dir, `${slug}.html`), "utf8");
  const marker = "<li><a href=\"/como-escolher-consultoria-iso/\">Como escolher consultoria</a></li>";
  if (!body.includes("/consultoria-iso-27701/")) {
    body = body.replace(
      marker,
      `${marker}\n<li><a href="/iso-27701-2025-o-que-muda-independencia-da-iso-27001/">ISO 27701:2025 (privacidade)</a></li>
<li><a href="/como-implementar-a-iso-27701/">Implementar ISO 27701</a></li>
<li><a href="/certificacao-iso-27701-etapas-e-requisitos/">Certificar ISO 27701</a></li>
<li><a href="/consultoria-iso-27701/">Consultoria ISO 27701</a></li>`,
    );
    writeFileSync(path.join(dir, `${slug}.html`), body, "utf8");
    console.log(`${slug} ponte 27701 ok`);
  } else console.log(`${slug} ponte já ok`);
}

function patchCert27001() {
  const slug = "certificacao-iso-27001-etapas-prazo-custo";
  let body = readFileSync(path.join(dir, `${slug}.html`), "utf8");
  if (!body.includes("27701:</strong>")) {
    body = body.replace(
      "<li><strong>Incidentes:</strong>",
      `<li><strong>27701 (privacidade):</strong> SGPI pode ser certificado <strong>sem</strong> 27001 desde 2025; integrar reduz retrabalho em incidentes e fornecedores. <a href="/iso-27701-2025-o-que-muda-independencia-da-iso-27001/">Hub ISO 27701</a> · <a href="/certificacao-iso-27701-etapas-e-requisitos/">certificação 27701</a>.</li>
<li><strong>Incidentes:</strong>`,
    );
  }
  if (!body.includes('id="cluster-27701"')) {
    body = body.replace(
      "<h2>Leia mais</h2>\n<ul>",
      `<h2 id="cluster-27701">Privacidade: cluster ISO 27701</h2>
<ul>
${CLUSTER}
</ul>

<h2>Leia mais</h2>
<ul>`,
    );
  }
  writeFileSync(path.join(dir, `${slug}.html`), body, "utf8");
  console.log(`${slug} ponte ok`);
}

function patchLgpd27001() {
  const slug = "relacao-do-lgpd-com-a-iso-27001";
  let body = readFileSync(path.join(dir, `${slug}.html`), "utf8");
  body = body
    .replace(/\u2014/g, ". ")
    .replace(/ — /g, ". ")
    .replace(/sobreposição \. porque/gi, "sobreposição. Porque");
  if (!body.includes('id="respostas-diretas"')) {
    const block = `<div class="post-portas">
  <a href="#respostas-diretas"><strong>Respostas diretas</strong><span>LGPD x 27001 x 27701</span></a>
  <a href="#onde-atende"><strong>Onde 27001 ajuda</strong><span>Art. 46</span></a>
  <a href="#nao-resolve"><strong>O que falta</strong><span>Legalidade</span></a>
  <a href="#27701"><strong>ISO 27701</strong><span>SGPI</span></a>
  <a href="/iso-27701-lgpd-gdpr-conformidade/"><strong>27701 e LGPD</strong><span>Conformidade</span></a>
</div>

<h2 id="respostas-diretas">Respostas diretas: LGPD, ISO 27001 e ISO 27701</h2>
<ul>
<li><strong>27001 = conformidade LGPD?</strong> <strong>Não.</strong> Cobre segurança (art. 46); não cobre base legal, titulares, encarregado, RIPD.</li>
<li><strong>Vantagem do certificado:</strong> evidência auditada de que medidas de segurança existem e operam (art. 50).</li>
<li><strong>27701:</strong> SGPI para privacidade; desde 2025 certificável <strong>sem</strong> 27001. <a href="/iso-27701-2025-o-que-muda-independencia-da-iso-27001/">ISO 27701:2025</a>.</li>
<li><strong>Programa completo:</strong> jurídico + operação LGPD; 27001 (segurança) e/ou 27701 (privacidade). <a href="/como-implementar-a-iso-27701/">Implementar 27701</a> · <a href="/consultoria-iso-27701/">Consultoria 27701</a>.</li>
<li><strong>Um inventário:</strong> ativos do SGSI e tratamentos LGPD compartilham levantamento. Evite projeto duplicado.</li>
</ul>

`;
    const next = insertAfterNesteArtigoList(body, block);
    if (!next) throw new Error(`${slug}: estrutura inesperada`);
    body = next;
  }
  if (!body.includes('id="cluster-27701-lgpd"')) {
    body = body.replace(
      "<p>Ainda assim, vale a mesma ressalva:",
      `<p><strong>Cluster ISO 27701:</strong> <a href="/como-implementar-a-iso-27701/">implementar</a> · <a href="/certificacao-iso-27701-etapas-e-requisitos/">certificar</a> · <a href="/consultoria-iso-27701/">consultoria</a> · <a href="/qual-a-relacao-da-iso-27001-com-a-iso-27701/">27001 e 27701</a>.</p>
<p id="cluster-27701-lgpd">Ainda assim, vale a mesma ressalva:`,
    );
  }
  writeFileSync(path.join(dir, `${slug}.html`), body, "utf8");
  console.log(`${slug} GEO ponte ok`);
}

function patchEscolherConsultoria() {
  const slug = "como-escolher-consultoria-iso";
  let body = readFileSync(path.join(dir, `${slug}.html`), "utf8");
  const line27701 =
    '<li><strong>ISO 27701 (privacidade / SGPI):</strong> <a href="/consultoria-iso-27701/">consultoria ISO 27701</a>, <a href="/iso-27701-2025-o-que-muda-independencia-da-iso-27001/">hub 27701:2025</a>, <a href="/como-implementar-a-iso-27701/">implementar</a>, <a href="/certificacao-iso-27701-etapas-e-requisitos/">certificação</a>, <a href="/iso-27701-lgpd-gdpr-conformidade/">LGPD e 27701</a>. Desde 2025 pode certificar só SGPI; integrar com <a href="/consultoria-iso-27001/">27001</a> reduz retrabalho.</li>';
  if (!body.includes("ISO 27701 (privacidade")) {
    body = body.replace(
      "<li><strong>ISO 27001:</strong>",
      `${line27701}\n<li><strong>ISO 27001:</strong>`,
    );
    body = body.replace(
      '<li><strong>ISO 27001:</strong> <a href="/consultoria-iso-27001/">consultoria ISO 27001</a>, <a href="/como-implementar-a-iso-27001/">como implementar</a>, <a href="/iso-27001-para-pequenas-empresas/">ISO 27001 para pequenas empresas</a>.</li>',
      '<li><strong>ISO 27001:</strong> <a href="/consultoria-iso-27001/">consultoria ISO 27001</a>, <a href="/como-implementar-a-iso-27001/">como implementar</a>, <a href="/certificacao-iso-27001-etapas-prazo-custo/">certificação: etapas e custo</a>, <a href="/iso-27001/">hub ISO 27001</a>, <a href="/iso-27001-para-pequenas-empresas/">ISO 27001 para pequenas empresas</a>, <a href="/relacao-do-lgpd-com-a-iso-27001/">LGPD e 27001</a>.</li>',
    );
    writeFileSync(path.join(dir, `${slug}.html`), body, "utf8");
    console.log(`${slug} ponte 27701 ok`);
  } else console.log(`${slug} já ok`);
}

patchIso27001Hub();
patchCert27001();
patchLgpd27001();
patchEscolherConsultoria();
