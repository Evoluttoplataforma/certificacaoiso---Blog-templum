#!/usr/bin/env node
/**
 * Publica dois posts do cluster ISO 27001 (GSC gaps):
 * - /iso-27001-e-iso-27002/
 * - /treinamento-iso-27001/
 * Uso: node supabase/posts/_publish-iso-27001-gaps.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(AQUI, "..", "..");
{
  const envPath = path.join(ROOT, ".env");
  if (existsSync(envPath)) {
    for (const linha of readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const t = linha.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i < 1) continue;
      const k = t.slice(0, i).trim();
      let v = t.slice(i + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      if (k && process.env[k] === undefined) process.env[k] = v;
    }
  }
}

const SB = process.env.SUPABASE_URL || "https://yfpdrckyuxltvznqfqgh.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_KEY || "";
if (!KEY) {
  console.error("Falta SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const CAT = "73d8e99d-517b-41c2-8c2e-8f9229355ceb";
const CAT_NAME = "Segurança e Compliance";
const AUTHOR = "Daniela Albuquerque";
const H = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

function words(html) {
  return html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
}

async function upsertPost(row) {
  const check = await fetch(
    `${SB}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(row.slug)}&select=id,slug`,
    { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } },
  );
  const existing = await check.json();
  if (existing?.[0]?.id) {
    const { slug, ...body } = row;
    const res = await fetch(`${SB}/rest/v1/blog_templum_posts?id=eq.${existing[0].id}`, {
      method: "PATCH",
      headers: H,
      body: JSON.stringify({ ...body, updated_at: new Date().toISOString() }),
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`PATCH ${slug}: ${res.status} ${text}`);
    console.log("atualizado", slug);
    return JSON.parse(text)[0];
  }
  const res = await fetch(`${SB}/rest/v1/blog_templum_posts`, {
    method: "POST",
    headers: H,
    body: JSON.stringify(row),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`INSERT ${row.slug}: ${res.status} ${text}`);
  console.log("criado", row.slug);
  return JSON.parse(text)[0];
}

const post27002 = (() => {
  const slug = "iso-27001-e-iso-27002";
  const title = "ISO 27001 e ISO 27002: diferença, controles e quando usar cada uma";
  const seo_title = "ISO 27001 e ISO 27002: diferença e quando usar";
  const seo_description =
    "A ISO 27001 é certificável (SGSI + Anexo A). A ISO 27002 é o guia dos controles e não gera certificado. Veja a diferença e como usar as duas juntas.";
  const excerpt =
    "Comparativo claro: ISO 27001 certifica o sistema de gestão; ISO 27002 orienta a implementação dos controles do Anexo A.";
  const tldr =
    "A ISO/IEC 27001 define os requisitos do SGSI e lista os controles no Anexo A: é a norma contra a qual a empresa se certifica. A ISO/IEC 27002 detalha como implementar esses controles e não é certificável. Na prática, você audita contra a 27001 e consulta a 27002 para o \"como fazer\" de cada controle declarado na Declaração de Aplicabilidade.";
  const faq = [
    {
      pergunta: "Qual a diferença entre ISO 27001 e ISO 27002?",
      resposta:
        "<p>A <strong>27001</strong> traz requisitos de sistema de gestão (cláusulas 4 a 10) e a lista de controles do Anexo A: é certificável. A <strong>27002</strong> é um guia de implementação desses controles: explica propósito, orientação e outros detalhes, mas ninguém recebe certificado \"ISO 27002\".</p>",
    },
    {
      pergunta: "Preciso comprar as duas normas?",
      resposta:
        "<p>Para certificar, a referência auditável é a 27001. A 27002 ajuda quem implementa controles e quer orientação prática. Muitas equipes usam as duas: a 27001 para o que o auditor exige; a 27002 para desenhar o controle no dia a dia.</p>",
    },
    {
      pergunta: "A ISO 27002 substitui o Anexo A da 27001?",
      resposta:
        "<p>Não. O Anexo A da 27001 continua sendo a lista de referência para a Declaração de Aplicabilidade. A 27002 aprofunda cada controle; não elimina a obrigação de analisar e justificar aplicabilidade/exclusão na 27001.</p>",
    },
    {
      pergunta: "Posso me certificar só na ISO 27002?",
      resposta:
        "<p>Não. Não existe certificação de organização na ISO 27002. O certificado de SGSI é emitido contra a ISO/IEC 27001 por organismo acreditado.</p>",
    },
  ];
  const content = `<p>Quem busca <strong>ISO 27001 e ISO 27002</strong> quase sempre quer a mesma resposta: qual das duas gera certificado e qual só orienta. Em uma frase: a <a href="/iso-27001/">ISO 27001</a> é a norma <strong>certificável</strong> do Sistema de Gestão da Segurança da Informação (SGSI); a ISO 27002 é o <strong>guia</strong> dos controles e <strong>não</strong> gera certificado.</p>

<p><strong>Neste artigo:</strong></p>
<ul>
<li><a href="#resumo">Resumo em tabela</a></li>
<li><a href="#27001">O que a ISO 27001 exige</a></li>
<li><a href="#27002">O que a ISO 27002 entrega</a></li>
<li><a href="#juntos">Como usar as duas na implementação</a></li>
<li><a href="#erros">Erros comuns ao misturar as duas</a></li>
<li><a href="#proximos">Próximos passos no cluster</a></li>
</ul>

<h2 id="resumo">ISO 27001 vs ISO 27002: resumo</h2>
<table>
<thead><tr><th>Ponto</th><th>ISO/IEC 27001</th><th>ISO/IEC 27002</th></tr></thead>
<tbody>
<tr><td>Tipo</td><td>Requisitos de sistema de gestão + Anexo A</td><td>Guia de controles de segurança da informação</td></tr>
<tr><td>Certificável?</td><td>Sim (organismo acreditado)</td><td>Não</td></tr>
<tr><td>O que o auditor usa</td><td>Cláusulas 4 a 10, SoA, evidência</td><td>Não é critério de certificação</td></tr>
<tr><td>Para que serve no projeto</td><td>Definir SGSI, risco, escopo, melhoria</td><td>Detalhar como implementar cada controle</td></tr>
<tr><td>Versão vigente (referência)</td><td>27001:2022 (+ Emenda 1:2024)</td><td>27002 alinhada à família 2022</td></tr>
</tbody>
</table>

<h2 id="27001">O que a ISO 27001 exige</h2>
<p>A ISO/IEC 27001 define o que a organização precisa ter para um SGSI auditável: contexto e escopo, liderança, planejamento de riscos, apoio (incluindo competência), operação, avaliação de desempenho e melhoria. O <strong>Anexo A</strong> lista os 93 controles da edição 2022. Nenhum controle é \"obrigatório por ser do Anexo A\": a empresa analisa todos e declara na <strong>Declaração de Aplicabilidade (SoA)</strong> o que aplica e o que exclui, com justificativa.</p>
<p>Detalhe cláusula a cláusula: <a href="/requisitos-da-iso-27001/">requisitos da ISO 27001</a>. Caminho até o certificado: <a href="/certificacao-iso-27001-etapas-prazo-custo/">etapas, prazo e preço</a>.</p>

<h2 id="27002">O que a ISO 27002 entrega</h2>
<p>A ISO/IEC 27002 não cria um segundo sistema de gestão paralelo. Ela descreve, para cada controle da família, propósito, orientação de implementação e considerações práticas. É o manual do \"como fazer\" depois que a avaliação de riscos e a SoA disseram <em>quais</em> controles importam.</p>
<p>Por isso quem copia a 27002 inteira como checklist de certificação erra o alvo: o auditor valida o SGSI da 27001 e a evidência dos controles declarados, não a leitura da 27002.</p>

<h2 id="juntos">Como usar as duas na implementação</h2>
<ol>
<li><strong>Comece pela 27001:</strong> escopo, contexto, avaliação de riscos e tratamento.</li>
<li><strong>Monte a SoA</strong> a partir do risco (e da lista do Anexo A), não a partir de um PDF da 27002 aberto na ordem.</li>
<li><strong>Consulte a 27002</strong> para desenhar o controle aplicável: política, processo, tecnologia e registro.</li>
<li><strong>Opere e meça</strong> o suficiente para haver histórico amostrável na auditoria.</li>
</ol>
<p>O passo a passo de projeto está em <a href="/como-implementar-a-iso-27001/">como implementar a ISO 27001</a> (implantação do SGSI).</p>

<h2 id="erros">Erros comuns ao misturar as duas</h2>
<ul>
<li>Pedir \"certificado ISO 27002\" a um organismo (não existe nesse formato).</li>
<li>Marcar os 93 controles como aplicáveis só porque a 27002 descreve todos.</li>
<li>Usar material ainda na lógica dos 114 controles / 14 seções da edição 2013.</li>
<li>Buscar \"norma PDF grátis\": a edição oficial se compra na ABNT/ISO; cópia pirata costuma estar desatualizada. Veja a FAQ no <a href=\"/iso-27001/#duvidas\">hub da ISO 27001</a>.</li>
</ul>

<h2 id="proximos">Próximos passos no cluster</h2>
<ul>
<li><a href="/iso-27001/">Hub ISO 27001</a>: o que é, versão 2022 e panorama</li>
<li><a href="/sgsi/">SGSI</a>: o sistema por trás do certificado</li>
<li><a href="/auditoria-iso-27001/">Auditoria ISO 27001</a>: o que o auditor pede</li>
<li><a href="/treinamento-iso-27001/">Treinamento ISO 27001</a>: competência da equipe (cláusula 7.2)</li>
</ul>
<p><a href="https://certificacaoiso.com.br/form/?utm_source=blog&utm_medium=banner-artigo&utm_campaign=iso-27001-e-iso-27002&amp;norma=ISO%2027001"><img src="/wp-content/uploads/2020/03/27001.webp" alt="Fale com a Templum sobre ISO 27001" loading="lazy" decoding="async"></a></p>
`;
  const now = new Date().toISOString();
  const w = words(content);
  return {
    title,
    slug,
    content,
    excerpt,
    tldr,
    faq,
    author_name: AUTHOR,
    category_id: CAT,
    category_name: CAT_NAME,
    tags: ["ISO 27001", "ISO 27002", "SGSI", "Anexo A", "controles", "segurança da informação"],
    status: "published",
    published_at: now,
    revised_at: now,
    seo_title,
    seo_description,
    seo_keywords: ["iso 27001 e 27002", "diferença iso 27001 27002", "iso 27002", "anexo a iso 27001"],
    canonical_url: `https://certificacaoiso.com.br/${slug}/`,
    reading_time_min: Math.max(4, Math.round(w / 200)),
  };
})();

const postTreinamento = (() => {
  const slug = "treinamento-iso-27001";
  const title = "Treinamento ISO 27001: competência da equipe no SGSI";
  const seo_title = "Treinamento ISO 27001: competência no SGSI (7.2)";
  const seo_description =
    "Treinamento ISO 27001 não é certificado da empresa. Veja o que a cláusula 7.2 exige de competência, conscientização e a diferença para certificação de pessoas.";
  const excerpt =
    "Como montar treinamento e evidência de competência no SGSI da ISO 27001, sem confundir com certificação da organização ou de pessoas.";
  const tldr =
    "Treinamento ISO 27001, no sentido da norma, é desenvolver e comprovar competência e conscientização das pessoas que afetam o SGSI (cláusulas 7.2 e 7.3). Não substitui o certificado da organização nem a certificação profissional de auditor/implementador. O essencial é: determinar competência necessária, fornecer formação ou tomar outras ações, avaliar eficácia e guardar evidência.";
  const faq = [
    {
      pergunta: "O que é treinamento ISO 27001?",
      resposta:
        "<p>É a capacitação (e a evidência) que torna a equipe competente para operar o SGSI: política, papéis, controles aplicáveis, tratamento de incidente e o que cada função precisa saber. A norma exige competência determinada e comprovada, não um curso com nome de marketing.</p>",
    },
    {
      pergunta: "Treinamento certifica a empresa na ISO 27001?",
      resposta:
        "<p>Não. A empresa se certifica com auditoria de organismo acreditado sobre o SGSI implantado. Treinamento é apoio (cláusula 7.2/7.3). Veja <a href=\"/certificacao-iso-27001-etapas-prazo-custo/\">etapas, prazo e preço da certificação</a>.</p>",
    },
    {
      pergunta: "Qual a diferença entre treinamento e certificação ISO 27001 para pessoas?",
      resposta:
        "<p><strong>Treinamento</strong> desenvolve competência no contexto do SGSI da empresa. <strong>Certificação de pessoas</strong> (auditor interno, auditor líder, implementador) é credencial profissional, em geral com exame, emitida por organismo de pessoas. Detalhe em <a href=\"/certificacao-iso-27001-para-pessoas/\">certificação ISO 27001 para pessoas</a>.</p>",
    },
    {
      pergunta: "Preciso treinar todo mundo nos 93 controles?",
      resposta:
        "<p>Não. Treine pelo papel: quem opera um controle precisa da competência daquele controle; a direção precisa entender política, risco residual e análise crítica; usuários em geral precisam de conscientização (phishing, classificação, incidente). Competência é proporcional à função.</p>",
    },
    {
      pergunta: "Que evidência o auditor pede de treinamento?",
      resposta:
        "<p>Critérios de competência por função, plano ou matriz de treinamento, registros de participação, avaliação de eficácia (teste, observação, entrevista) e atualização quando o risco ou o cargo muda. Lista de presença sem eficácia costuma ser frágil no estágio 2.</p>",
    },
  ];
  const content = `<p><strong>Treinamento ISO 27001</strong> é uma das buscas mais confusas da família 27001: muita gente espera um \"curso que certifica a empresa\". A norma não funciona assim. Treinamento (e as demais ações de competência) existe para a equipe <strong>saber operar o SGSI</strong> e para a organização <strong>provar</strong> isso. O certificado da empresa sai de auditoria de organismo acreditado; a credencial profissional de auditor ou implementador é outro produto.</p>

<p><strong>Neste artigo:</strong></p>
<ul>
<li><a href="#o-que-e">O que a norma chama de competência e conscientização</a></li>
<li><a href="#7-2">O que a cláusula 7.2 exige na prática</a></li>
<li><a href="#publico">Quem treinar (por papel)</a></li>
<li><a href="#diferencas">Treinamento vs certificação da empresa vs certificação de pessoas</a></li>
<li><a href="#evidencia">Evidência que segura auditoria</a></li>
<li><a href="#erros">Erros que geram não conformidade</a></li>
</ul>

<h2 id="o-que-e">O que a norma chama de competência e conscientização</h2>
<p>Na <a href="/iso-27001/">ISO 27001</a>, competência (7.2) e conscientização (7.3) fazem parte do apoio ao SGSI. Competência é a capacidade de aplicar conhecimento e habilidade para alcançar os resultados pretendidos. Conscientização é garantir que as pessoas entendam a política de segurança da informação, a contribuição delas para a eficácia do SGSI e as implicações de não atender aos requisitos.</p>
<p>Em português de projeto: não basta um slide anual genérico. É preciso ligar o treinamento ao <strong>risco</strong>, aos <strong>controles aplicáveis</strong> e ao <strong>papel</strong> de cada um.</p>

<h2 id="7-2">O que a cláusula 7.2 exige na prática</h2>
<ol>
<li><strong>Determinar a competência necessária</strong> das pessoas que afetam o desempenho do SGSI.</li>
<li><strong>Assegurar</strong> que essas pessoas sejam competentes com base em educação, treinamento ou experiência.</li>
<li>Onde couber, <strong>tomar ações</strong> para adquirir a competência (treinar, contratar, realocar) e <strong>avaliar a eficácia</strong> das ações.</li>
<li><strong>Reter informação documentada</strong> apropriada como evidência de competência.</li>
</ol>
<p>O detalhe dos requisitos de gestão está em <a href="/requisitos-da-iso-27001/">requisitos da ISO 27001</a>. A implantação completa do sistema: <a href="/como-implementar-a-iso-27001/">como implementar a ISO 27001</a>.</p>

<h2 id="publico">Quem treinar (por papel)</h2>
<ul>
<li><strong>Direção:</strong> política, aceitação de risco residual, análise crítica, recursos.</li>
<li><strong>Dono do SGSI / segurança da informação:</strong> risco, SoA, indicadores, tratamento de incidente, preparação para auditoria.</li>
<li><strong>TI e operações:</strong> controles tecnológicos aplicáveis (acesso, backup, logging, mudança).</li>
<li><strong>RH e gestores:</strong> admissão, desligamento, termos, conscientização recorrente.</li>
<li><strong>Todos no escopo:</strong> classificação básica, phishing, reporte de incidente, uso aceitável.</li>
</ul>

<h2 id="diferencas">Treinamento vs certificação da empresa vs certificação de pessoas</h2>
<table>
<thead><tr><th></th><th>Treinamento no SGSI</th><th>Certificação da organização</th><th>Certificação de pessoas</th></tr></thead>
<tbody>
<tr><td>Objeto</td><td>Competência da equipe</td><td>SGSI da empresa</td><td>Credencial do profissional</td></tr>
<tr><td>Quem \"emite\"</td><td>A própria empresa (registro interno) ou o provedor do curso</td><td>Organismo de certificação acreditado</td><td>Organismo de certificação de pessoas</td></tr>
<tr><td>Substitui o outro?</td><td>Não</td><td>Não</td><td>Não</td></tr>
</tbody>
</table>
<p>Se a busca for credencial de auditor ou implementador, vá para <a href="/certificacao-iso-27001-para-pessoas/">certificação ISO 27001 para pessoas</a>.</p>

<h2 id="evidencia">Evidência que segura auditoria</h2>
<ul>
<li>Matriz de competência por função (o que cada papel precisa saber fazer).</li>
<li>Plano de treinamento alinhado a riscos e a mudanças (novo sistema, novo controle, incidente).</li>
<li>Registro de participação com data e conteúdo.</li>
<li>Avaliação de eficácia (não só lista de presença): teste curto, observação, entrevista, indicador.</li>
<li>Reciclagem quando o cargo ou o risco muda.</li>
</ul>

<h2 id="erros">Erros que geram não conformidade</h2>
<ul>
<li>Um único treinamento genérico para todos os papéis, sem critério de competência.</li>
<li>Lista de presença sem avaliação de eficácia.</li>
<li>Material ainda na edição 2013 (114 controles / 14 seções) depois do fim da transição em out/2025.</li>
<li>Achar que certificado de curso do colaborador = certificado ISO 27001 da empresa.</li>
</ul>

<p>Para o caminho completo até o certificado organizacional: <a href="/certificacao-iso-27001-etapas-prazo-custo/">certificação ISO 27001: etapas, prazo e preço</a>. Para o panorama da norma: <a href="/iso-27001/">ISO 27001</a>.</p>
<p><a href="https://certificacaoiso.com.br/form/?utm_source=blog&utm_medium=banner-artigo&utm_campaign=treinamento-iso-27001&amp;norma=ISO%2027001"><img src="/wp-content/uploads/2020/03/27001.webp" alt="Fale com a Templum sobre ISO 27001" loading="lazy" decoding="async"></a></p>
`;
  const now = new Date().toISOString();
  const w = words(content);
  return {
    title,
    slug,
    content,
    excerpt,
    tldr,
    faq,
    author_name: AUTHOR,
    category_id: CAT,
    category_name: CAT_NAME,
    tags: ["ISO 27001", "treinamento", "competência", "SGSI", "cláusula 7.2", "conscientização"],
    status: "published",
    published_at: now,
    revised_at: now,
    seo_title,
    seo_description,
    seo_keywords: ["treinamento iso 27001", "curso iso 27001", "competência iso 27001", "capacitação sgsi"],
    canonical_url: `https://certificacaoiso.com.br/${slug}/`,
    reading_time_min: Math.max(4, Math.round(w / 200)),
  };
})();

async function main() {
  const a = await upsertPost(post27002);
  const b = await upsertPost(postTreinamento);
  console.log("OK", {
    "27002": { id: a.id, slug: a.slug, words: words(post27002.content) },
    treinamento: { id: b.id, slug: b.slug, words: words(postTreinamento.content) },
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
