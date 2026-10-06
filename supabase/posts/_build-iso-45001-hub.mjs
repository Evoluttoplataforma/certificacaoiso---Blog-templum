/** Gera iso-45001.html + meta a partir do backup orbit + blocos GEO fase A */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const backup = JSON.parse(
  readFileSync(path.join(dir, "../backup/iso-45001-antes-orbit-os-2026-10-01.json"), "utf8"),
);

let c = backup.content;

const head = `<p><strong>A ISO 45001</strong> é a norma internacional de Sistema de Gestão de Saúde e Segurança Ocupacional (SGSSO). Versão certificável: <strong>ISO 45001:2018</strong> (ABNT NBR ISO 45001, republicação 2024). Substituiu a <a href="/ohsas-18001-e-iso-45001/">OHSAS 18001</a> (cancelada em 2021) e conversa com a <a href="/nr-1-e-iso-45001/">NR-1 e o PGR</a>.</p>
<p>Guia do blog <strong>Certificação ISO</strong>, da <a href="https://templum.com.br/consultoria/iso-45001/"><strong>Templum Consultoria</strong></a>. Requisitos: <a href="/iso-45001-requisitos-tudo-que-voce-precisa-saber/">cláusulas 4 a 10</a> · Consultoria: <a href="/consultoria-iso-45001/">consultoria ISO 45001</a> · Passos: <a href="/passo-a-passo-certificacao-iso-45001/">passo a passo certificação</a> · Custo: <a href="/quanto-custa-iso-45001/">quanto custa a ISO 45001</a> · 45003: <a href="/iso-45003-vs-iso-45001/">ISO 45003 vs 45001</a>.</p>

<div class="post-portas">
  <a href="#respostas-diretas"><strong>Respostas diretas</strong><span>Requisitos, prazo, NBR, certificação</span></a>
  <a href="/quanto-custa-iso-45001/"><strong>Custo</strong><span>Consultoria, organismo, PGR</span></a>
  <a href="#o-que-e-iso-45001"><strong>O que é</strong><span>SGSSO e objetivos</span></a>
  <a href="#auditoria-e-certificacao"><strong>Certificar</strong><span>Organismo e consultoria</span></a>
  <a href="/iso-45001-perigos/"><strong>Perigos e riscos</strong><span>Cláusula 6.1</span></a>
</div>

<h2 id="respostas-diretas">Respostas diretas: ISO 45001</h2>
<ul>
<li><strong>O que é:</strong> norma de <strong>sistema de gestão</strong> de saúde e segurança ocupacional (SGSSO), não substituto de PCMSO ou clínica.</li>
<li><strong>Requisitos:</strong> cláusulas 4 a 10 (Anexo SL): contexto, liderança, planejamento (perigos/riscos), apoio, operação, avaliação e melhoria. <a href="/iso-45001-requisitos-tudo-que-voce-precisa-saber/">Requisitos ISO 45001 explicados</a>.</li>
<li><strong>Certificação:</strong> auditoria de organismo acreditado (Inmetro/IAF). Consultoria prepara; <a href="/consultoria-iso-45001/">consultoria ISO 45001</a> não emite certificado.</li>
<li><strong>Prazo típico:</strong> cerca de <strong>10 a 14 meses</strong> até auditoria de certificação em porte médio. <a href="/passo-a-passo-certificacao-iso-45001/#prazo">Detalhe de prazo</a>.</li>
<li><strong>Custo:</strong> implantação do SGSSO + auditoria do organismo + manutenção em 3 anos; consultoria e certificadora separadas. <a href="/quanto-custa-iso-45001/">Quanto custa a ISO 45001</a>.</li>
<li><strong>NR-1 e PGR:</strong> obrigação legal; SGSSO voluntário. Inventário de riscos bem feito serve aos dois. <a href="/nr-1/">NR-1</a>.</li>
<li><strong>ISO 45003:</strong> diretriz de riscos psicossociais, <strong>sem certificação</strong>. <a href="/iso-45003-vs-iso-45001/">45003 vs 45001</a>.</li>
<li><strong>ABNT NBR ISO 45001:2024:</strong> republicação brasileira alinhada à ISO 45001:2018 + Emenda 1 (clima no contexto). Conteúdo certificável continua 2018.</li>
</ul>
`;

c = c.replace(/^<p><strong>A ISO 45001<\/strong>[\s\S]*?<p><strong>Neste artigo:<\/strong><\/p>/, head + "<p><strong>Neste artigo:</strong></p>");

