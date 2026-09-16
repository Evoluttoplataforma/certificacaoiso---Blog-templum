#!/usr/bin/env node
/**
 * ISO 27001 SEO/GEO (set/2026): hub + satellites (SEM consultoria).
 * - draft + 301 de /vantagens-da-iso-27001/
 * - seo_title / seo_description (CTR)
 * - FAQ PDF + link 27002/treinamento no hub
 * - bloco E-E-A-T (experiência SoA)
 * - reforço preço / implantação / cruzamento pessoas↔treinamento
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
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
const KEY = process.env.SUPABASE_SERVICE_KEY;
if (!KEY) {
  console.error("Falta SUPABASE_SERVICE_KEY no .env");
  process.exit(1);
}

async function getPost(slug) {
  const url = `${SB}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}&select=id,slug,content,seo_title,seo_description,tldr,faq,status`;
  const res = await fetch(url, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  if (!res.ok) throw new Error(`GET ${slug}: ${res.status} ${await res.text()}`);
  const rows = await res.json();
  if (!rows[0]) throw new Error(`Post não encontrado: ${slug}`);
  return rows[0];
}

async function patch(slug, body) {
  const res = await fetch(`${SB}/rest/v1/blog_templum_posts?slug=eq.${encodeURIComponent(slug)}`, {
    method: "PATCH",
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ ...body, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) throw new Error(`PATCH ${slug}: ${res.status} ${await res.text()}`);
  console.log("ok", slug, Object.keys(body).join(","));
}

function insertOnce(content, marker, insertion) {
  if (content.includes(insertion.trim().slice(0, 70))) return content;
  if (!content.includes(marker)) throw new Error(`Marker não encontrado: ${marker.slice(0, 60)}…`);
  return content.replace(marker, `${marker}${insertion}`);
}

function replaceAll(content, from, to) {
  if (!content.includes(from)) return content;
  return content.split(from).join(to);
}

const hubFaq = [
  {
    pergunta: "O que é a ISO 27001?",
    resposta:
      "<p>A ISO/IEC 27001 é a norma internacional que define os requisitos de um <strong>Sistema de Gestão da Segurança da Informação (SGSI)</strong>. Em vez de prescrever tecnologias, ela exige que a empresa identifique os riscos das suas informações e aplique controles proporcionais a esses riscos, protegendo confidencialidade, integridade e disponibilidade.</p>",
  },
  {
    pergunta: "Qual é a versão atual da ISO 27001?",
    resposta:
      "<p>A <strong>ISO/IEC 27001:2022</strong>, com a Emenda 1 de 2024. A versão 2013 saiu de circulação: o período de transição terminou em 31 de outubro de 2025 e os certificados na edição antiga não valem mais. <a href=\"#versao-2022\">Veja o que mudou</a>.</p>",
  },
  {
    pergunta: "A ISO 27001 é obrigatória?",
    resposta:
      "<p>Não por lei. Mas na prática virou exigência contratual: aparece como critério de habilitação em licitações, em processos de compra de grandes empresas e em contratos que envolvem dados de terceiros. Veja <a href=\"/empresas-que-precisam-da-iso-27001/\">quais empresas precisam da ISO 27001</a>.</p>",
  },
  {
    pergunta: "Quantos controles tem o Anexo A da ISO 27001?",
    resposta:
      "<p>São <strong>93 controles</strong> na versão 2022, agrupados em quatro temas: 37 organizacionais, 8 de pessoas, 14 físicos e 34 tecnológicos. A versão 2013 tinha 114 controles em 14 seções. Nenhum controle é obrigatório em si: a empresa justifica o que aplica e o que exclui na Declaração de Aplicabilidade.</p>",
  },
  {
    pergunta: "Qual a diferença entre ISO 27001 e ISO 27002?",
    resposta:
      "<p>A <strong>ISO 27001 é certificável</strong>: traz os requisitos do sistema de gestão e a lista de controles do Anexo A. A <strong>ISO 27002 não é certificável</strong>: é o guia que detalha como implementar cada um daqueles controles. Comparativo completo em <a href=\"/iso-27001-e-iso-27002/\">ISO 27001 e ISO 27002</a>.</p>",
  },
  {
    pergunta: "Onde obter a norma ISO 27001 em PDF?",
    resposta:
      "<p>Não há PDF gratuito legal da norma. A edição oficial (ABNT NBR ISO/IEC 27001:2022) é comprada no <a href=\"https://www.abntcatalogo.com.br/\" rel=\"noopener noreferrer\" target=\"_blank\">catálogo da ABNT</a> ou na loja da ISO. Sites que oferecem \"norma ISO 27001 PDF grátis\" distribuem cópia não autorizada e costumam estar desatualizados (ainda na edição 2013).</p>",
  },
  {
    pergunta: "ISO 27001 e LGPD são a mesma coisa?",
    resposta:
      "<p>Não. A LGPD é lei brasileira e trata de <strong>dados pessoais</strong>; a ISO 27001 é uma norma voluntária e trata de <strong>toda informação relevante para o negócio</strong>. Elas se apoiam: o SGSI da 27001 é a estrutura que sustenta boa parte das obrigações da LGPD. Veja a <a href=\"/relacao-do-lgpd-com-a-iso-27001/\">relação entre a LGPD e a ISO 27001</a>.</p>",
  },
  {
    pergunta: "Quanto tempo demora para certificar na ISO 27001?",
    resposta:
      "<p>Uma organização de porte médio costuma levar cerca de <strong>12 meses</strong>, contando implementação e auditoria. O prazo depende de três variáveis: quem participa do projeto, quanto tempo essas pessoas conseguem dedicar e o método escolhido. <a href=\"#tempo\">Veja o detalhamento</a>.</p>",
  },
  {
    pergunta: "Quem emite o certificado ISO 27001?",
    resposta:
      "<p>Um <strong>organismo de certificação acreditado</strong> (no Brasil, acreditado pelo Inmetro). A consultoria prepara a empresa e o organismo certificador audita e emite o certificado: por exigência das regras de acreditação, quem consulta não pode certificar. A auditoria acontece em dois estágios e o certificado vale três anos, com auditorias de manutenção anuais.</p>",
  },
];

const experienciaBlock = `
<h2 id="experiencia-soa"><strong>O que o auditor cobra na Declaração de Aplicabilidade</strong></h2>
<p>Na prática de projetos de SGSI, o achado que mais atrasa a certificação não é \"falta de firewall\". É a <strong>Declaração de Aplicabilidade (SoA) de fachada</strong>: controle marcado como aplicável e implementado, sem registro que o auditor consiga amostrar (data, responsável, evidência).</p>
<p>Antes de chamar o organismo, faça o teste rápido: escolha três controles da sua SoA e peça o registro da última execução. Se os três aparecem em minutos, o sistema opera. Se precisam ser inventados na hora, ainda não está pronto para o estágio 2.</p>
`;

async function draftVantagens() {
  await patch("vantagens-da-iso-27001", { status: "draft" });
}

async function patchHub() {
  const post = await getPost("iso-27001");
  let content = post.content;

  content = replaceAll(
    content,
    'href="/vantagens-da-iso-27001/"',
    'href="/7-beneficios-da-iso-27001-para-o-seu-negocio/"',
  );
  content = replaceAll(
    content,
    ">vantagens da ISO 27001<",
    ">benefícios da ISO 27001<",
  );

  // Link canônico de implementação (não o satellite de erros)
  content = replaceAll(
    content,
    '<a href="/como-implementar-a-iso-27001-para-garantir-principal-beneficio/">Como implementar a norma na sua empresa</a>',
    '<a href="/como-implementar-a-iso-27001/">Como implementar a ISO 27001 (passo a passo)</a>',
  );

  if (!content.includes('href="/iso-27001-e-iso-27002/"')) {
    content = insertOnce(
      content,
      '<li><a href="/requisitos-da-iso-27001/">Requisitos da ISO 27001: as cláusulas 4 a 10</a></li>',
      '\n<li><a href="/iso-27001-e-iso-27002/">ISO 27001 e ISO 27002: diferença e quando usar cada uma</a></li>',
    );
  }

  if (!content.includes('href="/treinamento-iso-27001/"')) {
    content = insertOnce(
      content,
      '<li><a href="/7-beneficios-da-iso-27001-para-o-seu-negocio/">7 benefícios da ISO 27001 para o negócio</a></li>',
      '\n<li><a href="/treinamento-iso-27001/">Treinamento ISO 27001: competência da equipe no SGSI</a></li>\n<li><a href="/certificacao-iso-27001-para-pessoas/">Certificação ISO 27001 para pessoas</a></li>',
    );
  }

  if (!content.includes('id="experiencia-soa"')) {
    content = insertOnce(content, '<h2 id="erros">Os erros que mais reprovam na auditoria</h2>', experienciaBlock);
  }

  // FAQ 27002 no corpo: apontar artigo dedicado se ainda só texto
  content = replaceAll(
    content,
    "A ISO/IEC 27001 é a norma internacional que estabelece os requisitos de um Sistema de Gestão da Segurança da Informação — o SGSI.</strong> Publicada em conjunto pela ISO e pela IEC, é ela que gera o certificado auditável da segurança da informação; a ISO/IEC 27002, da mesma família, é guia de implementação dos controles e não é certificável.",
    'A ISO/IEC 27001 é a norma internacional que estabelece os requisitos de um Sistema de Gestão da Segurança da Informação — o SGSI.</strong> Publicada em conjunto pela ISO e pela IEC, é ela que gera o certificado auditável da segurança da informação; a <a href="/iso-27001-e-iso-27002/">ISO/IEC 27002</a>, da mesma família, é guia de implementação dos controles e não é certificável.',
  );

  await patch("iso-27001", {
    content,
    faq: hubFaq,
    seo_title: "ISO 27001:2022: o que é, SGSI, 93 controles e como certificar",
    seo_description:
      "O que é a ISO 27001:2022 (SGSI), os 93 controles do Anexo A, diferença para a 27002, etapas de certificação e por que a edição 2013 não vale mais desde out/2025.",
    revised_at: new Date().toISOString(),
  });
}

async function patchCertificacao() {
  const post = await getPost("certificacao-iso-27001-etapas-prazo-custo");
  let content = post.content;

  const precoBlock = `
<p id="preco-em-uma-frase"><strong>Preço da certificação ISO 27001, em uma frase:</strong> o valor cobrado pelo organismo é, em grande parte, função dos <strong>dias mínimos de auditoria</strong> definidos pela ISO/IEC 27006-1 (tamanho do escopo, complexidade e ciclo de três anos), mais o investimento de implementação (hora interna e, se houver, apoio externo). Não existe tabela única em reais válida para toda empresa.</p>
`;

  if (!content.includes('id="preco-em-uma-frase"')) {
    const marker = '<h2 id="custo">O que define o custo</h2>';
    if (!content.includes(marker)) throw new Error("Marker #custo não encontrado");
    content = content.replace(marker, `${marker}${precoBlock}`);
  }

  await patch("certificacao-iso-27001-etapas-prazo-custo", {
    content,
    seo_title: "Certificação ISO 27001: etapas, prazo e preço",
    seo_description:
      "Etapas da certificação ISO 27001, estágios 1 e 2, ciclo de 3 anos e o que define o preço (ISO/IEC 27006-1: dias de auditoria + escopo). Sem tabela mágica.",
    revised_at: new Date().toISOString(),
  });
}

async function patchImplementar() {
  const post = await getPost("como-implementar-a-iso-27001");
  let content = post.content;

  if (!content.toLowerCase().includes("implantação") && !content.toLowerCase().includes("implantacao")) {
    content = content.replace(
      "<p>Implementar a <a href=\"/iso-27001/\">ISO 27001</a>",
      "<p>A implantação da <a href=\"/iso-27001/\">ISO 27001</a> (implementar o SGSI) começa aqui. Implementar a <a href=\"/iso-27001/\">ISO 27001</a>",
    );
  }

  await patch("como-implementar-a-iso-27001", {
    content,
    seo_title: "Implantação ISO 27001: passo a passo da implementação",
    seo_description:
      "Como fazer a implantação da ISO 27001 de verdade: 11 etapas na ordem certa, quem faz o quê, evidência de cada fase e os erros que fazem o projeto recomeçar.",
    revised_at: new Date().toISOString(),
  });
}

async function patchPessoas() {
  const post = await getPost("certificacao-iso-27001-para-pessoas");
  let content = post.content;
  let faq = Array.isArray(post.faq) ? [...post.faq] : [];

  const cross = `<p>Se a sua dúvida é capacitar a equipe do SGSI (conscientização, papéis e competência da cláusula 7.2), o caminho é o <a href="/treinamento-iso-27001/">treinamento ISO 27001</a>. Se a dúvida é credencial profissional (auditor interno, auditor líder, implementador), continue neste artigo.</p>\n`;

  if (!content.includes('href="/treinamento-iso-27001/"')) {
    // inserir após o primeiro parágrafo
    const m = content.match(/^<p>[\s\S]*?<\/p>\n/);
    if (m) content = content.replace(m[0], m[0] + cross);
    else content = cross + content;
  }

  if (!faq.some((f) => /treinamento/i.test(f.pergunta || ""))) {
    faq.push({
      pergunta: "Treinamento ISO 27001 e certificação para pessoas são a mesma coisa?",
      resposta:
        "<p>Não. <strong>Treinamento</strong> desenvolve competência da equipe no SGSI (política, papéis, controles, evidência). <strong>Certificação de pessoas</strong> é credencial profissional emitida por organismo de pessoas (em geral com exame), distinta do certificado da empresa. Detalhe do treinamento em <a href=\"/treinamento-iso-27001/\">treinamento ISO 27001</a>.</p>",
    });
  }

  await patch("certificacao-iso-27001-para-pessoas", {
    content,
    faq,
    seo_title: "Certificação ISO 27001 para pessoas: existe? O que muda",
    seo_description:
      "A ISO 27001 certifica organizações, não pessoas. Veja o que existe de certificação de competência e a diferença para o treinamento da equipe no SGSI.",
    revised_at: new Date().toISOString(),
  });
}

async function main() {
  await draftVantagens();
  await patchHub();
  await patchCertificacao();
  await patchImplementar();
  await patchPessoas();
  console.log("Concluído. Não alterou consultoria-iso-27001 nem páginas do site.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
