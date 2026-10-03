#!/usr/bin/env node
/**
 * Retrofit GEO/IA cluster ISO 27001 + 27701 (out/2026). Lê *-export-temp.json.
 *   node supabase/posts/_build-iso-27001-geo-ia.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const BACKUP = path.join(AQUI, "../backup");

function load(slug) {
  const p = path.join(BACKUP, `${slug}-export-temp.json`);
  if (!existsSync(p)) throw new Error(`Export: node _export-slug.mjs ${slug}`);
  return JSON.parse(readFileSync(p, "utf8"));
}

function writePost(slug, html, meta) {
  writeFileSync(path.join(AQUI, `${slug}.html`), html, "utf8");
  writeFileSync(path.join(AQUI, `${slug}.meta.json`), JSON.stringify(meta, null, 1) + "\n", "utf8");
  console.log("written", slug, html.length);
}

function mergeFaq(existing, additions) {
  const faq = [...(existing || [])];
  for (const item of additions) {
    if (!faq.some((f) => f.pergunta === item.pergunta)) faq.push(item);
  }
  return faq;
}

const SLUG_PME = "iso-27001-para-pequenas-empresas";
const SLUG_IMPL27701 = "como-implementar-a-iso-27701";
const SLUG_CERT27701 = "certificacao-iso-27701-etapas-e-requisitos";

function patchHub(row) {
  let content = row.content;
  if (!content.includes('id="certificacao-normas-sgsi"')) {
    const tocExtra = `<li><a href="#certificacao-normas-sgsi">Certificação e normas SGSI</a></li>
<li><a href="#pequenas-empresas">ISO 27001 para pequenas empresas</a></li>
<li><a href="#iso-27001-vs-mercado">ISO 27001 vs outras normas</a></li>
`;
    content = content.replace(
      "<li><a href=\"#o-que-e\">O que é a ISO 27001?</a></li>\n",
      tocExtra + "<li><a href=\"#o-que-e\">O que é a ISO 27001?</a></li>\n",
    );
    const geo = `
<div class="post-portas">
  <a href="#certificacao-normas-sgsi"><strong>Certificação SGSI</strong><span>O que é certificação ISO 27001 e a norma</span></a>
  <a href="#pequenas-empresas"><strong>Pequenas empresas</strong><span>Requisitos-chave com escopo enxuto</span></a>
  <a href="/certificacao-iso-27001-etapas-prazo-custo/"><strong>Passos e prazo</strong><span>Do diagnóstico ao certificado</span></a>
</div>

<h2 id="certificacao-normas-sgsi">ISO 27001 certificação e normas de segurança da informação</h2>
<p><strong>Certificação ISO 27001</strong> é a auditoria independente que comprova que o <strong>Sistema de Gestão da Segurança da Informação (SGSI)</strong>, também chamado <strong>ISMS</strong> em inglês, atende à <strong>ISO/IEC 27001:2022</strong> (no Brasil, <strong>ABNT NBR ISO/IEC 27001</strong>). A norma define requisitos nas cláusulas 4 a 10; o Anexo A traz 93 controles escolhidos via riscos e Declaração de Aplicabilidade (SoA).</p>
<p>Passos, prazo e custo: <a href="/certificacao-iso-27001-etapas-prazo-custo/">certificação ISO 27001: etapas, prazo e custo</a>. Implementação: <a href="/como-implementar-a-iso-27001/">como implementar a ISO 27001</a>. Privacidade: <a href="/iso-27701-2025-o-que-muda-independencia-da-iso-27001/">ISO 27701:2025</a>.</p>

<h2 id="pequenas-empresas">Requisitos-chave da ISO 27001 em pequenas empresas</h2>
<p>PME não escapa das cláusulas 4 a 10, mas o <strong>escopo</strong> e a <strong>SoA</strong> podem ser enxutos: menos sites, menos processos, controles proporcionais ao risco real. O erro é copiar pacote de enterprise ou tratar segurança só como firewall.</p>
<p>Guia dedicado: <a href="/${SLUG_PME}/">ISO 27001 para pequenas empresas</a>. Detalhe cláusula a cláusula: <a href="/requisitos-da-iso-27001/">requisitos da ISO 27001</a>.</p>

<h2 id="iso-27001-vs-mercado">Qual a diferença entre ISO 27001 e outras normas de segurança da informação?</h2>
<p><strong>ISO/IEC 27001</strong> é norma <strong>certificável</strong> de SGSI (gestão + risco + melhoria). Outros referenciais do mercado:</p>
<ul>
<li><strong>ISO/IEC 27002</strong>: guia de controles; não gera certificado. Veja <a href="/iso-27001-e-iso-27002/">ISO 27001 e ISO 27002</a>.</li>
<li><strong>SOC 2</strong> (AICPA): relatório de auditoria sobre critérios de serviço (muito usado em SaaS nos EUA); não é a mesma estrutura de cláusulas 4 a 10.</li>
<li><strong>NIST CSF / ISO 27032</strong>: frameworks de referência; costumam apoiar, não substituir, um SGSI certificável.</li>
<li><strong>ISO/IEC 27701</strong>: privacidade (PIMS/SGPI), hoje norma independente. <a href="/qual-a-relacao-da-iso-27001-com-a-iso-27701/">27001 e 27701</a>.</li>
</ul>
<p>A escolha depende do que o cliente ou edital pede: muitos contratos B2B no Brasil citam <strong>certificação ISO 27001</strong>; mercado americano pode pedir SOC 2. É possível alinhar controles, mas são evidências diferentes.</p>
<p class="post-aprofunde"><strong>Aprofunde:</strong> <a href="/treinamento-iso-27001/">Treinamento e recursos ISO 27001</a> · <a href="/${SLUG_IMPL27701}/">Implementar ISO 27701</a></p>
`;
    content = content.replace("</ul>\n<h2 id=\"o-que-e\">", `</ul>\n${geo}\n<h2 id="o-que-e">`);
  }

  const faq = mergeFaq(row.faq, [
    {
      pergunta: "ISO 27001 certificação e normas de segurança da informação: o que é?",
      resposta:
        "<p>É o par norma + certificado: a <strong>ISO/IEC 27001:2022</strong> define o SGSI (ISMS); a <strong>certificação</strong> é a auditoria de organismo acreditado que confirma o atendimento. Controles do Anexo A entram via riscos e SoA. <a href=\"#certificacao-normas-sgsi\">Resumo neste guia</a>.</p>",
    },
    {
      pergunta: "Quais são os requisitos-chave da ISO 27001 e como eles se aplicam a pequenas empresas?",
      resposta: `<p>Requisitos-chave: contexto e escopo (4), liderança (5), riscos e SoA (6), competência e conscientização (7), operação incluindo controles (8), auditoria interna e análise crítica (9), melhoria (10). Em PME, escopo focado e SoA proporcional. <a href="/${SLUG_PME}/">ISO 27001 para pequenas empresas</a>.</p>`,
    },
    {
      pergunta: "Qual é a diferença entre ISO 27001 e outras normas de segurança da informação no mercado?",
      resposta:
        "<p>27001 é SGSI certificável (cláusulas 4 a 10). 27002 orienta controles; SOC 2 é relatório AICPA; NIST CSF é framework. 27701 cobre privacidade. <a href=\"#iso-27001-vs-mercado\">Comparativo neste artigo</a>.</p>",
    },
    {
      pergunta: "Quais são os passos para obter a certificação ISO 27001 e quanto tempo costuma levar?",
      resposta:
        "<p>Diagnóstico, escopo, riscos, SoA, operação com evidência, auditoria interna, análise crítica, estágios 1 e 2 do organismo. Prazo típico: meses a ~1 ano conforme maturidade. <a href=\"/certificacao-iso-27001-etapas-prazo-custo/\">Etapas, prazo e custo</a>.</p>",
    },
    {
      pergunta: "Pode recomendar recursos ou treinamentos para entender ISO 27001 e ISMS?",
      resposta:
        "<p>Comece pela norma (requisitos 4 a 10), depois guia de controles 27002 e prática de risco/SoA. Treinamento de equipe e auditor interno acelera. <a href=\"/treinamento-iso-27001/\">Recursos e treinamento ISO 27001</a>.</p>",
    },
  ]);

  writePost("iso-27001", content, {
    title: row.title,
    seo_title: row.seo_title || "ISO 27001: certificação, SGSI, requisitos e como certificar",
    seo_description:
      "ISO 27001 certificação e normas de segurança da informação: SGSI (ISMS), requisitos 2022, passos, prazo, PME, diferença para 27701 e frameworks do mercado.",
    tldr:
      "Certificação ISO 27001 comprova o SGSI (ISMS) conforme ISO/IEC 27001:2022. Requisitos nas cláusulas 4 a 10; controles via riscos e SoA. PME usa escopo enxuto. Passos e prazo: artigo dedicado. 27701 cobre privacidade; SOC 2 e NIST são outros referenciais.",
    faq,
  });
}

function patchCert27001(row) {
  let content = row.content;
  if (!content.includes('id="passos-e-prazo-certificacao"')) {
    const block = `
<h2 id="passos-e-prazo-certificacao">Quais são os passos para obter a certificação ISO 27001 e quanto tempo leva?</h2>
<ol>
<li>Definir escopo do SGSI e patrocínio da direção.</li>
<li>Avaliação de riscos e Declaração de Aplicabilidade (SoA).</li>
<li>Implementar controles e operar com registros (incidentes, acessos, backup).</li>
<li>Auditoria interna e análise crítica pela direção.</li>
<li>Contratar organismo acreditado: estágio 1 (documentação) e estágio 2 (evidência).</li>
<li>Tratar não conformidades e receber certificado (ciclo de 3 anos).</li>
</ol>
<p>Prazo realista: cerca de <strong>6 a 12 meses</strong> para a primeira certificação na maioria das PME, podendo passar de 12 meses em escopos complexos. Hub: <a href="/iso-27001/">ISO 27001</a>.</p>
`;
    content = content.replace(/<h2[^>]*>/, block + "\n$&");
  }
  const faq = mergeFaq(row.faq, [
    {
      pergunta: "Quais são os passos para obter a certificação ISO 27001 e quanto tempo costuma levar?",
      resposta:
        "<p>Escopo, riscos, SoA, operação, auditoria interna, estágios 1 e 2. Prazo usual de meses a um ano. Detalhe: <a href=\"#passos-e-prazo-certificacao\">passos e prazo neste artigo</a>.</p>",
    },
    {
      pergunta: "Quanto custa a certificação ISO 27001?",
      resposta:
        "<p>Combina implantação (interno/consultoria) e auditoria do organismo (dias conforme escopo). Veja seção de custo neste artigo e <a href=\"/iso-27001/#preco\">preço no hub</a>.</p>",
    },
  ]);
  writePost("certificacao-iso-27001-etapas-prazo-custo", content, {
    title: row.title,
    seo_title: "Certificação ISO 27001: passos, prazo e custo",
    seo_description:
      "Passos para obter a certificação ISO 27001, quanto tempo leva, estágios 1 e 2 e o que define o custo do SGSI.",
    tldr: row.tldr,
    faq,
  });
}

function patchRequisitos(row) {
  const faq = mergeFaq(row.faq, [
    {
      pergunta: "Quais são os requisitos-chave da ISO 27001 para pequenas empresas?",
      resposta: `<p>As mesmas cláusulas 4 a 10, com escopo e SoA proporcionais. Foco em ativos críticos, fornecedores relevantes e evidência simples. <a href="/${SLUG_PME}/">Guia PME</a>.</p>`,
    },
  ]);
  writePost("requisitos-da-iso-27001", row.content, {
    title: row.title,
    seo_title: row.seo_title,
    seo_description: row.seo_description,
    tldr: row.tldr,
    faq,
  });
}

function patchTreinamento(row) {
  let content = row.content;
  if (!content.includes('id="recursos-iso-27001-isms"')) {
    const block = `
<h2 id="recursos-iso-27001-isms">Melhores recursos para entender ISO 27001 e ISMS (SGSI)</h2>
<p>Ordem que funciona na prática:</p>
<ol>
<li>Ler o mapa das <strong>cláusulas 4 a 10</strong> (<a href="/requisitos-da-iso-27001/">requisitos ISO 27001</a>).</li>
<li>Estudar riscos, SoA e Anexo A com apoio da <a href="/iso-27001-e-iso-27002/">ISO 27002</a>.</li>
<li>Percorrer o <a href="/como-implementar-a-iso-27001/">passo a passo de implementação</a>.</li>
<li>Capacitar auditor interno e conscientização (7.2 e 7.3).</li>
<li>Só depois considerar curso de auditor de certificação, se for atuar em OCP.</li>
</ol>
<p>Hub completo: <a href="/iso-27001/">ISO 27001</a>.</p>
`;
    content = block + content;
  }
  const faq = mergeFaq(row.faq, [
    {
      pergunta: "Pode recomendar recursos ou treinamentos para entender ISO 27001 e ISMS?",
      resposta:
        "<p>Comece pelos requisitos 4 a 10, implementação prática e treinamento da equipe. <a href=\"#recursos-iso-27001-isms\">Lista neste artigo</a>.</p>",
    },
  ]);
  writePost("treinamento-iso-27001", content, {
    title: "Treinamento ISO 27001: recursos, ISMS e competência no SGSI",
    seo_title: "Recursos e treinamento ISO 27001 (SGSI / ISMS)",
    seo_description:
      "Recursos e treinamentos para entender ISO 27001 e ISMS: requisitos, implementação, auditor interno e ordem de estudo.",
    tldr:
      "Para aprender ISO 27001 e ISMS: requisitos 4 a 10, riscos/SoA, implementação prática, conscientização e auditoria interna antes de curso de lead auditor.",
    faq,
  });
}

function patch27701(row) {
  let content = row.content;
  const lead = `<p><strong>Resposta direta:</strong> A <strong>ISO/IEC 27701:2025</strong> é a norma de <strong>Sistema de Gestão de Privacidade da Informação (SGPI / PIMS)</strong>. Desde a edição 2025 ela pode ser usada de forma <strong>independente</strong> da ISO 27001, embora muitas empresas integrem segurança e privacidade. Implementação: <a href="/${SLUG_IMPL27701}/">como implementar a ISO 27701</a>. Certificação: <a href="/${SLUG_CERT27701}/">certificação ISO 27701</a>.</p>\n`;
  if (!content.includes("Resposta direta")) {
    content = content.replace(/^(<p>)/, lead + "$1");
  }
  const faq = mergeFaq(row.faq, [
    {
      pergunta: "ISO 27701 - Privacidade de Dados: o que é?",
      resposta:
        "<p>Norma internacional para SGPI (PIMS): requisitos para tratar dados pessoais como controlador e/ou operador. Edição 2025 independente da 27001. <a href=\"/qual-a-relacao-da-iso-27001-com-a-iso-27701/\">Relação com 27001</a>.</p>",
    },
    {
      pergunta: "Quais são os passos práticos para implementar a ISO 27701 em uma empresa de médio porte?",
      resposta: `<p>Gap de privacidade, papéis controlador/operador, mapeamento de tratamentos, base legal, DPIA quando couber, controles do SGPI, integração com SGSI se houver. <a href="/${SLUG_IMPL27701}/">Passo a passo ISO 27701</a>.</p>`,
    },
    {
      pergunta: "Quais são os critérios e etapas para obter a certificação ISO 27701?",
      resposta: `<p>SGPI implementado, evidências, auditoria interna e auditoria de organismo no escopo 27701 (sozinho ou integrado). <a href="/${SLUG_CERT27701}/">Etapas de certificação ISO 27701</a>.</p>`,
    },
  ]);
  writePost("iso-27701-2025-o-que-muda-independencia-da-iso-27001", content, {
    title: row.title,
    seo_title: "ISO 27701:2025, privacidade e certificação",
    seo_description:
      "ISO 27701 privacidade de dados: o que mudou em 2025, relação com ISO 27001, implementação e certificação.",
    tldr: row.tldr,
    faq,
  });
}

function patchLgpd(row) {
  const faq = mergeFaq(row.faq, [
    {
      pergunta: "Como a ISO 27701 ajuda na conformidade com LGPD e GDPR?",
      resposta:
        "<p>A 27701 organiza o SGPI (papéis, tratamentos, controles de privacidade). Não substitui a lei, mas estrutura evidência alinhada a LGPD/GDPR. 27001 cobre segurança da informação. <a href=\"/iso-27701-2025-o-que-muda-independencia-da-iso-27001/\">ISO 27701</a> · <a href=\"/qual-a-relacao-da-iso-27001-com-a-iso-27701/\">27001 e 27701</a>.</p>",
    },
  ]);
  writePost("relacao-do-lgpd-com-a-iso-27001", row.content, {
    title: row.title,
    seo_title: row.seo_title,
    seo_description: row.seo_description,
    tldr: row.tldr,
    faq,
  });
}

function patchRelacao27701(row) {
  const faq = mergeFaq(row.faq, [
    {
      pergunta: "Qual é a relação entre ISO 27701 e ISO 27001 no âmbito de gestão de privacidade?",
      resposta:
        "<p>27001 estrutura o SGSI; 27701 acrescenta requisitos de privacidade (SGPI). Desde 2025 a 27701 pode ser certificada de forma independente. Muitas empresas mantêm os dois sistemas integrados.</p>",
    },
  ]);
  writePost("qual-a-relacao-da-iso-27001-com-a-iso-27701", row.content, {
    title: row.title,
    seo_title: row.seo_title,
    seo_description: row.seo_description,
    tldr: row.tldr,
    faq,
  });
}

function buildNewArticles() {
  writePost(
    SLUG_PME,
    `<p><strong>ISO 27001 para pequenas empresas</strong> usa os mesmos requisitos da norma (cláusulas 4 a 10), mas com <strong>escopo delimitado</strong>, <strong>SoA enxuta</strong> e evidências proporcionais. Não existe “ISO 27001 light” certificável: existe SGSI do tamanho do negócio.</p>
<p>Hub: <a href="/iso-27001/">ISO 27001</a> · Requisitos: <a href="/requisitos-da-iso-27001/">cláusulas 4 a 10</a> · Certificação: <a href="/certificacao-iso-27001-etapas-prazo-custo/">passos e prazo</a>.</p>
<p><strong>Neste artigo:</strong></p>
<ul>
<li><a href="#requisitos-chave-pme">Requisitos-chave na prática</a></li>
<li><a href="#escopo-soa">Escopo e SoA enxutos</a></li>
<li><a href="#erros-pme">Erros comuns em PME</a></li>
</ul>
<h2 id="requisitos-chave-pme">Quais são os requisitos-chave da ISO 27001 em pequenas empresas?</h2>
<ul>
<li><strong>4 Contexto e escopo:</strong> um serviço ou unidade por vez, não “a empresa inteira” sem necessidade.</li>
<li><strong>6 Riscos e SoA:</strong> poucos ativos críticos bem tratados valem mais que planilha genérica.</li>
<li><strong>7 Pessoas:</strong> conscientização e competência (senha, phishing, incidentes).</li>
<li><strong>8 Operação:</strong> backup, acesso, fornecedores relevantes.</li>
<li><strong>9 Avaliação:</strong> auditoria interna curta porém real.</li>
</ul>
<h2 id="escopo-soa">Escopo e Declaração de Aplicabilidade enxutos</h2>
<p>Defina o que entra no certificado (produto, SaaS, filial). Fora do escopo fica explícito. A SoA lista controles do Anexo A aplicáveis, com justificativa. PME certifica com dezenas de controles bem operados, não com 93 marcados sem evidência.</p>
<h2 id="erros-pme">Erros que atrasam PME na certificação</h2>
<ul>
<li>Comprar ferramenta antes do risco.</li>
<li>Documentação copiada de template grande.</li>
<li>Escopo gigante para “impressionar” (aumenta custo de auditoria).</li>
</ul>
<p><a href="/como-implementar-a-iso-27001/">Como implementar a ISO 27001</a> · <a href="/consultoria-iso-27001/">Consultoria ISO 27001</a>.</p>`,
    {
      title: "ISO 27001 para pequenas empresas: requisitos-chave e escopo enxuto",
      seo_title: "ISO 27001 em pequenas empresas: requisitos e certificação",
      seo_description:
        "Requisitos-chave da ISO 27001 em PME: escopo, SoA, cláusulas 4 a 10 na prática e erros que atrasam a certificação.",
      tldr:
        "Pequenas empresas atendem as mesmas cláusulas 4 a 10 da ISO 27001 com escopo e SoA proporcionais. Foque ativos críticos, evidência simples e auditoria interna real.",
      faq: [
        {
          pergunta: "Quais são os requisitos-chave da ISO 27001 e como eles se aplicam a pequenas empresas?",
          resposta:
            "<p>Cláusulas 4 a 10 com escopo focado, riscos reais, SoA enxuta e operação documentada. Este artigo detalha a prática para PME.</p>",
        },
        {
          pergunta: "Pequena empresa precisa dos 93 controles do Anexo A?",
          resposta:
            "<p>Precisa avaliar todos; aplica só os pertinentes, com justificativa na SoA. O número aplicado costuma ser menor em PME.</p>",
        },
      ],
    },
  );

  writePost(
    SLUG_IMPL27701,
    `<p><strong>Implementar a ISO 27701</strong> (SGPI / PIMS) em empresa de médio porte exige mapear tratamentos de dados pessoais, papéis de controlador e operador, controles de privacidade e evidência antes da auditoria. Desde a edição <strong>2025</strong>, a norma pode ser implantada com ou sem certificação ISO 27001.</p>
<p>Contexto: <a href="/iso-27701-2025-o-que-muda-independencia-da-iso-27001/">ISO 27701:2025</a> · Relação com 27001: <a href="/qual-a-relacao-da-iso-27001-com-a-iso-27701/">27001 e 27701</a> · LGPD: <a href="/relacao-do-lgpd-com-a-iso-27001/">LGPD e ISO 27001</a>.</p>
<h2 id="passos-27701">Passos práticos para implementar a ISO 27701 (médio porte)</h2>
<ol>
<li><strong>Diagnóstico:</strong> inventário de tratamentos, bases legais, fluxos com terceiros.</li>
<li><strong>Papéis:</strong> controlador vs operador por processo.</li>
<li><strong>Políticas:</strong> privacidade, retenção, direitos do titular, incidentes.</li>
<li><strong>Controles SGPI:</strong> alinhados ao anexo da 27701 e riscos de privacidade.</li>
<li><strong>Integração:</strong> se houver SGSI 27001, compartilhar gestão de incidentes e fornecedores.</li>
<li><strong>Auditoria interna</strong> e análise crítica antes do organismo.</li>
</ol>
<p>Certificação: <a href="/${SLUG_CERT27701}/">etapas para certificar ISO 27701</a>.</p>`,
    {
      title: "Como implementar a ISO 27701: passos práticos (médio porte)",
      seo_title: "Implementar ISO 27701: passos práticos e SGPI",
      seo_description:
        "Passos práticos para implementar a ISO 27701 em empresa de médio porte: SGPI, controlador, operador, controles e auditoria.",
      tldr:
        "Implementar ISO 27701: mapear tratamentos e papéis, políticas de privacidade, controles do SGPI, integração opcional com ISO 27001, auditoria interna e certificação.",
      faq: [
        {
          pergunta: "Quais são os passos práticos para implementar a ISO 27701 em uma empresa de médio porte?",
          resposta: "<p>Diagnóstico de tratamentos, papéis, políticas, controles SGPI, integração com SGSI se houver, auditoria interna. Lista: <a href=\"#passos-27701\">passos neste artigo</a>.</p>",
        },
        {
          pergunta: "Preciso ter ISO 27001 antes da 27701?",
          resposta:
            "<p>Não é obrigatório desde a 27701:2025 independente. Integrar os dois costuma reduzir retrabalho em incidentes e fornecedores.</p>",
        },
      ],
    },
  );

  writePost(
    SLUG_CERT27701,
    `<p><strong>Certificação ISO 27701</strong> comprova que o <strong>Sistema de Gestão de Privacidade da Informação (SGPI)</strong> atende à norma, por auditoria de organismo acreditado. Critérios e etapas dependem do escopo (só 27701 ou integrado ao SGSI).</p>
<p>Implementação: <a href="/${SLUG_IMPL27701}/">como implementar a ISO 27701</a> · Norma 2025: <a href="/iso-27701-2025-o-que-muda-independencia-da-iso-27001/">ISO 27701:2025</a>.</p>
<h2 id="criterios">Critérios para certificar na ISO 27701</h2>
<ul>
<li>SGPI implementado e operando (não só política publicada).</li>
<li>Evidência de tratamentos, direitos do titular, incidentes de privacidade.</li>
<li>Auditoria interna e análise crítica realizadas.</li>
<li>Organismo certificador com escopo para ISO/IEC 27701.</li>
</ul>
<h2 id="etapas">Etapas da certificação ISO 27701</h2>
<ol>
<li>Implantação do SGPI (ver artigo de implementação).</li>
<li>Estágio 1: revisão documental e escopo.</li>
<li>Estágio 2: evidência em operação.</li>
<li>Certificado e manutenções anuais (ciclo típico de 3 anos, conforme programa do organismo).</li>
</ol>
<p>Segurança da informação: <a href="/certificacao-iso-27001-etapas-prazo-custo/">certificação ISO 27001</a>.</p>`,
    {
      title: "Certificação ISO 27701: critérios, etapas e requisitos",
      seo_title: "Certificação ISO 27701: etapas e critérios",
      seo_description:
        "Critérios e etapas para obter a certificação ISO 27701: SGPI, auditoria e relação com ISO 27001.",
      tldr:
        "Certificar ISO 27701 exige SGPI operando, auditoria interna e estágios 1 e 2 do organismo. Pode ser certificação isolada ou integrada ao SGSI 27001.",
      faq: [
        {
          pergunta: "Quais são os critérios e etapas para obter a certificação ISO 27701?",
          resposta: "<p>SGPI com evidência, auditoria interna, estágios 1 e 2. <a href=\"#etapas\">Etapas neste artigo</a>.</p>",
        },
        {
          pergunta: "Quem emite o certificado ISO 27701?",
          resposta: "<p>Organismo de certificação acreditado, no escopo da norma. Consultoria não emite certificado.</p>",
        },
      ],
    },
  );
}

patchHub(load("iso-27001"));
patchCert27001(load("certificacao-iso-27001-etapas-prazo-custo"));
patchRequisitos(load("requisitos-da-iso-27001"));
patchTreinamento(load("treinamento-iso-27001"));
patch27701(load("iso-27701-2025-o-que-muda-independencia-da-iso-27001"));
patchLgpd(load("relacao-do-lgpd-com-a-iso-27001"));
patchRelacao27701(load("qual-a-relacao-da-iso-27001-com-a-iso-27701"));
buildNewArticles();
console.log("OK — aplicar: node supabase/aplicar-conteudo.mjs <slug>");
