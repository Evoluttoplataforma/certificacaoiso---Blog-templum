/** Hub iso-27701-2025: portas + respostas diretas (Semrush prompts). */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const slug = "iso-27701-2025-o-que-muda-independencia-da-iso-27001";
const meta = JSON.parse(readFileSync(path.join(dir, `${slug}.meta.json`), "utf8"));

const head = `<p><strong>ISO/IEC 27701:2025</strong> define requisitos do <strong>SGPI</strong> (sistema de gestão de privacidade da informação, PIMS): controlador, operador, risco de privacidade e evidência auditável. Desde 2025 a norma pode ser certificada <strong>sem ISO 27001 obrigatória</strong>; integrar com o <a href="/iso-27001/">SGSI</a> continua recomendável.</p>
<p>Guia <strong>Certificação ISO</strong> (Templum). <a href="/certificacao-iso-27701-etapas-e-requisitos/">certificação ISO 27701</a> · <a href="/como-implementar-a-iso-27701/">implementar</a> · <a href="/iso-27701-lgpd-gdpr-conformidade/">LGPD e GDPR</a> · <a href="/qual-a-relacao-da-iso-27001-com-a-iso-27701/">27001 e 27701</a> · <a href="/consultoria-iso-27701/">consultoria</a>.</p>

<div class="post-portas">
  <a href="#respostas-diretas"><strong>Respostas diretas</strong><span>2025, SGPI, certificar</span></a>
  <a href="/certificacao-iso-27701-etapas-e-requisitos/"><strong>Certificar</strong><span>Critérios e etapas</span></a>
  <a href="#anexo-a"><strong>Anexo A</strong><span>A1, A2, A3</span></a>
  <a href="/iso-27701-lgpd-gdpr-conformidade/"><strong>LGPD</strong><span>Não substitui a lei</span></a>
  <a href="/como-implementar-a-iso-27701/"><strong>Implementar</strong><span>Médio porte</span></a>
</div>

<h2 id="respostas-diretas">Respostas diretas: ISO 27701 e privacidade</h2>
<ul>
<li><strong>O que é:</strong> norma de <strong>SGPI/PIMS</strong> para dados pessoais como controlador e/ou operador. Cláusulas 4 a 10 + Anexo A (A1 controlador, A2 operador, A3 segurança mínima).</li>
<li><strong>2025 e 27001:</strong> edição 2025 é <strong>sistema independente</strong>. Certificação na 27701 <strong>não exige</strong> SGSI 27001 certificado antes. <a href="/qual-a-relacao-da-iso-27001-com-a-iso-27701/">Relação 27001 e 27701</a>.</li>
<li><strong>Certificação:</strong> organismo acreditado, estágios 1 e 2, após SGPI operando com evidência. <a href="/certificacao-iso-27701-etapas-e-requisitos/">Critérios e etapas</a>.</li>
<li><strong>Implementar (médio porte):</strong> escopo, papéis, inventário de tratamentos, risco de privacidade (6.1), controles, operação, auditoria interna. <a href="/como-implementar-a-iso-27701/">Passo a passo</a>.</li>
<li><strong>LGPD/GDPR:</strong> SGPI organiza tratamentos, bases, titulares e fornecedores com evidência. <strong>Não substitui</strong> a legislação. <a href="/iso-27701-lgpd-gdpr-conformidade/">27701 e conformidade</a>.</li>
<li><strong>Prazo transição 2019→2025:</strong> cerca de <strong>3 anos (até 2028)</strong> para certificados na versão anterior.</li>
<li><strong>Custo:</strong> implantação SGPI + dias de auditoria; sem tabela única. <a href="/quanto-custa-iso-27701/">Quanto custa ISO 27701</a> · <a href="/certificacao-iso-27701-etapas-e-requisitos/#custo">Fatores na certificação</a>.</li>
<li><strong>Segurança:</strong> privacidade exige controles mínimos (tabela A3, alinhados à ISO 27002). <a href="/iso-27001/">ISO 27001</a> acelera, mas não é pré-requisito de certificação.</li>
</ul>

`;

let body = readFileSync(path.join(dir, `${slug}.html`), "utf8");
body = body.replace(/^<p><strong>Resposta direta:<\/strong>[\s\S]*?<\/p>\s*\n/, "");
const cut = body.indexOf("<p>A ISO/IEC 27701 deixou");
if (cut < 0) throw new Error("corpo hub 27701 inesperado");
body = head + body.slice(cut);
body = body.replace(
  "<h2>O Anexo A foi reorganizado em três tabelas</h2>",
  '<h2 id="anexo-a">O Anexo A foi reorganizado em três tabelas</h2>',
);

writeFileSync(path.join(dir, `${slug}.html`), body, "utf8");

meta.seo_description =
  "ISO 27701:2025 SGPI independente da 27001: certificação, implementação, LGPD, Anexo A e relação com ISO 27001. Respostas diretas.";
if (meta.tldr) {
  meta.tldr = meta.tldr
    .replace(/\s*[\u2014\u2013]\s*/g, ": ")
    .replace(/independente: a certificação/g, "independente. A certificação");
}
writeFileSync(path.join(dir, `${slug}.meta.json`), JSON.stringify(meta, null, 2) + "\n", "utf8");
console.log("iso-27701 hub GEO full");
