/** Reescrita corpo hub iso-45001: enxuto, cluster filho, sem Orbit/link errado. */
import { writeFileSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const meta = JSON.parse(readFileSync(path.join(dir, "iso-45001.meta.json"), "utf8"));

const html = `<p><strong>A ISO 45001</strong> é a norma internacional de Sistema de Gestão de Saúde e Segurança Ocupacional (SGSSO). Versão certificável: <strong>ISO 45001:2018</strong> (ABNT NBR ISO 45001, republicação 2024). Substituiu a <a href="/ohsas-18001-e-iso-45001/">OHSAS 18001</a> (cancelada em 2021) e conversa com a <a href="/nr-1-e-iso-45001/">NR-1 e o PGR</a>.</p>
<p>Guia do blog <strong>Certificação ISO</strong>, da <a href="https://templum.com.br/consultoria/iso-45001/"><strong>Templum Consultoria</strong></a>. <a href="/iso-45001-requisitos-tudo-que-voce-precisa-saber/">Requisitos 4 a 10</a> · <a href="/passo-a-passo-certificacao-iso-45001/">passo a passo</a> · <a href="/quanto-custa-iso-45001/">quanto custa</a> · <a href="/consultoria-iso-45001/">consultoria</a> · <a href="/iso-45003-vs-iso-45001/">45003 vs 45001</a> · <a href="/iso-45001-cliente-edital-exige-certificado/">cliente ou edital exige</a>.</p>

<div class="post-portas">
  <a href="#respostas-diretas"><strong>Respostas diretas</strong><span>Requisitos, prazo, NBR</span></a>
  <a href="/quanto-custa-iso-45001/"><strong>Custo</strong><span>Consultoria e organismo</span></a>
  <a href="#nr1-pgr"><strong>NR-1 e PGR</strong><span>Lei x SGSSO</span></a>
  <a href="#auditoria-e-certificacao"><strong>Certificar</strong><span>Inmetro/IAF</span></a>
  <a href="/iso-45001-perigos/"><strong>Perigos</strong><span>Cláusula 6.1</span></a>
</div>

<h2 id="respostas-diretas">Respostas diretas: ISO 45001</h2>
<ul>
<li><strong>O que é:</strong> norma de <strong>sistema de gestão</strong> de SST (SGSSO), não substituto de PCMSO ou clínica.</li>
<li><strong>Requisitos:</strong> cláusulas 4 a 10 (Anexo SL). Detalhe: <a href="/iso-45001-requisitos-tudo-que-voce-precisa-saber/">requisitos ISO 45001</a>.</li>
<li><strong>Certificação:</strong> organismo acreditado (Inmetro/IAF). Consultoria prepara; não emite certificado.</li>
<li><strong>Prazo típico:</strong> cerca de <strong>10 a 14 meses</strong> até certificação em porte médio. <a href="/passo-a-passo-certificacao-iso-45001/#prazo">Prazo</a>.</li>
<li><strong>Custo:</strong> implantação + auditoria + manutenção em 3 anos. <a href="/quanto-custa-iso-45001/">Quanto custa</a>.</li>
<li><strong>NR-1/PGR:</strong> obrigação legal; SGSSO voluntário. Inventário bem feito serve aos dois. <a href="/nr-1/">NR-1</a> · <a href="/nr-1-se-aplica-a-minha-empresa/">se aplica à minha empresa?</a></li>
<li><strong>ISO 45003:</strong> diretriz psicossocial, sem certificação. <a href="/iso-45003-vs-iso-45001/">45003 vs 45001</a>.</li>
<li><strong>NBR ISO 45001:2024:</strong> republicação alinhada à 2018 + Emenda 1 (clima no contexto).</li>
</ul>

<h2 id="o-que-e-iso-45001">O que é ISO 45001</h2>
<p>A norma define requisitos para um SGSSO que previne lesões e agravo à saúde, promove ambiente seguro e melhora desempenho de SST. A organização é responsável por quem trabalha nela e por quem pode ser afetado pelas suas atividades, inclusive saúde mental no escopo do sistema.</p>
<p>Não é checklist de EPI: é ciclo de contexto, liderança, <a href="/iso-45001-perigos/">perigos e riscos</a>, requisitos legais, operação, auditoria interna e melhoria contínua.</p>

<h2 id="versao">Versão vigente e fim da OHSAS 18001</h2>
<p>Referência certificável: <strong>ISO 45001:2018</strong> com <strong>Emenda 1:2024</strong> (mudanças climáticas na análise de contexto, como nas demais normas de sistema de gestão).</p>
<p><strong>OHSAS 18001</strong> foi cancelada em <strong>março de 2021</strong>. Certificados antigos perderam validade. Migração: <a href="/ohsas-18001-e-iso-45001/">OHSAS 18001 e ISO 45001</a>.</p>

<h2 id="nr1-pgr">ISO 45001 e NR-1: PGR e psicossocial</h2>
<p>NRs são lei; ISO 45001 é voluntária. O <strong>PGR</strong> (<a href="/nr-1/">NR-1</a>) é inventário de riscos com plano de ação: núcleo comum com a cláusula 6.1 da ISO 45001.</p>
<p>Quem certifica ganha revisão formal do inventário alinhada ao item 1.5.4.4.6.1 da NR-1. Fatores psicossociais entram no PGR desde a redação de 2024; fiscalização punitiva referente a ela desde <strong>26 de maio de 2026</strong>. <a href="/nr-1-riscos-psicossociais/">Riscos psicossociais</a> · <a href="/nr-1-e-iso-45001/">mapa NR-1 x 45001</a>.</p>
<p>Ainda no PPRA? <a href="/ppra/">PPRA foi substituído pelo PGR</a>.</p>

<h2 id="para-que-serve">Para que serve na prática</h2>
<ul>
<li>Priorizar controles na <strong>hierarquia</strong> (eliminar antes de EPI).</li>
<li>Envolver trabalhadores na identificação de perigos (5.4).</li>
<li>Integrar SST aos processos de negócio, não só ao SESMT.</li>
<li>Preparar evidências para auditoria externa e para fiscalização do PGR.</li>
<li>Facilitar <strong>SGI</strong> com ISO 9001 e 14001 (Anexo SL). <a href="/consultoria-iso-sistema-integrado-9001-14001-45001/">SGI 9001 + 14001 + 45001</a>.</li>
</ul>

<h2 id="a-estrutura-da-iso-45001">Estrutura: cláusulas 4 a 10</h2>
<p>Mesma lógica do Anexo SL das normas ISO de sistema de gestão:</p>
<ol>
<li>Contexto da organização (4)</li>
<li>Liderança e participação (5)</li>
<li>Planejamento: riscos, oportunidades, legal (6)</li>
<li>Apoio: competência, comunicação, documentos (7)</li>
<li>Operação e controles (8)</li>
<li>Avaliação de desempenho: monitoramento, auditoria interna (9)</li>
<li>Melhoria (10)</li>
</ol>
<p>Cláusula a cláusula: <a href="/iso-45001-requisitos-tudo-que-voce-precisa-saber/">requisitos ISO 45001 explicados</a>.</p>

<h2 id="auditoria-e-certificacao">Auditoria e certificação</h2>
<p>Certificado só após auditoria de <strong>organismo de certificação</strong> acreditado (cadeia IAF; no Brasil, Inmetro). Etapas típicas: auditoria de certificação (estágio 1 documental, estágio 2 em campo), manutenção anual, recertificação a cada três anos.</p>
<p>Consultoria implanta e prepara; certificadora audita. Contratos separados. <a href="/passo-a-passo-certificacao-iso-45001/">Passo a passo certificação ISO 45001</a> · <a href="/como-escolher-consultoria-iso/">como escolher consultoria</a>.</p>

<h2 id="consultoria-para-implementacao-da-iso-45001">Consultoria e próximos passos</h2>
<p><a href="https://templum.com.br/consultoria/iso-45001/">Consultoria Templum ISO 45001</a> · <a href="/form/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=iso-45001&amp;norma=ISO%2045001">Diagnóstico gratuito</a></p>

<h2 id="aprofunde">Aprofunde no cluster ISO 45001</h2>
<ul>
<li><a href="/iso-45001-perigos/">Perigos e riscos (6.1)</a></li>
<li><a href="/quanto-custa-iso-45001/">Quanto custa</a></li>
<li><a href="/iso-45001-cliente-edital-exige-certificado/">Cliente ou edital exige certificado</a></li>
<li><a href="/checklist-preparacao-auditoria-interna-iso/">Checklist auditoria interna</a></li>
<li><a href="/nr-1-se-aplica-a-minha-empresa/">NR-1 se aplica à minha empresa?</a></li>
<li><a href="/nr-1-mei-microempresa-epp/">NR-1 MEI, ME e EPP</a></li>
</ul>
`;

writeFileSync(path.join(dir, "iso-45001.html"), html, "utf8");
writeFileSync(path.join(dir, "iso-45001.meta.json"), JSON.stringify(meta, null, 2) + "\n", "utf8");
console.log("iso-45001 hub reescrito (GEO full)");