c = c.replace(
  /<h2 id="consultoria-para-implementacao-da-iso-45001">[\s\S]*$/,
  `<h2 id="consultoria-para-implementacao-da-iso-45001">Consultoria e certificação ISO 45001</h2>
<p>A <strong>OHSAS 18001 foi cancelada em março de 2021</strong>. Quem ainda busca migração histórica: <a href="/ohsas-18001-e-iso-45001/">OHSAS 18001 e ISO 45001</a>.</p>
<p>Para implantar e certificar, use o <a href="/passo-a-passo-certificacao-iso-45001/">passo a passo da certificação ISO 45001</a> ou contrate <a href="/consultoria-iso-45001/">consultoria ISO 45001</a>. SGI com qualidade e meio ambiente: <a href="/consultoria-iso-sistema-integrado-9001-14001-45001/">9001 + 14001 + 45001</a>.</p>
<p><a href="https://templum.com.br/consultoria/iso-45001/">Consultoria Templum ISO 45001</a> · <a href="/form/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=iso-45001&amp;norma=ISO%2045001">Diagnóstico gratuito</a></p>
<p>Desde agosto de 2024, a NR-1 passou a exigir fatores de risco psicossociais no PGR; a fiscalização punitiva referente à redação de 2024 entrou em <strong>26 de maio de 2026</strong>. Veja <a href="/nr-1-riscos-psicossociais/">NR-1 e riscos psicossociais</a> e <a href="/nr-1-e-iso-45001/">como a ISO 45001 encaixa com a NR-1</a>.</p>
<p class="post-aprofunde"><strong>Aprofunde:</strong> <a href="/iso-45001-perigos/">Perigos e riscos</a> · <a href="/checklist-preparacao-auditoria-interna-iso/">Checklist auditoria interna</a> · <a href="/como-escolher-consultoria-iso/">Escolher consultoria</a></p>`,
);

writeFileSync(path.join(dir, "iso-45001.html"), c, "utf8");

const meta = {
  title: "ISO 45001 e a Segurança do Trabalho",
  seo_title: "ISO 45001: o que é, requisitos, NBR 2024 e como certificar",
  seo_description:
    "ISO 45001: o que é SGSSO, requisitos, passo a passo, NR-1 e PGR, ISO 45003, ABNT NBR 2024 e diferença entre consultoria e certificadora.",
  tldr:
    "A ISO 45001:2018 estrutura o SGSSO: perigos, riscos, legal, controles e melhoria. Certificação via organismo acreditado. Encaixa com PGR/NR-1. ISO 45003 orienta psicossocial, sem certificado. ABNT NBR ISO 45001:2024 republica a norma com Emenda 1 (clima).",
  faq: [
    {
      pergunta: "O que é a ISO 45001?",
      resposta:
        "<p>Norma internacional de <strong>Sistema de Gestão de Saúde e Segurança Ocupacional (SGSSO)</strong>. Define requisitos para prevenir lesões e doenças do trabalho. Hub: <a href=\"/iso-45001/#o-que-e-iso-45001\">o que é ISO 45001</a>.</p>",
    },
    {
      pergunta: "Quais são os requisitos principais da ISO 45001?",
      resposta:
        "<p>Cláusulas 4 a 10 (Anexo SL): contexto, liderança, planejamento com perigos/riscos, apoio, operação, avaliação e melhoria. <a href=\"/iso-45001-requisitos-tudo-que-voce-precisa-saber/\">Requisitos ISO 45001 (4 a 10)</a> · <a href=\"/iso-45001-perigos/\">perigos e riscos</a>.</p>",
    },
    {
      pergunta: "Qual é a versão atual da ISO 45001 e a NBR 2024?",
      resposta:
        "<p>A referência internacional certificável é <strong>ISO 45001:2018</strong>, com <strong>Emenda 1:2024</strong> (clima no contexto). A ABNT publicou <strong>NBR ISO 45001:2024</strong> alinhada a essa edição. Não é uma revisão 2024 de requisitos novos além da emenda.</p>",
    },
    {
      pergunta: "Como implantar a ISO 45001 passo a passo?",
      resposta:
        "<p>Comprometimento, diagnóstico, perigos/riscos, legal e controles, competência, auditoria interna e certificação. <a href=\"/passo-a-passo-certificacao-iso-45001/\">Passo a passo certificação ISO 45001</a>.</p>",
    },
    {
      pergunta: "ISO 45003 é a mesma coisa que ISO 45001?",
      resposta:
        "<p>Não. A 45003 é diretriz de riscos psicossociais; a 45001 é certificável. <a href=\"/iso-45003-vs-iso-45001/\">ISO 45003 vs 45001</a>.</p>",
    },
    {
      pergunta: "A ISO 45001 substitui as Normas Regulamentadoras?",
      resposta:
        "<p>Não. NRs são lei; ISO 45001 é voluntária. Um SGSSO bem feito ajuda a organizar o cumprimento e as evidências do PGR.</p>",
    },
    {
      pergunta: "Quanto tempo leva para certificar na ISO 45001?",
      resposta:
        "<p>Em média, <strong>10 a 14 meses</strong> em porte médio. <a href=\"/passo-a-passo-certificacao-iso-45001/#prazo\">Prazo típico</a>.</p>",
    },
    {
      pergunta: "Quem emite o certificado ISO 45001?",
      resposta:
        "<p>Organismo de certificação acreditado (Inmetro/IAF). Consultoria não emite. <a href=\"/consultoria-iso-45001/\">Consultoria ISO 45001</a>.</p>",
    },
    {
      pergunta: "Quanto custa a ISO 45001?",
      resposta:
        "<p>Soma implantação do SGSSO, auditoria do organismo e manutenção em 3 anos. Consultoria e certificadora são contratos separados. <a href=\"/quanto-custa-iso-45001/\">Quanto custa a ISO 45001</a>.</p>",
    },
  ],
};

writeFileSync(path.join(dir, "iso-45001.meta.json"), JSON.stringify(meta, null, 2) + "\n", "utf8");
console.log("iso-45001.html + meta gerados");
