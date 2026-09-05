#!/usr/bin/env node
/** Expande o guia iso-42001 para ~11–12 min e regrava no Supabase. */
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
const SLUG = "iso-42001";

const tldr =
  "A ISO/IEC 42001 é a norma de sistema de gestão de inteligência artificial (SGIA): define o que a organização precisa governar para desenvolver, fornecer ou usar IA de forma responsável — não o algoritmo em si. Serve a quem produz modelos, a quem entrega soluções em cima de plataformas e a quem só usa IA em processos críticos; o escopo pode combinar papéis. No planejamento, a norma separa avaliação de risco (ótica da organização) de avaliação de impacto (indivíduos, grupos e sociedade). Há anexos com controles aplicáveis via declaração de aplicabilidade. A certificação é voluntária e cíclica: auditoria inicial em duas fases, manutenção anual e recertificação a cada três anos.";

const content = `<p>Empresas de todo porte passaram a dizer que “usam inteligência artificial”. Poucas conseguem responder, com evidência, quem autoriza o uso, quais dados entram no modelo, que risco isso cria para o negócio e que impacto pode causar em pessoas que nem são clientes. A <strong>ISO/IEC 42001</strong> existe para transformar essa conversa em sistema de gestão — o mesmo tipo de disciplina que a indústria já conhece na <a href="/iso-9001/">ISO 9001</a> e na <a href="/iso-27001/">ISO 27001</a>, agora aplicado à IA.</p>

<p>Este guia reúne o essencial para decidir se a norma cabe na sua organização: o que ela é, para quem serve, a diferença entre risco e impacto, o papel dos anexos de controle e como funciona a certificação. Não é manual de implementação cláusula a cláusula. É o mapa que falta quando a busca é só “ISO 42001” e o mercado ainda mistura marketing de ferramenta com governança de verdade.</p>

<h2 id="o-que-e-a-iso-42001">O que é a ISO/IEC 42001</h2>

<p>A ISO/IEC 42001 é a norma de requisitos para um <strong>Sistema de Gestão de Inteligência Artificial (SGIA)</strong>. Publicada em dezembro de 2023, foi a primeira norma ISO de sistema de gestão dedicada a essa disciplina. O foco não é ensinar a treinar um modelo: é exigir que a organização <strong>desenvolva, forneça ou use</strong> sistemas de IA de maneira responsável, com políticas, papéis, riscos, impactos, controles e melhoria contínua.</p>

<p>Como as demais normas de gestão da família ISO, ela segue a estrutura de alto nível (Anexo SL / HLS): cláusulas de contexto da organização, liderança, planejamento, apoio, operação, avaliação de desempenho e melhoria. Quem já vive um SGQ ou um SGSI reconhece o esqueleto. O que muda é o objeto — inteligência artificial — e um conjunto de exigências que não existem, no mesmo formato, na 9001 ou na 27001.</p>

<p>Essa estrutura comum não é detalhe acadêmico. Ela é o que permite integrar a 42001 a sistemas já certificados sem reinventar contexto, liderança, informação documentada ou análise crítica. O trabalho novo está no recorte: inventário de usos de IA, declaração de papéis, avaliação de impacto, ciclo de vida do sistema e dos dados, controles do anexo aplicável e relacionamento com terceiros que entregam ou consomem IA.</p>

<p>Três ideias práticas para não distorcer a norma:</p>
<ul>
<li>ela diz <strong>o quê</strong> precisa ser governado, não o “como” técnico de cada algoritmo;</li>
<li>é <strong>voluntária</strong>: ninguém é obrigado a se certificar só porque a norma existe;</li>
<li>ela <strong>não substitui</strong> segurança da informação, privacidade nem qualidade — costuma caminhar junto.</li>
</ul>

<p>A ponte com privacidade já aparece no blog: na discussão da <a href="/iso-27701-2025-o-que-muda-independencia-da-iso-27001/">ISO 27701:2025</a>, a 42001 entra como referência natural quando decisões automatizadas e ética algorítmica entram no radar do programa de privacidade. Governança de IA e proteção de dados se tocam; não são a mesma coisa.</p>

<p>Vale também separar “usar uma ferramenta de IA” de “compreender o sistema”. Operar um assistente generativo no dia a dia não equivale a dominar machine learning, visão computacional ou qualidade de dado de treinamento. A 42001 não pede que todo gestor vire cientista de dados. Pede que a organização saiba o que está em produção, sob qual regra, com qual risco e com qual impacto.</p>

<h2 id="para-quem-serve-e-os-papeis">Para quem serve — e os três papéis</h2>

<p>A pergunta certa não é “usamos alguma ferramenta de IA?”. É: <strong>qual o nosso papel em relação à inteligência artificial</strong> e quão crítico esse uso é para o resultado do negócio e para terceiros.</p>

<p>A norma trabalha com papéis que a organização declara no escopo. Em linguagem de implantação, três frentes cobrem a maior parte dos casos:</p>
<ul>
<li><strong>Produtor</strong> — desenvolve o sistema ou o modelo de IA (o “core” é criar a capacidade).</li>
<li><strong>Fornecedor</strong> — entrega soluções, produtos ou serviços que incorporam IA, muitas vezes sobre plataformas ou modelos já existentes.</li>
<li><strong>Usuário</strong> — emprega IA em processos internos ou em decisões operacionais (atendimento, crédito, triagem, produtividade, qualidade).</li>
</ul>

<p>O escopo <strong>pode combinar</strong> papéis. Uma empresa que vende um produto com IA e ainda usa modelos generativos no backoffice pode precisar cobrir as duas frentes no mesmo SGIA — ou delimitar conscientemente o que fica dentro e o que fica fora, com justificativa. Começar um projeto sem clareza de papel é o que gera proposta comercial genérica e sistema que não fecha com a operação.</p>

<p>Exemplos setoriais (genéricos) ajudam a calibrar risco:</p>
<ul>
<li>software de apoio a diagnóstico por imagem na saúde — viés, explicabilidade, dado sensível;</li>
<li>visão computacional na linha de montagem — falso positivo/negativo, descarte indevido;</li>
<li>modelo de crédito — discriminação, transparência da decisão automatizada;</li>
<li>recomendação e personalização no varejo — perfil, base legal, excesso de exposição;</li>
<li>sistemas com efeito sobre segurança de pessoas — impacto que ultrapassa o usuário direto;</li>
<li>escritório que cola dado confidencial em ferramenta pública — o clássico <strong>shadow AI</strong>: a organização não homologou, mas o trabalho “aparece pronto”.</li>
</ul>

<p>Shadow AI merece um parágrafo próprio porque é o caso mais comum em empresas que “ainda não têm projeto de IA”. Colaboradores usam contas gratuitas ou canais não oficiais para ganhar velocidade. A organização não vê o fluxo, não classifica o dado e não sabe se a saída foi validada. Do ponto de vista de gestão, isso já é uso de IA — só que sem perímetro. Política, conscientização e canais homologados não são burocracia: são o mínimo para o inventário não mentir.</p>

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

<p>Um detalhe de método: em várias normas de gestão, planejamento e operação se espelham — você planeja o tratamento de risco e depois executa o tratamento. Na 42001, a mesma disciplina vale para impacto. Não basta um workshop único no kick-off. Sistemas mudam, dados mudam, o modelo é retreinado, o fornecedor troca a API. Reavaliar faz parte do ciclo, não é enfeite de auditoria.</p>

<h2 id="anexos-e-controles">Anexos, controles e declaração de aplicabilidade</h2>

<p>Além das cláusulas 4 a 10, a 42001 traz anexos. Dois pontos importam na primeira leitura:</p>
<ul>
<li><strong>Anexo A (normativo)</strong> — conjunto de controles potenciais de IA (na ordem de quase quatro dezenas). Funciona de modo análogo ao anexo de controles da 27001: a organização avalia aplicabilidade ao seu escopo e papéis e registra isso numa <strong>declaração de aplicabilidade</strong>.</li>
<li><strong>Anexo B (normativo)</strong> — orientação para implementar os controles do Anexo A. Por ser normativo, não é “dica opcional”: ele amarra a interpretação do que foi declarado aplicável.</li>
</ul>

<p>Há ainda anexos informativos (objetivos e fontes de risco; uso entre domínios/setores) que ajudam o desenho, sem a mesma obrigatoriedade dos normativos.</p>

<p>Os controles se organizam em grupos familiares a quem implementa: políticas e organização interna; recursos; avaliação de impactos; ciclo de vida do sistema de IA; <strong>dados</strong> para sistemas de IA; informação às partes interessadas; uso dos sistemas; relacionamento com terceiros e clientes. O mantra que segura a operação é simples: <strong>dado ruim gera IA ruim</strong>. Qualidade, pertinência e viés nos dados de treinamento e de operação não são detalhe de ciência de dados — são requisito de gestão.</p>

<p>Cadeia de fornecimento entra no mesmo pacote. Há fornecedores que entregam componente de IA e fornecedores que usam IA para gerar o que você compra. Due diligence de segurança e privacidade já é rotina em muitas empresas; due diligence de IA começa a aparecer nos questionários de cliente. Um SGIA com escopo claro e certificado válido, quando o escopo casa com o que o cliente pergunta, reduz atrito comercial — sem substituir a análise caso a caso.</p>

<p>Família e referências públicas úteis (sem substituir a norma): documentos de terminologia e ciclo de vida de dados na órbita ISO; o AI Risk Management Framework do NIST; o Top 10 de riscos para modelos de linguagem da OWASP; princípios de IA responsável da OCDE. São leituras de apoio — a certificação cobra a 42001 e as evidências do seu SGIA.</p>

<h2 id="pdca-do-sgia">O PDCA por trás das cláusulas</h2>

<p>Quem já implementou outra norma ISO reconhece o filme. Contexto e partes interessadas alimentam o escopo. Liderança define política de IA e autoridades. Planejamento trata risco, oportunidade, objetivos e impacto. Apoio cobre competência, conscientização, comunicação e informação documentada. Operação executa o que foi planejado — inclusive tratamento de risco e avaliação de impacto na prática. A cláusula 9 mede, audita internamente e leva resultado à análise crítica. A cláusula 10 trata não conformidade e melhoria contínua.</p>

<p>O detalhe cultural importa: sistema de gestão não é projeto de um departamento de “inovação”. Direção, riscos, compras, jurídico, privacidade, segurança da informação, donos de processo e times técnicos aparecem em papéis diferentes. Se a qualidade (ou a TI) carrega sozinha, o SGIA vira pasta. Se a alta direção só assina a política e some, a auditoria externa eventualmente encontra o buraco — ou o mercado encontra antes, num incidente.</p>

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

<p>Regulação caminha em paralelo. O AI Act europeu e projetos de lei no Brasil reforçam a demanda por governança demonstrável; o texto legal muda e precisa ser monitorado (a própria norma pede atenção ao ambiente de requisitos). Confira sempre o status vigente na sua operação — este artigo não substitui assessoria jurídica. Certificado não é atalho para ignorar a lei: é evidência organizada de que a organização leva o tema a sério.</p>

<h2 id="quando-faz-sentido">Quando a 42001 faz sentido (e quando ainda não)</h2>

<p>Nem toda organização que “brinca” com um assistente generativo precisa abrir um projeto de certificação amanhã. O critério útil é combinação de <strong>criticidade</strong>, <strong>exposição</strong> e <strong>pressão de mercado</strong>.</p>

<p>Faz sentido acelerar quando pelo menos um destes sinais aparece com frequência:</p>
<ul>
<li>a IA já entra em decisão que afeta cliente, paciente, trabalhador, crédito, segurança ou acesso a direito;</li>
<li>dado sensível, confidencial ou de terceiro circula em prompts, treinos ou integrações;</li>
<li>cliente, edital ou parceiro começa a pedir evidência de governança de IA (questionário, cláusula, due diligence);</li>
<li>a empresa vende produto ou serviço em que a IA é parte do valor entregue — ou seja, o papel de fornecedor (ou produtor) já é comercial;</li>
<li>incidentes ou quase-incidentes já ocorreram: vazamento via ferramenta, decisão enviesada, alucinação operada como fato, uso shadow sem trilha.</li>
</ul>

<p>Pode esperar (sem fingir que o tema não existe) quando o uso ainda é experimental, isolado, sem dado crítico e sem efeito sobre pessoas — desde que exista política mínima, canal homologado e inventário honestamente atualizado. “Esperar” não é “ignorar”. Shadow AI cresce no silêncio.</p>

<p>Há também o meio-termo inteligente: implantar o SGIA em escopo piloto (um produto, uma unidade, um processo) e expandir depois. Escopo estreito e verdadeiro costuma valer mais do que escopo largo e teatro.</p>

<h2 id="integracao-com-outros-sistemas">Integração com 9001, 27001 e privacidade</h2>

<p>A 42001 não pede que a organização desmonte o que já funciona. Pede que o objeto “inteligência artificial” entre no perímetro de gestão com a mesma seriedade dos demais sistemas.</p>

<p>Na prática de integração:</p>
<ul>
<li>com a <a href="/iso-9001/">ISO 9001</a>, aproveite contexto, liderança, competência, informação documentada, não conformidade e melhoria — e acrescente requisitos de ciclo de vida, dados e impacto onde o SGQ ainda fala só de “produto/serviço” genérico;</li>
<li>com a <a href="/iso-27001/">ISO 27001</a>, trate confidencialidade, integridade e disponibilidade dos ativos que sustentam a IA; a 42001 não substitui controles de SGSI, e o SGSI sozinho não cobre avaliação de impacto societário da IA;</li>
<li>com privacidade e <a href="/lgpd/">LGPD</a> (e com a discussão da <a href="/iso-27701-2025-o-que-muda-independencia-da-iso-27001/">ISO 27701:2025</a>), alinhe base legal, minimização, direitos do titular e transparência em decisões automatizadas — temas que se tocam com impacto e informação às partes interessadas.</li>
</ul>

<p>O erro clássico de integração é criar três pastas paralelas (qualidade, segurança, “comitê de IA”) que não compartilham inventário nem linguagem de risco. O acerto é um mapa único de usos de IA, papéis claros e donos de processo que sabem qual sistema de gestão cobra o quê.</p>

<h2 id="erros-comuns">Erros comuns na primeira onda</h2>

<p>Quem chega cedo à 42001 costuma tropeçar nos mesmos pontos:</p>
<ul>
<li><strong>confundir ferramenta com sistema</strong> — comprar licença de modelo generativo não é implementar SGIA;</li>
<li><strong>escopo de marketing</strong> — declarar “toda a organização” sem inventário nem papéis definidos;</li>
<li><strong>só risco interno</strong> — planilha de ameaças ao negócio sem avaliação de impacto em pessoas;</li>
<li><strong>anexo decorativo</strong> — declaração de aplicabilidade copiada, sem justificativa de exclusão;</li>
<li><strong>fornecedor invisível</strong> — API de terceiros muda o modelo e ninguém reavalia;</li>
<li><strong>projeto de TI isolado</strong> — jurídico, privacidade, operações e direção fora da mesa;</li>
<li><strong>auditoria-teatro</strong> — evidência fabricada na véspera, cultura de shadow AI intacta no dia seguinte.</li>
</ul>

<p>Nenhum desses erros é exclusivo da 42001 — mas em IA o ciclo de mudança é mais rápido. O sistema precisa nascer já preparado para reavaliar, não para “congelar um PDF e celebrar”.</p>

<h2 id="por-onde-comecar">Por onde começar segunda-feira</h2>

<p>Cinco movimentos cabem antes de qualquer proposta comercial grande:</p>
<ul>
<li>liste onde a IA já aparece (oficial e shadow) e classifique o papel: produtor, fornecedor, usuário;</li>
<li>escolha um sistema crítico e rascunhe risco (para a empresa) e impacto (para pessoas);</li>
<li>alinhe segurança da informação e privacidade — a 42001 não apaga a <a href="/iso-27001/">27001</a> nem a <a href="/lgpd/">LGPD</a>;</li>
<li>defina quem decide homologar ferramenta, quem pode conectar dado e quem responde por incidente;</li>
<li>decida se o próximo passo é política + inventário, piloto de SGIA ou preparação para certificação — três profundidades diferentes, com orçamentos diferentes.</li>
</ul>

<p>Com isso, o escopo deixa de ser slogan e vira fronteira auditável. O restante é o PDCA de sempre: planejar, operar, medir, corrigir e melhorar — agora com inteligência artificial dentro do perímetro consciente da gestão.</p>

<p>Se a busca que trouxe você até aqui foi só “ISO 42001”, leve três frases: a norma governa o <em>sistema</em>, não o hype do modelo; risco e impacto são análises irmãs, não sinônimos; e certificado só sustenta o que a operação já consegue evidenciar no dia a dia.</p>`;

const words = content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
const reading = Math.max(1, Math.round(words / 230));

const patch = await fetch(`${SB}/rest/v1/blog_templum_posts?slug=eq.${SLUG}`, {
  method: "PATCH",
  headers: {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  },
  body: JSON.stringify({ content, tldr, reading_time_min: reading }),
});
const body = await patch.text();
if (!patch.ok) {
  console.error(patch.status, body);
  process.exit(1);
}
const [p] = JSON.parse(body);
console.log({ slug: p.slug, words, reading_time_min: p.reading_time_min, chars: p.content.length });
