#!/usr/bin/env node
/**
 * Publica o guia único ISO 42001 + retrofit no post 27701.
 * Uso: node supabase/posts/_publish-iso-42001.mjs
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

const CAT_IA = "3746146b-b1a5-4300-95ca-f24501355415";
const SLUG = "iso-42001";

const title = "ISO 42001: o que é, para quem serve e como certificar a gestão de inteligência artificial";
const seo_title = "ISO 42001: o que é, papéis, risco e certificação";
const seo_description =
  "O que é a ISO/IEC 42001, quem precisa (produtor, fornecedor ou usuário), diferença entre risco e impacto, anexos e como funciona a certificação do SGIA.";
const excerpt =
  "Guia prático da ISO/IEC 42001: sistema de gestão de inteligência artificial — papéis, avaliação de risco e de impacto, controles e ciclo de certificação.";
const tldr =
  "A ISO/IEC 42001 é a norma de sistema de gestão de inteligência artificial (SGIA): define o que a organização precisa governar para desenvolver, fornecer ou usar IA de forma responsável — não o algoritmo em si. Serve a quem produz modelos, a quem entrega soluções em cima de plataformas e a quem só usa IA em processos críticos; o escopo pode combinar papéis. No planejamento, a norma separa avaliação de risco (ótica da organização) de avaliação de impacto (indivíduos, grupos e sociedade). Há anexos com controles aplicáveis via declaração de aplicabilidade. A certificação é voluntária e ciclica: auditoria inicial em duas fases, manutenção anual e recertificação a cada três anos.";

const faq = [
  {
    pergunta: "O que é a ISO 42001?",
    resposta:
      "É a norma internacional de requisitos para um Sistema de Gestão de Inteligência Artificial (SGIA). Segue a estrutura de alto nível das normas ISO de gestão (contexto, liderança, planejamento, apoio, operação, avaliação e melhoria) e acrescenta obrigações específicas de governança, risco, impacto e controles ligados ao ciclo de vida da IA e dos dados.",
  },
  {
    pergunta: "Minha empresa precisa da ISO 42001 se só usa ChatGPT ou ferramentas parecidas?",
    resposta:
      "Depende do papel e do risco. Se a IA entra em processo crítico, em decisão sobre pessoas ou em dado sensível, a governança faz sentido mesmo sem você desenvolver o modelo. Uso pontual e não crítico pode ficar fora do escopo — mas shadow AI (uso não homologado pela organização) continua sendo risco de privacidade e de qualidade, com ou sem certificado.",
  },
  {
    pergunta: "Qual a diferença entre avaliação de risco e avaliação de impacto na 42001?",
    resposta:
      "A avaliação de risco olha o dano potencial para a organização (negócio, operação, conformidade). A avaliação de impacto olha o efeito sobre indivíduos, grupos de indivíduos e a sociedade — viés, discriminação, dano à vida, exclusão. As duas se complementam; tratar só o risco interno deixa de fora o que a norma exige sobre partes afetadas pela IA.",
  },
  {
    pergunta: "A ISO 42001 é obrigatória?",
    resposta:
      "Não. É adoção voluntária. Organizações buscam a certificação por estratégia de mercado, exigência de cliente, due diligence em cadeia de fornecimento ou alinhamento a regulações emergentes (como o AI Act europeu e discussões legislativas no Brasil). O status de leis nacionais muda — confira a norma e o texto legal vigentes na sua operação.",
  },
  {
    pergunta: "Como funciona a certificação na ISO 42001?",
    resposta:
      "Depois do contrato com um organismo de certificação, a auditoria inicial costuma ter duas fases: prontidão documental (fase 1) e verificação da implementação e eficácia em campo (fase 2). O certificado tipicamente vale três anos, com auditorias anuais de manutenção e recertificação ao fim do ciclo. Auditoria interna e análise crítica pela direção fazem parte do próprio sistema.",
  },
  {
    pergunta: "A ISO 42001 substitui a ISO 27001 ou a LGPD?",
    resposta:
      "Não. Todo sistema de IA também é sistema de informação: segurança e privacidade continuam necessárias. A 42001 se integra bem a SGSI e a programas de privacidade (incluindo a ISO 27701). Quem já tem 27001 aproveita a estrutura comum de gestão; o que se acrescenta é o recorte específico de IA — papéis, impacto, ciclo de vida e controles do anexo aplicável.",
  },
];

const content = `<p>Empresas de todo porte passaram a dizer que “usam inteligência artificial”. Poucas conseguem responder, com evidência, quem autoriza o uso, quais dados entram no modelo, que risco isso cria para o negócio e que impacto pode causar em pessoas que nem são clientes. A <strong>ISO/IEC 42001</strong> existe para transformar essa conversa em sistema de gestão — o mesmo tipo de disciplina que a indústria já conhece na <a href="/iso-9001/">ISO 9001</a> e na <a href="/iso-27001/">ISO 27001</a>, agora aplicado à IA.</p>

<p>Este guia reúne o essencial para decidir se a norma cabe na sua organização: o que ela é, para quem serve, a diferença entre risco e impacto, o papel dos anexos de controle e como funciona a certificação. Não é manual de implementação cláusula a cláusula. É o mapa que falta quando a busca é só “ISO 42001” e o mercado ainda misture marketing de ferramenta com governança de verdade.</p>

<h2 id="o-que-e-a-iso-42001">O que é a ISO/IEC 42001</h2>

<p>A ISO/IEC 42001 é a norma de requisitos para um <strong>Sistema de Gestão de Inteligência Artificial (SGIA)</strong>. Publicada em dezembro de 2023, foi a primeira norma ISO de sistema de gestão dedicada a essa disciplina. O foco não é ensinar a treinar um modelo: é exigir que a organização <strong>desenvolva, forneça ou use</strong> sistemas de IA de maneira responsável, com políticas, papéis, riscos, impactos, controles e melhoria contínua.</p>

<p>Como as demais normas de gestão da família ISO, ela segue a estrutura de alto nível (Anexo SL / HLS): cláusulas de contexto da organização, liderança, planejamento, apoio, operação, avaliação de desempenho e melhoria. Quem já vive um SGQ ou um SGSI reconhece o esqueleto. O que muda é o objeto — inteligência artificial — e um conjunto de exigências que não existem, no mesmo formato, na 9001 ou na 27001.</p>

<p>Três ideias práticas para não distorcer a norma:</p>
<ul>
<li>ela diz <strong>o quê</strong> precisa ser governado, não o “como” técnico de cada algoritmo;</li>
<li>é <strong>voluntária</strong>: ninguém é obrigado a se certificar só porque a norma existe;</li>
<li>ela <strong>não substitui</strong> segurança da informação, privacidade nem qualidade — costuma caminhar junto.</li>
</ul>

<p>A ponte com privacidade já aparece no blog: na discussão da <a href="/iso-27701-2025-o-que-muda-independencia-da-iso-27001/">ISO 27701:2025</a>, a 42001 entra como referência natural quando decisões automatizadas e ética algorítmica entram no radar do DPO. Governança de IA e proteção de dados se tocam; não são a mesma coisa.</p>

<h2 id="para-quem-serve-e-os-papeis">Para quem serve — e os três papéis</h2>

<p>A pergunta certa não é “usamos alguma ferramenta de IA?”. É: <strong>qual o nosso papel em relação à inteligência artificial</strong> e quão crítico esse uso é para o resultado do negócio e para terceiros.</p>

<p>A norma trabalha com papéis que a organização declara no escopo. Em linguagem de implantação, três frentes cobrem a maior parte dos casos:</p>
<ul>
<li><strong>Produtor</strong> — desenvolve o sistema ou o modelo de IA (o “core” é criar a capacidade).</li>
<li><strong>Fornecedor</strong> — entrega soluções, produtos ou serviços que incorporam IA, muitas vezes sobre plataformas ou modelos já existentes.</li>
<li><strong>Usuário</strong> — emprega IA em processos internos ou em decisões operacionais (atendimento, crédito, triagem, produtividade, qualidade).</li>
</ul>

<p>O escopo <strong>pode combinar</strong> papéis. Uma empresa que vende um produto com IA e ainda usa modelos generativos no backoffice pode precisar cobrir as duas frentes no mesmo SGIA — ou delimitar conscientemente o que fica dentro e o que fica fora, com justificativa.</p>

<p>Exemplos setoriais (genéricos) ajudam a calibrar risco:</p>
<ul>
<li>software de apoio a diagnóstico por imagem na saúde — viés, explicabilidade, dado sensível;</li>
<li>visão computacional na linha de montagem — falso positivo/negativo, descarte indevido;</li>
<li>modelo de crédito — discriminação, transparência da decisão automatizada;</li>
<li>recomendação e personalização no varejo — perfil, base legal, excesso de exposição;</li>
<li>sistemas com efeito sobre segurança de pessoas — impacto que ultrapassa o usuário direto;</li>
<li>escritório que cola dado confidencial em ferramenta pública — o clássico <strong>shadow AI</strong>: a organização não homologou, mas o trabalho “aparece pronto”.</li>
</ul>

<p>Se a IA ainda não é crítica e não toca dado sensível nem decisão sobre pessoas, pode não ser prioridade certificar agora. Se já está no processo-chave — ou se clientes e editais começam a pedir due diligence de IA — a 42001 deixa de ser curiosidade e vira linguagem comum de governança.</p>

<h2 id="risco-versus-impacto">Risco versus impacto: a distinção que mais separa amador de sistema</h2>

<p>No planejamento do SGIA, a norma exige ações para abordar riscos e oportunidades — e, de forma destacada, uma <strong>avaliação de impacto</strong> dos sistemas de inteligência artificial. Confundir as duas análises é o erro mais caro da implantação.</p>

<p><strong>Avaliação de risco de IA</strong> olha a organização: o que pode prejudicar objetivos, operação, reputação, conformidade e continuidade se o sistema falhar, vazar, viesar saída crítica ou for mal usado.</p>

<p><strong>Avaliação de impacto</strong> olha para fora (e para dentro, quando colaboradores são afetados): indivíduos, grupos de indivíduos e sociedade. Viés algorítmico, exclusão, dano à autonomia, risco à vida em aplicações críticas, efeitos em escala — tudo isso cabe aqui, mesmo quando o “KPI interno” ainda parece verde.</p>

<p>Na prática:</p>
<ul>
<li>risco sem impacto = empresa se protege e ainda pode machucar quem a IA atinge;</li>
<li>impacto sem risco = discurso ético sem plano de negócio nem controle operacional;</li>
<li>os dois juntos = o que a 42001 cobra para uso responsável.</li>
</ul>

<p>Essa lógica conversa com requisitos de decisão automatizada já familiares a quem trabalha <a href="/lgpd/">LGPD</a> e privacidade — e com a disciplina de risco que a <a href="/iso-27001/">ISO 27001</a> treinou no mercado. A 42001 não inventa a ideia de risco; ela obriga a enxergar o <em>outro lado</em> da equação: pessoas e sociedade.</p>

<h2 id="anexos-e-controles">Anexos, controles e declaração de aplicabilidade</h2>

<p>Além das cláusulas 4 a 10, a 42001 traz anexos. Dois pontos importam na primeira leitura:</p>
<ul>
<li><strong>Anexo A (normativo)</strong> — conjunto de controles potenciais de IA (na ordem de quase quatro dezenas). Funciona de modo análogo ao anexo de controles da 27001: a organização avalia aplicabilidade ao seu escopo e papéis e registra isso numa <strong>declaração de aplicabilidade</strong>.</li>
<li><strong>Anexo B (normativo)</strong> — orientação para implementar os controles do Anexo A. Por ser normativo, não é “dica opcional”: ele amarra a interpretação do que foi declarado aplicável.</li>
</ul>

<p>Há ainda anexos informativos (objetivos e fontes de risco; uso entre domínios/setores) que ajudam o desenho, sem a mesma obrigatoriedade dos normativos.</p>

<p>Os controles se organizam em grupos familiares a quem implementa: políticas e organização interna; recursos; avaliação de impactos; ciclo de vida do sistema de IA; <strong>dados</strong> para sistemas de IA; informação às partes interessadas; uso dos sistemas; relacionamento com terceiros e clientes. O mantra que segura a operação é simples: <strong>dado ruim gera IA ruim</strong>. Qualidade, pertinência e viés nos dados de treinamento e de operação não são detalhe de ciência de dados — são requisito de gestão.</p>

<p>Família e referências públicas úteis (sem substituir a norma): documentos de terminologia e ciclo de vida de dados na órbita ISO; o AI Risk Management Framework do NIST; o Top 10 de riscos para modelos de linguagem da OWASP; princípios de IA responsável da OCDE. São leituras de apoio — a certificação cobra a 42001 e as evidências do seu SGIA.</p>

<h2 id="como-funciona-a-certificacao">Como funciona a certificação</h2>

<p>Certificar-se é decisão estratégica, não obrigação legal automática. O ciclo segue a lógica das demais normas de gestão:</p>
<ol>
<li><strong>Contrato</strong> com organismo de certificação e definição de escopo (incluindo papéis em relação à IA).</li>
<li><strong>Auditoria inicial</strong> em duas fases: fase 1 (prontidão — documentação, políticas, auditoria interna, análise crítica); fase 2 (implementação e eficácia no dia a dia).</li>
<li><strong>Tratamento</strong> de não conformidades, quando houver, e emissão do certificado.</li>
<li><strong>Manutenção anual</strong> e <strong>recertificação</strong> ao fim do ciclo típico de três anos.</li>
</ol>

<p>Auditoria interna (primeira parte), auditoria de cliente/fornecedor (segunda parte) e auditoria de certificação (terceira parte) continuam sendo categorias distintas. A certificadora vende independência e credibilidade ao mercado; o SGIA existe para resultado de negócio e uso responsável — não para “passar na prova” duas semanas antes da visita.</p>

<p>Quem já mantém 27001 (ou outro sistema na estrutura HLS) encurta caminho na espinha de gestão. O trabalho novo está no recorte de IA: inventário de sistemas e usos, papéis, risco e impacto, controles aplicáveis, ciclo de vida, dados, fornecedores que entregam ou usam IA, e a cultura que reduz shadow AI.</p>

<p>Regulação caminha em paralelo. O AI Act europeu e projetos de lei no Brasil reforçam a demanda por governança demonstrável; o texto legal muda e precisa ser monitorado (a própria norma pede atenção ao ambiente de requisitos). Certificado não é atalho para ignorar a lei — é evidência organizada de que a organização leva o tema a sério.</p>

<h2 id="por-onde-comecar">Por onde começar segunda-feira</h2>

<p>Três movimentos cabem antes de qualquer proposta comercial:</p>
<ul>
<li>liste onde a IA já aparece (oficial e shadow) e classifique o papel: produtor, fornecedor, usuário;</li>
<li>escolha um sistema crítico e rascunhe risco (para a empresa) e impacto (para pessoas);</li>
<li>alinhe segurança da informação e privacidade — a 42001 não apaga a <a href="/iso-27001/">27001</a> nem a <a href="/lgpd/">LGPD</a>.</li>
</ul>

<p>Com isso, o escopo deixa de ser slogan e vira fronteira auditável. O restante é o PDCA de sempre: planejar, operar, medir, corrigir e melhorar — agora com inteligência artificial dentro do perímetro consciente da gestão.</p>`;

const words = content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
const reading = Math.max(1, Math.round(words / 230));

const H = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

async function main() {
  const check = await fetch(`${SB}/rest/v1/blog_templum_posts?slug=eq.${SLUG}&select=id,status`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  const existing = await check.json();
  if (Array.isArray(existing) && existing.length) {
    console.error("Slug já existe:", existing);
    process.exit(1);
  }

  const publishedAt = new Date().toISOString();
  const row = {
    title,
    slug: SLUG,
    content,
    excerpt,
    tldr,
    faq,
    author_name: "Daniela Albuquerque",
    category_id: CAT_IA,
    category_name: "IA",
    tags: [
      "ISO 42001",
      "ISO/IEC 42001",
      "inteligência artificial",
      "SGIA",
      "governança de IA",
      "certificação ISO 42001",
      "avaliação de impacto",
      "ISO 27001",
      "AI Act",
    ],
    status: "published",
    published_at: publishedAt,
    revised_at: publishedAt,
    seo_title,
    seo_description,
    seo_keywords: [
      "ISO 42001",
      "ISO/IEC 42001",
      "o que é ISO 42001",
      "certificação ISO 42001",
      "sistema de gestão de inteligência artificial",
      "avaliação de impacto IA",
      "ISO 42001 para quem serve",
    ],
    canonical_url: `https://certificacaoiso.com.br/${SLUG}/`,
    reading_time_min: reading,
  };

  const ins = await fetch(`${SB}/rest/v1/blog_templum_posts`, {
    method: "POST",
    headers: H,
    body: JSON.stringify(row),
  });
  const body = await ins.text();
  if (!ins.ok) {
    console.error("INSERT falhou", ins.status, body);
    process.exit(1);
  }
  const [post] = JSON.parse(body);
  console.log("OK post", {
    id: post.id,
    slug: post.slug,
    words,
    reading_time_min: post.reading_time_min,
    faq: post.faq?.length,
  });

  // Retrofit 27701: parágrafo com link ao pilar, se ainda não houver link relativo /iso-42001/
  const r277 = await fetch(
    `${SB}/rest/v1/blog_templum_posts?slug=eq.iso-27701-2025-o-que-muda-independencia-da-iso-27001&select=id,content`,
    { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } },
  );
  const rows277 = await r277.json();
  if (rows277?.[0] && !String(rows277[0].content).includes('href="/iso-42001/"')) {
    const old = rows277[0].content;
    const needle = "<strong>ISO/IEC 42001</strong>";
    let next = old;
    if (old.includes(needle) && !old.includes('href="/iso-42001/"')) {
      next = old.replace(
        needle,
        '<a href="/iso-42001/"><strong>ISO/IEC 42001</strong></a>',
      );
    }
    if (next !== old) {
      const p = await fetch(`${SB}/rest/v1/blog_templum_posts?id=eq.${rows277[0].id}`, {
        method: "PATCH",
        headers: H,
        body: JSON.stringify({ content: next }),
      });
      console.log("retrofit 27701", p.status);
    } else {
      console.log("retrofit 27701: padrão não encontrado, pule manualmente");
    }
  } else {
    console.log("retrofit 27701: já linkado ou post ausente");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
