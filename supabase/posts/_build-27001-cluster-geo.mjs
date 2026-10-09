/** GEO cluster ISO 27001 (Semrush): portas + respostas nos pilares que faltavam. */
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

function insertBeforeFirstH2(body, block) {
  const idx = body.indexOf("<h2");
  if (idx < 0) return null;
  return body.slice(0, idx) + block + "\n" + body.slice(idx);
}

function patchTreinamento() {
  const slug = "treinamento-iso-27001";
  let body = readFileSync(path.join(dir, `${slug}.html`), "utf8");
  if (body.includes('id="respostas-diretas"')) {
    console.log(`${slug} já GEO`);
    return;
  }
  const block = `<div class="post-portas">
  <a href="#respostas-diretas"><strong>Respostas diretas</strong><span>ISMS, cursos, certificar</span></a>
  <a href="#recursos-iso-27001-isms"><strong>Trilha</strong><span>Ordem de estudo</span></a>
  <a href="#trilha-gratuita-blog"><strong>Blog</strong><span>Material aberto</span></a>
  <a href="/certificacao-iso-27001-etapas-prazo-custo/"><strong>Certificar empresa</strong><span>Etapas e custo</span></a>
  <a href="/iso-27001/">Hub ISO 27001</a>
</div>

<h2 id="respostas-diretas">Respostas diretas: treinamento e ISO 27001 (ISMS)</h2>
<ul>
<li><strong>Recursos recomendados:</strong> requisitos 4 a 10, ISO 27002, implementação, auditoria interna, depois curso de lead auditor se for atuar em OCP. <a href="#recursos-iso-27001-isms">Ordem completa</a>.</li>
<li><strong>Treinamento certifica a empresa?</strong> <strong>Não.</strong> Certificação exige SGSI operando + organismo acreditado. Treinamento cobre competência (7.2) e conscientização (7.3).</li>
<li><strong>ISMS / SGSI:</strong> mesmo sistema de gestão; ISMS é o termo em inglês. <a href="/iso-27001/">O que é ISO 27001</a> · <a href="/sgsi/">SGSI</a>.</li>
<li><strong>PME:</strong> trilha enxuta com escopo delimitado. <a href="/iso-27001-para-pequenas-empresas/">ISO 27001 para pequenas empresas</a>.</li>
<li><strong>Privacidade:</strong> SGPI (27701) complementa SGSI; norma independente desde 2025. <a href="/iso-27701-2025-o-que-muda-independencia-da-iso-27001/">ISO 27701:2025</a>.</li>
<li><strong>Preço da certificação:</strong> não confundir com curso; custo da empresa segue dias de auditoria (27006-1). <a href="/certificacao-iso-27001-etapas-prazo-custo/#custo">O que define o preço</a>.</li>
</ul>

`;
  const next = insertBeforeFirstH2(body, block);
  if (!next) throw new Error(`${slug}: estrutura inesperada`);
  writeFileSync(path.join(dir, `${slug}.html`), next, "utf8");
  console.log(`${slug} GEO ok`);
}

function patchConsultoria() {
  const slug = "consultoria-iso-27001";
  let body = readFileSync(path.join(dir, `${slug}.html`), "utf8");
  if (body.includes('id="respostas-diretas"')) {
    console.log(`${slug} já GEO`);
    return;
  }
  const block = `<div class="post-portas">
  <a href="#respostas-diretas"><strong>Respostas diretas</strong><span>O que faz, custo</span></a>
  <a href="#faz"><strong>Entregáveis</strong><span>SGSI</span></a>
  <a href="#escolher"><strong>Como escolher</strong><span>8 perguntas</span></a>
  <a href="/como-implementar-a-iso-27001/"><strong>Implementar</strong><span>Passo a passo</span></a>
  <a href="/certificacao-iso-27001-etapas-prazo-custo/#custo"><strong>Custo</strong><span>Consultoria x organismo</span></a>
</div>

<h2 id="respostas-diretas">Respostas diretas: consultoria ISO 27001</h2>
<ul>
<li><strong>O que faz:</strong> diagnóstico, escopo, riscos, SoA, documentação, auditoria interna e preparação para estágios 1 e 2. <a href="#faz">Lista</a>.</li>
<li><strong>Emite certificado?</strong> <strong>Não.</strong> Organismo acreditado audita; consultoria e certificação são contratos separados.</li>
<li><strong>PME:</strong> escopo enxuto e SoA proporcional; remoto é comum. <a href="#pme">Consultoria para PME</a> · <a href="/iso-27001-para-pequenas-empresas/">requisitos PME</a>.</li>
<li><strong>Quanto custa:</strong> depende de escopo, sites, maturidade e método; compare com mesmas entregáveis. <a href="#custo">Comparar propostas</a> · <a href="/certificacao-iso-27001-etapas-prazo-custo/#custo">custo da certificação</a>.</li>
<li><strong>Prazo:</strong> cerca de <strong>6 a 12 meses</strong> até certificar, se a equipe operar tempo suficiente para evidência.</li>
<li><strong>27701:</strong> consultoria de privacidade é outra linha (SGPI). <a href="/consultoria-iso-27701/">Consultoria ISO 27701</a>.</li>
</ul>

`;
  const next = insertAfterNesteArtigo(body, block);
  if (!next) throw new Error(`${slug}: estrutura inesperada`);
  writeFileSync(path.join(dir, `${slug}.html`), next, "utf8");
  console.log(`${slug} GEO ok`);
}

