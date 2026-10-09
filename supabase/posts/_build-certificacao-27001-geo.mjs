/** GEO certificacao-iso-27001-etapas-prazo-custo: portas + respostas diretas. */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));

function semTravessao(html) {
  return html.replace(/\s*[\u2014\u2013]\s*/g, ": ");
}

const head = `<p><strong>Certificação ISO 27001</strong> é a auditoria do seu <strong>SGSI</strong> por organismo acreditado: estágio 1 (prontidão e documentação) e estágio 2 (evidência na operação). Consultoria prepara; certificadora emite. Este artigo cobre passos, prazo, custo e acreditação.</p>
<p>Guia <strong>Certificação ISO</strong> (Templum). <a href="/iso-27001/">Hub ISO 27001</a> · <a href="/requisitos-da-iso-27001/">requisitos</a> · <a href="/como-implementar-a-iso-27001/">implementar</a> · <a href="/consultoria-iso-27001/">consultoria</a> · <a href="/auditoria-iso-27001/">auditoria</a>.</p>

<div class="post-portas">
  <a href="#respostas-diretas"><strong>Respostas diretas</strong><span>Passos, prazo, custo</span></a>
  <a href="#fases"><strong>Estágios 1 e 2</strong><span>O que o auditor faz</span></a>
  <a href="#custo"><strong>Custo</strong><span>27006-1 e escopo</span></a>
  <a href="#acreditacao"><strong>Acreditação</strong><span>Inmetro/IAF</span></a>
</div>

<h2 id="respostas-diretas">Respostas diretas: certificação ISO 27001</h2>
<ul>
<li><strong>Passos:</strong> escopo, riscos, SoA, controles operando, auditoria interna, análise crítica, estágios 1 e 2, tratamento de NCs, certificado.</li>
<li><strong>Antes do auditor:</strong> escopo documentado, riscos, SoA, controles com registro, auditoria interna e análise crítica feitas.</li>
<li><strong>Prazo:</strong> meses a ~12 meses; gargalo é <strong>operar</strong> tempo suficiente para evidência, não só escrever políticas.</li>
<li><strong>Custo certificação:</strong> dias de auditoria (ISO/IEC 27006-1), escopo, sites, complexidade, ciclo de 3 anos.</li>
<li><strong>Preço certificação iso 27001:</strong> sem tabela única; organismo cobra por dias (27006-1) e implantação soma horas internas e consultoria. Faixas citadas em mercado variam muito com escopo. <a href="#custo">Detalhe</a>.</li>
<li><strong>Consultoria x certificadora:</strong> contratos separados; organismo não pode consultar quem audita.</li>
<li><strong>Validade:</strong> 3 anos, manutenções anuais, recertificação no fim.</li>
<li><strong>27701 (privacidade):</strong> SGPI certificável <strong>sem</strong> 27001 desde 2025; integrar reduz retrabalho. <a href="/iso-27701-2025-o-que-muda-independencia-da-iso-27001/">Hub ISO 27701</a> · <a href="/certificacao-iso-27701-etapas-e-requisitos/">certificação 27701</a> · <a href="/quanto-custa-iso-27701/">custo 27701</a>.</li>
<li><strong>Incidentes:</strong> auditoria cobra gestão de incidentes com registro; vazamento sem protocolo gera NC no estágio 2.</li>
</ul>

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

const livePath = path.join(dir, "certificacao-iso-27001-etapas-prazo-custo.html");
let body = semTravessao(readFileSync(livePath, "utf8"));
const cut = body.indexOf('<h2 id="antes">');
if (cut < 0) throw new Error("certificacao-27001 sem #antes");
body = head + body.slice(cut);

writeFileSync(path.join(dir, "certificacao-iso-27001-etapas-prazo-custo.html"), body, "utf8");

const meta = JSON.parse(readFileSync(path.join(dir, "certificacao-iso-27001-etapas-prazo-custo.meta.json"), "utf8"));
meta.seo_description =
  "Certificação ISO 27001: passos, estágios 1 e 2, prazo, custo (27006-1), acreditação Inmetro e gestão de incidentes no SGSI.";
if (meta.tldr) meta.tldr = semTravessao(meta.tldr);
writeFileSync(path.join(dir, "certificacao-iso-27001-etapas-prazo-custo.meta.json"), JSON.stringify(meta, null, 2) + "\n", "utf8");
console.log("certificacao-iso-27001-etapas-prazo-custo GEO");
