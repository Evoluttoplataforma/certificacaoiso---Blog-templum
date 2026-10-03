#!/usr/bin/env node
/**
 * 4ª edição SASSMAQ (2026): artigo novo + retrofit hub e satélites.
 *   node supabase/posts/_build-sassmaq-4edicao-2026.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const BACKUP = path.join(AQUI, "../backup");

const SLUG_NOVO = "sassmaq-4-edicao-2026-mudancas-prazo-transicao";
const URL_NOVO = `/${SLUG_NOVO}/`;

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

const AVISO =
  `<div class="post-aviso post-aviso-atualizacao"><p><strong>4ª edição SASSMAQ (2026):</strong> manual publicado em 11/09/2026. <strong>Até 11/03/2027 (transição):</strong> a auditoria pode usar o manual da <strong>3ª edição (2014)</strong> ou da <strong>4ª edição (4.0)</strong>, conforme acordo com o certificador. <strong>A partir de 12/03/2027:</strong> novas avaliações e manutenções seguem <strong>somente a 4ª edição</strong>. Certificado já emitido na 3ª edição continua válido até a data de vencimento. <a href="${URL_NOVO}">Mudanças, ciclo de auditoria e prazos</a>.</p></div>\n`;

function prependAviso(content) {
  if (content.includes("post-aviso-atualizacao") || content.includes(SLUG_NOVO)) return content;
  const m = content.match(/^(\s*<p[^>]*>)/);
  if (m) return content.replace(m[0], AVISO + m[0]);
  return AVISO + content;
}

function buildNovoArtigo() {
  const html = `<p><strong>SASSMAQ 4ª edição 2026:</strong> publicada em <strong>11 de setembro de 2026</strong>, com <strong>180 dias de transição</strong>. Até <strong>11 de março de 2027</strong> transportadoras e organismos certificadores podem conduzir processos pela 3ª edição (2014) ou pela 4ª; a partir dessa data, <strong>somente a 4ª edição</strong> vale para novas avaliações e manutenções.</p>
<p>Guia geral: <a href="/o-que-e-sassmaq/">o que é o SASSMAQ</a> · Manter o sistema: <a href="/certificacao-sassmaq-o-que-fazer-para-manter-o-sistema-de-gestao/">certificação SASSMAQ entre auditorias</a>.</p>
<p><strong>Neste artigo:</strong></p>
<ul>
<li><a href="#prazo-transicao">Prazo de transição e certificados antigos</a></li>
<li><a href="#ciclo-auditorias">Novo ciclo de auditorias (modelo ISO)</a></li>
<li><a href="#pontuacao-576">576 questões: mandatórias, indústria e desejáveis</a></li>
<li><a href="#mudancas-principais">Principais mudanças da 4ª edição</a></li>
<li><a href="#subcontratados">Agregados, MEI e frota terceirizada</a></li>
<li><a href="#como-e-a-auditoria">Como a auditoria acontece na prática</a></li>
<li><a href="#o-que-nao-mudou">O que permanece igual</a></li>
<li><a href="#checklist-agora">Checklist: o que fazer agora</a></li>
</ul>

<h2 id="prazo-transicao">Prazo de transição da SASSMAQ 4ª edição (2026)</h2>
<p>O lançamento oficial foi em <strong>11/09/2026</strong>. O período de transição de <strong>180 dias</strong> termina em <strong>11/03/2027</strong>.</p>
<ul>
<li><strong>Até 11/03/2027:</strong> permitido usar documentação e listas de verificação da 3ª ou da 4ª edição, conforme combinado com o organismo certificador.</li>
<li><strong>Após 11/03/2027:</strong> novos ciclos, extensões de escopo e manutenções seguem exclusivamente a 4ª edição.</li>
<li><strong>Certificados já emitidos</strong> com base na 3ª edição <strong>continuam válidos até a data de vencimento</strong> impressa no certificado. A mudança de edição não cancela certificado vigente.</li>
</ul>
<p>O manual atualizado é adquirido pelos canais oficiais da <strong>ABIQUIM</strong>. Comunicados e interpretações costumam ser publicados no portal do programa SASSMAQ. Confira sempre a versão vigente antes de auditoria.</p>

<h2 id="ciclo-auditorias">Novo ciclo de auditorias: certificação + duas manutenções</h2>
<p>A grande mudança estrutural: o modelo de <strong>revalidação completa a cada dois anos</strong> dá lugar a um <strong>ciclo trienal</strong> alinhado à lógica das normas ISO:</p>
<ol>
<li><strong>Auditoria de certificação</strong> (avaliação inicial ou renovação do ciclo).</li>
<li><strong>Duas auditorias de manutenção anuais</strong>, parciais, com foco nos itens <strong>M1</strong> e <strong>M2</strong> da lista de verificação (conforme manual 4ª edição).</li>
<li>Encerrado o ciclo, nova auditoria de certificação reinicia a sequência.</li>
</ol>
<p><strong>Extensão de escopo</strong> (incluir operação que antes estava fora do certificado) só pode ser solicitada até <strong>90 dias após</strong> a auditoria de certificação. Passou o prazo, o caminho volta a ser reavaliação conforme regras do manual.</p>
<p><strong>Duração:</strong> tipicamente <strong>2 a 5 dias por auditor</strong> na certificação, conforme dimensionamento. Se o volume ultrapassar esse teto, entra <strong>mais de um auditor</strong> na equipe.</p>
<p><strong>100% presencial:</strong> a 4ª edição deixa explícita a proibição de auditoria remota. Planeje deslocamento, amostra de veículos separada e disponibilidade de RH e operações no local.</p>
<p><strong>Mesmo auditor no ciclo:</strong> o auditor líder deve permanecer o mesmo durante todo o ciclo trienal e ser trocado ao final dele (diferente da recomendação antiga de alternar a cada duas avaliações completas).</p>

<h2 id="pontuacao-576">576 questões: mandatórias, indústria e desejáveis</h2>
<p>O questionário do modal rodoviário reúne cerca de <strong>576 itens</strong>, em três categorias:</p>
<ul>
<li><strong>Mandatórias (M):</strong> cerca de <strong>80</strong> questões ligadas a requisitos legais e condições inegociáveis. Exigência: <strong>100%</strong> de atendimento.</li>
<li><strong>Indústria (I):</strong> cerca de <strong>370</strong> questões. Na <strong>primeira auditoria</strong> do ciclo: mínimo <strong>70%</strong>. A partir da <strong>segunda auditoria</strong> no ciclo (manutenção ou recertificação): mínimo <strong>85%</strong>.</li>
<li><strong>Desejáveis (D):</strong> cerca de <strong>20</strong> questões. Na primeira auditoria <strong>não entram na pontuação</strong>. A partir da segunda: mínimo <strong>40%</strong>.</li>
</ul>
<p>Resumo das pontuações também no <a href="/o-que-e-sassmaq/#tipos-de-questoes">guia SASSMAQ</a>.</p>

<h2 id="mudancas-principais">Principais mudanças da 4ª edição além do ciclo</h2>
<h3 id="areas-sete">Sete áreas e nova “Base de Apoio”</h3>
<p>A estrutura por áreas foi reorganizada. Destaques:</p>
<ul>
<li><strong>Área 2</strong> passa a integrar <strong>sustentabilidade/ESG</strong> e <strong>security</strong> (proteção da empresa), além de safety tradicional.</li>
<li><strong>Área 3</strong> ganha o nome <strong>Veículos e Equipamentos</strong>.</li>
<li><strong>7ª área:</strong> <strong>Base de Apoio</strong>, com regras próprias de inspeção presencial quando a base estiver a até <strong>100 km</strong> da matriz ou filial certificada.</li>
</ul>
<h3 id="exames-pneus">Exames ocupacionais e pneus</h3>
<ul>
<li><strong>Exame psicológico:</strong> deve ser realizado por <strong>psicólogo</strong>, conforme critérios do manual.</li>
<li><strong>Visão:</strong> acuidade visual isolada <strong>não substitui</strong> exame oftalmológico completo quando este for exigido.</li>
<li><strong>Pneus:</strong> passam a integrar itens <strong>mandatórios</strong>, inclusive para <strong>agregados e subcontratados</strong> utilizados na operação.</li>
</ul>
<h3 id="gestao-terceiros">Gestão de terceiros e conformidade legal</h3>
<p>A 4ª edição reforça o que a prática já mostrava: SASSMAQ deixa de ser só pasta de conformidade. Transportadoras passam a exigir desempenho mensurável de agregados (prazo, manutenção, qualidade), não apenas documento assinado. O levantamento de <strong>licenças e condicionantes</strong> (ambientais, bombeiros, órgãos estaduais como CETESB onde couber) vira rotina de auditoria, não tarefa esporádica.</p>
<p>Veja <a href="/seguranca-e-saude-ocupacional-e-meio-ambiente-o-papel-das-legislacoes-na-certificacao-sassmaq/">legislações na certificação SASSMAQ</a> e <a href="/aspectos-ambientais-transportadoras/">aspectos ambientais em transportadoras</a>.</p>

<h2 id="subcontratados">Agregados, MEI e subcontratação</h2>
<p>Grande parte dos transportadores registrados no país opera como <strong>MEI</strong> ou agregado. Para o SASSMAQ, quem roda na operação entra no mesmo pacote de exigências da frota própria: <strong>seis exames médicos</strong> ocupacionais, veículo adequado, evidências de manutenção e itens mandatórios (incluindo pneus). Vale para frota fixa e para <strong>frete pontual</strong> se o subcontratado participa do transporte de produto químico coberto pelo escopo.</p>
<p>Quem ainda não transporta químicos, mas quer certificar, precisa gerar histórico: a dica prática é começar com <strong>cargas pequenas e regulares</strong> para construir indicadores e rotina antes da primeira auditoria.</p>

<h2 id="como-e-a-auditoria">Como a auditoria acontece na prática</h2>
<p>Ordem típica no dia a dia:</p>
<ol>
<li><strong>Gerenciamento:</strong> entrevista com liderança, indicadores (22 padrão, 24 se houver Atuação Responsável), relatório anual e evidências de revisão do sistema.</li>
<li><strong>Veículos:</strong> inspeção com frota <strong>separada e disponível</strong>; amostra definida pelo dimensionamento (porte e idade média da frota).</li>
<li><strong>RH e demais áreas:</strong> exames, treinamentos, procedimentos operacionais e registros legais.</li>
</ol>
<p>Itens técnicos (FDS, tacógrafo, opacidade, laudos embarcados) exigem checklist próprio do escopo. Trate cada veículo sorteado como se fosse a frota inteira: amostra não admite “só esse não estava pronto”.</p>

<h2 id="o-que-nao-mudou">O que não mudou na 4ª edição</h2>
<ul>
<li><strong>22 indicadores</strong> de desempenho (<strong>24</strong> para quem adota Atuação Responsável).</li>
<li>Exigência de <strong>6 meses de resultados</strong> em <strong>dois trimestres fechados</strong> antes da primeira auditoria de certificação.</li>
<li>Lógica de <strong>100% mandatórios</strong> e aumento de exigência em indústria/desejáveis ao longo do ciclo.</li>
<li><strong>ABIQUIM</strong> como guardiã do programa e homologação final após organismo certificador.</li>
</ul>

<h2 id="checklist-agora">Checklist: o que fazer agora (6 meses de transição)</h2>
<ol>
<li><strong>Comprar e distribuir</strong> o manual 4ª edição; marcar diferenças em relação aos procedimentos escritos na 3ª.</li>
<li><strong>Simular o novo ciclo:</strong> calendário de certificação + manutenções M1/M2, não só “data de vencimento do certificado”.</li>
<li><strong>Atualizar gestão de agregados:</strong> contratos, exames, pneus, evidência de inspeção.</li>
<li><strong>Mapear bases de apoio</strong> num raio de 100 km e planejar auditoria presencial onde couber.</li>
<li><strong>Confirmar indicadores trimestrais</strong> com 6 meses mínimos antes de agendar certificação.</li>
<li><strong>Alinhar organismo certificador</strong> sobre edição usada em cada etapa até 11/03/2027.</li>
</ol>
<p>Benefícios e ROI: <a href="/beneficios-sassmaq-para-transporte-de-produtos-quimicos/">SASSMAQ para transporte químico</a> · <a href="/sassmaq-se-nao-e-obrigatorio-por-que-investir/">por que investir mesmo sem lei</a>.</p>
<p>Precisa de apoio na transição? <a href="https://templum.com.br/sassmaq-consultoria-completa/">Fale com a Templum</a>.</p>`;

  writePost(SLUG_NOVO, html, {
    title: "SASSMAQ 4ª edição 2026: mudanças, prazo de transição e novo ciclo de auditoria",
    seo_title: "SASSMAQ 4ª edição 2026: mudanças e prazo até 11/03/2027",
    seo_description:
      "SASSMAQ 4ª edição 2026: 180 dias de transição, ciclo trienal com manutenções, 576 questões, bases de apoio, pneus mandatórios e auditoria presencial.",
    tldr:
      "A 4ª edição SASSMAQ saiu em 11/09/2026 com 180 dias de transição até 11/03/2027. Depois disso só vale a 4ª. Certificado da 3ª edição vale até vencer. Novo ciclo: certificação + duas manutenções anuais (M1/M2), auditoria 100% presencial, ~576 questões, 7 áreas incluindo Base de Apoio, pneus mandatórios e regras rígidas para agregados.",
    faq: [
      {
        pergunta: "Qual o prazo para me adaptar à SASSMAQ 4ª edição 2026?",
        resposta:
          "<p>Até <strong>11/03/2027</strong> (180 dias após 11/09/2026) ainda é possível usar 3ª ou 4ª edição conforme acordo com o certificador. Depois dessa data, só a 4ª edição.</p>",
      },
      {
        pergunta: "Meu certificado SASSMAQ da 3ª edição continua válido?",
        resposta:
          "<p>Sim, até a data de vencimento do certificado. A publicação da 4ª edição não cancela certificado vigente.</p>",
      },
      {
        pergunta: "Como funciona o novo ciclo de auditorias SASSMAQ?",
        resposta:
          "<p>Ciclo trienal: auditoria de certificação seguida de duas manutenções anuais parciais (itens M1/M2). Ao fim, nova certificação.</p>",
      },
      {
        pergunta: "Quantas questões tem o questionário SASSMAQ na 4ª edição?",
        resposta:
          "<p>Cerca de 576, sendo ~80 mandatórias (100%), ~370 indústria (70% na 1ª auditoria, 85% depois) e ~20 desejáveis (40% a partir da 2ª auditoria).</p>",
      },
      {
        pergunta: "Agregado e MEI precisam cumprir o mesmo SASSMAQ da frota?",
        resposta:
          "<p>Sim. Subcontratados na operação química entram nas mesmas exigências (exames, veículo, mandatórios como pneus), inclusive em frete pontual.</p>",
      },
      {
        pergunta: "Ainda dá para fazer auditoria SASSMAQ remota?",
        resposta:
          "<p>Na 4ª edição a auditoria é <strong>100% presencial</strong>. Não conte com modalidade remota.</p>",
      },
    ],
  });
}

function patchHub(row) {
  let content = row.content;
  if (!content.includes(SLUG_NOVO)) {
    content = prependAviso(content);
    content = content.replace(
      "<li><a href=\"#o-que-e\">O que é o SASSMAQ</a></li>\n",
      `<li><a href="${URL_NOVO}">4ª edição 2026: mudanças e prazo</a></li>\n<li><a href="#o-que-e">O que é o SASSMAQ</a></li>\n`,
    );
    content = content.replace(
      "A referência do Módulo Transporte Rodoviário citada neste guia é a <strong>3ª edição do Manual, de 2014</strong>.",
      `O Módulo Transporte Rodoviário teve edições em 2001, 2005, 2014 (3ª) e <strong>2026 (4ª)</strong>, publicada em 11/09/2026. Até <strong>11/03/2027</strong> vale transição entre 3ª e 4ª edição; depois, só a 4ª. Mudanças completas: <a href="${URL_NOVO}">SASSMAQ 4ª edição 2026</a>.`,
    );
    content = content.replace(
      "<li>A avaliação SASSMAQ é <strong>bienal</strong>, feita por organismo certificador credenciado e homologado pela ABIQUIM.</li>",
      "<li>A partir da <strong>4ª edição (2026)</strong>, o ciclo segue modelo tipo ISO: <strong>certificação + duas manutenções anuais</strong> em ciclo trienal (antes, revalidação completa bienal). Detalhe: <a href=\"" +
        URL_NOVO +
        '#ciclo-auditorias">novo ciclo</a>.</li>',
    );
    content = content.replace(
      "<h2 id=\"areas\">As 6 áreas do questionário de avaliação</h2>",
      `<h2 id="areas">Áreas do questionário de avaliação (6 na 3ª edição, 7 na 4ª)</h2>\n<p><strong>4ª edição 2026:</strong> nova área <strong>Base de Apoio</strong>, área 2 ampliada (ESG e security) e área 3 renomeada para Veículos e Equipamentos. Veja o mapa em <a href="${URL_NOVO}#areas-sete">mudanças por área</a>. Na 3ª edição, valia a estrutura abaixo:</p>`,
    );
    content = content.replace(
      "<h2 id=\"tipos-de-questoes\">Tipos de questões e pontuação mínima</h2>\n<p>Esta é a parte que mais gera dúvida",
      `<h2 id="tipos-de-questoes">Tipos de questões e pontuação mínima</h2>\n<p>Na 4ª edição são cerca de <strong>576 questões</strong> (~80 mandatórias, ~370 indústria, ~20 desejáveis). <a href="${URL_NOVO}#pontuacao-576">Tabela resumida 2026</a>.</p>\n<p>Esta é a parte que mais gera dúvida`,
    );
    content = content.replace(
      "<li><strong>2 anos</strong> — validade do certificado. A recertificação completa é bienal.</li>",
      "<li><strong>Ciclo trienal (4ª edição):</strong> certificação + duas manutenções anuais; validade e marcos conforme manual 2026. Certificados ainda na lógica bienal da 3ª edição valem até expirar. <a href=\"" +
        URL_NOVO +
        '#prazo-transicao">Prazo de transição</a>.</li>',
    );
    content = content.replace(
      "Já a <strong>extensão</strong> de escopo verifica apenas os quesitos antes não aplicáveis, preservando a validade do certificado.",
      "Já a <strong>extensão</strong> de escopo verifica apenas os quesitos antes não aplicáveis, preservando a validade do certificado. Na 4ª edição, extensão só até <strong>90 dias após</strong> a auditoria de certificação (<a href=\"" +
        URL_NOVO +
        '#ciclo-auditorias">regra 2026</a>).',
    );
    content = content.replace(
      "<p>Onde se fazem apenas atividades administrativas, emissão de conhecimentos de transporte, inspeção veicular sem manutenção (check list), recrutamento local de subcontratados e manutenção corretiva de pequena monta. <strong>Não requer inspeção física nem certificado próprio</strong>, mas seus controles documentais entram na avaliação da matriz ou filial.</p>",
      "<p>Onde se fazem apenas atividades administrativas, emissão de conhecimentos de transporte, inspeção veicular sem manutenção (check list), recrutamento local de subcontratados e manutenção corretiva de pequena monta. Na <strong>3ª edição</strong>, em geral não exigia inspeção física própria. Na <strong>4ª edição</strong>, bases de apoio a até <strong>100 km</strong> da matriz/filial podem exigir visita presencial (<a href=\"" +
        URL_NOVO +
        '#areas-sete">Base de Apoio</a>).</p>',
    );
    content = content.replace(
      "A ABIQUIM recomenda que, a cada duas avaliações completas, a empresa <strong>alterne o auditor</strong>.",
      "Na <strong>4ª edição</strong>, o auditor líder permanece o <strong>mesmo durante todo o ciclo</strong> e é trocado ao final dele (<a href=\"" +
        URL_NOVO +
        '#ciclo-auditorias">regra 2026</a>).',
    );
    content = content.replace(
      "<li><strong>Exigência da indústria química ou do cliente</strong>, adequando-se aos requisitos de quem contrata.</li>\n</ul>",
      "<li><strong>Exigência da indústria química ou do cliente</strong>, adequando-se aos requisitos de quem contrata (muitas signatárias ABIQUIM só contratam transportadoras certificadas).</li>\n</ul>\n<p><strong>Agregados e MEI:</strong> entram nas mesmas exigências da frota própria quando participam da operação (exames, veículo, mandatórios). <a href=\"" +
        URL_NOVO +
        '#subcontratados">Subcontratação na 4ª edição</a>.</p>',
    );
    content = content.replace(
      "<li><a href=\"/sassmaq-o-que-diz-a-resolucao-contran-517/\">SASSMAQ: o que diz a Resolução Contran 517</a></li>",
      `<li><a href="${URL_NOVO}">SASSMAQ 4ª edição 2026: mudanças e prazo</a></li>\n<li><a href="/sassmaq-o-que-diz-a-resolucao-contran-517/">SASSMAQ: o que diz a Resolução Contran 517</a></li>`,
    );
  }

  const faq = mergeFaq(row.faq, [
    {
      pergunta: "Qual o prazo de transição da SASSMAQ 4ª edição 2026?",
      resposta: `<p>180 dias a partir de 11/09/2026, até <strong>11/03/2027</strong>. Até lá, 3ª ou 4ª edição conforme acordo com certificador. <a href="${URL_NOVO}">Detalhes</a>.</p>`,
    },
    {
      pergunta: "O certificado SASSMAQ da 3ª edição ainda vale?",
      resposta:
        "<p>Sim, até a data de vencimento. A 4ª edição não cancela certificado vigente.</p>",
    },
    {
      pergunta: "Como mudou o ciclo de auditorias SASSMAQ em 2026?",
      resposta: `<p>Ciclo trienal com certificação e duas manutenções anuais (M1/M2), substituindo a revalidação completa bienal. <a href="${URL_NOVO}#ciclo-auditorias">Explicação completa</a>.</p>`,
    },
  ]);

  writePost("o-que-e-sassmaq", content, {
    title: row.title,
    seo_title: "SASSMAQ: o que é, 4ª edição 2026 e certificação",
    seo_description:
      "O que é o SASSMAQ, pontuações, 4ª edição 2026, prazo até 11/03/2027, ciclo de auditorias e como se certificar no transporte químico.",
    tldr:
      "SASSMAQ (ABIQUIM) avalia transportadores de produtos químicos. 4ª edição: 11/09/2026, transição até 11/03/2027. ~576 questões; mandatórias 100%; ciclo trienal certificação + manutenções. Guia completo de certificação e satélites no blog.",
    faq,
  });
}

function patchManutencao(row) {
  let content = prependAviso(row.content);
  if (!content.includes("manutencoes-anuais-m1-m2")) {
    const block = `
<h2 id="manutencoes-anuais-m1-m2">Manutenções anuais (4ª edição): M1 e M2</h2>
<p>Com a <strong>4ª edição (2026)</strong>, manter o certificado não é só “não deixar vencer”. Entre uma auditoria de certificação e a próxima, entram <strong>duas auditorias de manutenção anuais</strong>, parciais, focadas nos itens <strong>M1</strong> e <strong>M2</strong> da lista de verificação. Indicadores trimestrais, gestão de agregados e licenças precisam estar vivos o ano inteiro.</p>
<p><a href="${URL_NOVO}#ciclo-auditorias">Novo ciclo SASSMAQ</a> · <a href="/o-que-e-sassmaq/">Guia SASSMAQ</a></p>
`;
    content = content.replace(
      "<h2>Fatores intrinsecamente importantes para que o sistema da certificação SASSMAQ seja mantido</h2>",
      block + "<h2>Fatores intrinsecamente importantes para que o sistema da certificação SASSMAQ seja mantido</h2>",
    );
  }
  writePost("certificacao-sassmaq-o-que-fazer-para-manter-o-sistema-de-gestao", content, {
    title: row.title,
    seo_title: "Manter certificação SASSMAQ: manutenções M1/M2 e 4ª edição",
    seo_description:
      "Como manter o SASSMAQ vivo: manutenções anuais M1/M2 na 4ª edição 2026, indicadores, equipe e gestão de agregados entre auditorias.",
    tldr:
      "Manter SASSMAQ exige operação contínua do sistema, não só perto da auditoria. Na 4ª edição há duas manutenções anuais (M1/M2) entre certificações. Envolva equipe, indicadores trimestrais e terceiros.",
    faq: mergeFaq(row.faq, [
      {
        pergunta: "Como funciona a manutenção do SASSMAQ na 4ª edição?",
        resposta: `<p>Duas auditorias parciais por ano (M1/M2) entre certificações, em ciclo trienal. <a href="${URL_NOVO}#ciclo-auditorias">Ciclo 2026</a>.</p>`,
      },
    ]),
  });
}

function patchSatellite(slug, row, extraFaq = []) {
  const content = prependAviso(row.content);
  writePost(slug, content, {
    title: row.title,
    seo_title: row.seo_title,
    seo_description: row.seo_description,
    tldr: row.tldr,
    faq: mergeFaq(row.faq, [
      {
        pergunta: "A SASSMAQ 4ª edição 2026 afeta este tema?",
        resposta: `<p>Sim. Prazo de transição até 11/03/2027 e regras novas de ciclo, terceiros e auditoria presencial. <a href="${URL_NOVO}">Leia as mudanças</a>.</p>`,
      },
      ...extraFaq,
    ]),
  });
}

buildNovoArtigo();
patchHub(load("o-que-e-sassmaq"));
patchManutencao(load("certificacao-sassmaq-o-que-fazer-para-manter-o-sistema-de-gestao"));
patchSatellite("beneficios-sassmaq-para-transporte-de-produtos-quimicos", load("beneficios-sassmaq-para-transporte-de-produtos-quimicos"));
patchSatellite("sassmaq-se-nao-e-obrigatorio-por-que-investir", load("sassmaq-se-nao-e-obrigatorio-por-que-investir"));
patchSatellite("sassmaq-os-maiores-riscos-de-nao-ter-o-sistema-implementado", load("sassmaq-os-maiores-riscos-de-nao-ter-o-sistema-implementado"));
patchSatellite("sassmaq-o-que-diz-a-resolucao-contran-517", load("sassmaq-o-que-diz-a-resolucao-contran-517"));
patchSatellite("seguranca-e-saude-ocupacional-e-meio-ambiente-o-papel-das-legislacoes-na-certificacao-sassmaq", load("seguranca-e-saude-ocupacional-e-meio-ambiente-o-papel-das-legislacoes-na-certificacao-sassmaq"));
patchSatellite("quanto-dinheiro-minha-transportadora-pode-perder-por-nao-ter-o-sassmaq", load("quanto-dinheiro-minha-transportadora-pode-perder-por-nao-ter-o-sassmaq"));
console.log("OK — publish novo + aplicar-conteudo.mjs");