function patchImplementar() {
  const slug = "como-implementar-a-iso-27001";
  let body = readFileSync(path.join(dir, `${slug}.html`), "utf8");
  if (body.includes('id="respostas-diretas"')) {
    console.log(`${slug} já GEO`);
    return;
  }
  const block = `<div class="post-portas">
  <a href="#respostas-diretas"><strong>Respostas diretas</strong><span>Passos, prazo</span></a>
  <a href="#passos"><strong>11 etapas</strong><span>Ordem correta</span></a>
  <a href="#prazo"><strong>Cronograma</strong><span>O que acelera</span></a>
  <a href="/certificacao-iso-27001-etapas-prazo-custo/"><strong>Certificar</strong><span>Estágios 1 e 2</span></a>
  <a href="/consultoria-iso-27001/"><strong>Consultoria</strong><span>Quando contratar</span></a>
</div>

<h2 id="respostas-diretas">Respostas diretas: como implementar ISO 27001</h2>
<ul>
<li><strong>Passos:</strong> decisões da direção, diagnóstico, escopo, contexto, ativos, riscos, SoA, controles operando, auditoria interna, organismo. <a href="#passos">11 etapas</a>.</li>
<li><strong>Ordem:</strong> risco <strong>antes</strong> de marcar controles do Anexo A; ordem invertida gera SoA de fachada.</li>
<li><strong>Prazo:</strong> meses a ~12; gargalo é <strong>operar</strong> controles com registro, não só documentar.</li>
<li><strong>Quem faz:</strong> direção decide; TI/segurança executa; consultoria acelera método, não substitui operação. <a href="#quem">Quem faz o quê</a>.</li>
<li><strong>Certificação iso 27001 preço:</strong> implantação (interno/consultoria) + dias de auditoria (27006-1), contas separadas. <a href="/certificacao-iso-27001-etapas-prazo-custo/#custo">Detalhe de custo</a>.</li>
<li><strong>27701:</strong> pode integrar privacidade depois ou em paralelo. <a href="/como-implementar-a-iso-27701/">Implementar ISO 27701</a>.</li>
</ul>

`;
  const next = insertAfterNesteArtigo(body, block);
  if (!next) throw new Error(`${slug}: estrutura inesperada`);
  writeFileSync(path.join(dir, `${slug}.html`), next, "utf8");
  console.log(`${slug} GEO ok`);
}

function patchPme() {
  const slug = "iso-27001-para-pequenas-empresas";
  let body = readFileSync(path.join(dir, `${slug}.html`), "utf8");
  if (body.includes('id="respostas-diretas"')) {
    console.log(`${slug} já GEO`);
    return;
  }
  const block = `<div class="post-portas">
  <a href="#respostas-diretas"><strong>Respostas diretas</strong><span>PME, escopo, SoA</span></a>
  <a href="#requisitos-chave-pme"><strong>Requisitos</strong><span>4 a 10 na prática</span></a>
  <a href="#escopo-soa"><strong>Escopo enxuto</strong><span>SoA proporcional</span></a>
  <a href="/certificacao-iso-27001-etapas-prazo-custo/#custo"><strong>Custo</strong><span>Escopo e auditoria</span></a>
</div>

<h2 id="respostas-diretas">Respostas diretas: ISO 27001 em pequenas empresas</h2>
<ul>
<li><strong>Existe ISO light?</strong> <strong>Não.</strong> Mesmos requisitos; diferença é escopo delimitado e evidência proporcional.</li>
<li><strong>Requisitos-chave:</strong> contexto/escopo, riscos/SoA, pessoas, operação (backup, acesso), auditoria interna. <a href="#requisitos-chave-pme">Lista</a>.</li>
<li><strong>Custo:</strong> escopo estreito reduz dias de auditoria; escopo largo “para impressionar” encarece. <a href="/certificacao-iso-27001-etapas-prazo-custo/#custo">27006-1 e escopo</a>.</li>
<li><strong>Consultoria remota:</strong> funciona com dono interno e evidência digital. <a href="/consultoria-iso-27001/#pme">Consultoria PME</a>.</li>
<li><strong>Treinamento:</strong> conscientização por função, não curso nos 93 controles. <a href="/treinamento-iso-27001/">Recursos ISO 27001</a>.</li>
</ul>

`;
  const next = insertAfterNesteArtigo(body, block);
  if (!next) throw new Error(`${slug}: estrutura inesperada`);
  writeFileSync(path.join(dir, `${slug}.html`), next, "utf8");
  console.log(`${slug} GEO ok`);
}

