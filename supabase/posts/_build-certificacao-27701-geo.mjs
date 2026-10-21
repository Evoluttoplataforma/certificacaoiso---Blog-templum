/** GEO certificacao-iso-27701-etapas-e-requisitos: portas + respostas diretas. */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const slug = "certificacao-iso-27701-etapas-e-requisitos";

const head = `
<div class="post-portas">
  <a href="#respostas-diretas"><strong>Respostas diretas</strong><span>Critérios, prazo, custo</span></a>
  <a href="#criterios-etapas-pergunta"><strong>Etapas</strong><span>Ordem numerada</span></a>
  <a href="#fases"><strong>Estágios 1 e 2</strong><span>Evidência SGPI</span></a>
  <a href="#sozinha-ou-integrada"><strong>Só 27701 ou +27001</strong><span>Edição 2025</span></a>
  <a href="#custo"><strong>Custo</strong><span>Dias de auditoria</span></a>
</div>

<h2 id="respostas-diretas">Respostas diretas: certificação ISO 27701</h2>
<ul>
<li><strong>Critérios:</strong> SGPI com escopo, inventário de tratamentos, risco de privacidade, controles Anexo A, operação com registro, auditoria interna e análise crítica.</li>
<li><strong>Etapas:</strong> gap, implantação, operação com histórico, auditoria interna, organismo acreditado (estágios 1 e 2), NCs, certificado e manutenções.</li>
<li><strong>É obrigatório ter ISO 27001 certificada antes da 27701?</strong> Não é obrigatória desde a ISO/IEC 27701:2025. A empresa pode certificar só o SGPI ou integrar o SGPI ao SGSI da 27001. <a href="/iso-27701-2025-o-que-muda-independencia-da-iso-27001/">O que mudou em 2025</a>.</li>
<li><strong>Prazo:</strong> cerca de <strong>6 a 12 meses</strong> na primeira certificação (médio porte), se inventário e controles A3 já tiverem base.</li>
<li><strong>Custo:</strong> dias de auditoria (escopo, sites, controlador/operador, tratamentos) + implantação interna/consultoria. Sem tabela única.</li>
<li><strong>Consultoria x certificadora:</strong> contratos separados; organismo não consulta quem audita.</li>
<li><strong>LGPD:</strong> certificação SGPI comprova gestão; <strong>não substitui</strong> conformidade legal. <a href="/iso-27701-lgpd-gdpr-conformidade/">27701 e LGPD</a>.</li>
</ul>

`;

let body = readFileSync(path.join(dir, `${slug}.html`), "utf8");
if (!body.includes('id="respostas-diretas"')) {
  const introEnd = body.indexOf("<p><strong>Neste artigo:</strong></p>");
  if (introEnd > 0) {
    const afterList = body.indexOf("</ul>\n\n", introEnd);
    if (afterList > 0) {
      body = body.slice(0, introEnd) + head + "\n" + body.slice(afterList + "</ul>\n\n".length);
    } else {
      body = body.slice(0, introEnd) + head + body.slice(introEnd);
    }
  } else {
    const p2 = body.indexOf("</p>\n", body.indexOf("</p>\n") + 1);
    body = body.slice(0, p2 + 5) + head + body.slice(p2 + 5);
  }
}
body = body.replace(
  /norma=ISO%2027001/g,
  "norma=ISO%2027701",
);
writeFileSync(path.join(dir, `${slug}.html`), body, "utf8");

const meta = JSON.parse(readFileSync(path.join(dir, `${slug}.meta.json`), "utf8"));
meta.seo_description =
  "Certificação ISO 27701: critérios, etapas, estágios 1 e 2, prazo, custo, certificação isolada ou com 27001 e papel da LGPD.";
writeFileSync(path.join(dir, `${slug}.meta.json`), JSON.stringify(meta, null, 2) + "\n", "utf8");
console.log("certificacao-iso-27701-etapas-e-requisitos GEO");