function patchAuditoria() {
  const slug = "auditoria-iso-27001";
  let body = readFileSync(path.join(dir, `${slug}.html`), "utf8");
  if (body.includes('id="respostas-diretas"')) {
    console.log(`${slug} já GEO`);
    return;
  }
  const block = `<div class="post-portas">
  <a href="#respostas-diretas"><strong>Respostas diretas</strong><span>Interna x certificação</span></a>
  <a href="#interna"><strong>Auditoria interna</strong><span>Requisito 9.2</span></a>
  <a href="#pede"><strong>O que pedem</strong><span>Cláusulas 4 a 10</span></a>
  <a href="/certificacao-iso-27001-etapas-prazo-custo/#fases"><strong>Estágios 1 e 2</strong><span>Organismo</span></a>
</div>

<h2 id="respostas-diretas">Respostas diretas: auditoria ISO 27001</h2>
<ul>
<li><strong>Tipos:</strong> interna (obrigatória antes de certificar), segunda parte (cliente/fornecedor), certificação (estágios 1 e 2), manutenção no ciclo de 3 anos. <a href="#tipos">Quatro tipos</a>.</li>
<li><strong>Auditoria interna:</strong> programa, critério, competência, imparcialidade, relatório com achados. <a href="#interna">Como fazer</a>.</li>
<li><strong>Estágio 2:</strong> pergunta vira “mostre a última vez que isso aconteceu”; controle sem registro gera NC.</li>
<li><strong>Preço:</strong> custo da certificação segue dias de auditoria; interna é custo de equipe ou auditor contratado. <a href="/certificacao-iso-27001-etapas-prazo-custo/#custo">Custo certificação</a>.</li>
<li><strong>Checklist:</strong> <a href="/checklist-preparacao-auditoria-interna-iso/">preparação auditoria interna</a>.</li>
</ul>

`;
  const next = insertAfterNesteArtigo(body, block);
  if (!next) throw new Error(`${slug}: estrutura inesperada`);
  writeFileSync(path.join(dir, `${slug}.html`), next, "utf8");
  console.log(`${slug} GEO ok`);
}

function patchCertificacaoClusterLinks() {
  const slug = "certificacao-iso-27001-etapas-prazo-custo";
  let body = readFileSync(path.join(dir, `${slug}.html`), "utf8");
  body = body.replace(
    /estágio 1: ,/g,
    "estágio 1, ",
  );
  if (!body.includes('id="cluster-27701"')) {
    const block = `<h2 id="cluster-27701">Privacidade: cluster ISO 27701</h2>
<ul>
<li><a href="/iso-27701-2025-o-que-muda-independencia-da-iso-27001/">ISO 27701:2025 (hub privacidade)</a></li>
<li><a href="/como-implementar-a-iso-27701/">Como implementar a ISO 27701</a></li>
<li><a href="/certificacao-iso-27701-etapas-e-requisitos/">Certificação ISO 27701</a></li>
<li><a href="/quanto-custa-iso-27701/">Quanto custa a ISO 27701</a></li>
<li><a href="/iso-27701-lgpd-gdpr-conformidade/">ISO 27701 e LGPD/GDPR</a></li>
<li><a href="/consultoria-iso-27701/">Consultoria ISO 27701</a></li>
<li><a href="/qual-a-relacao-da-iso-27001-com-a-iso-27701/">ISO 27001 e ISO 27701</a></li>
</ul>

`;
    body = body.replace("<h2>Leia mais</h2>", block + "<h2>Leia mais</h2>");
  }
  const respostasMarker = '<h2 id="respostas-diretas">Respostas diretas: certificação ISO 27001</h2>\n<ul>';
  if (body.includes(respostasMarker) && !body.includes("27701 (privacidade)")) {
    body = body.replace(
      "</ul>\n\n<h2 id=\"passos-e-prazo-certificacao\">",
      `<li><strong>Preço certificação iso 27001:</strong> sem tabela única; organismo cobra por dias (ISO/IEC 27006-1) e implantação soma horas internas e consultoria. Faixas citadas em mercado variam muito com escopo. <a href="#custo">Detalhe</a>.</li>
<li><strong>27701 (privacidade):</strong> SGPI certificável <strong>sem</strong> 27001 desde 2025; integrar reduz retrabalho. <a href="/iso-27701-2025-o-que-muda-independencia-da-iso-27001/">Hub ISO 27701</a> · <a href="/certificacao-iso-27701-etapas-e-requisitos/">certificação 27701</a> · <a href="/quanto-custa-iso-27701/">custo 27701</a>.</li>
</ul>

<h2 id="passos-e-prazo-certificacao">`,
    );
  }
  writeFileSync(path.join(dir, `${slug}.html`), body, "utf8");
  console.log(`${slug} cluster/correções ok`);
}

patchTreinamento();
patchConsultoria();
patchImplementar();
patchPme();
patchAuditoria();
patchCertificacaoClusterLinks();
