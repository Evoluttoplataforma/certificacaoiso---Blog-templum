/** Reescrita GEO iso-45001-perigos: corpo enxuto, cláusula 6.1, cluster SST, sem travessão. */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));

const html = `<p><strong>Perigos e riscos</strong> são o núcleo da cláusula 6.1 da <a href="/iso-45001/">ISO 45001</a>: identificar fontes de dano, avaliar probabilidade e severidade, definir controles na <strong>hierarquia de controles</strong> e revisar após mudanças ou incidentes. No Brasil, o mesmo raciocínio alimenta o <strong>PGR</strong> da <a href="/nr-1/">NR-1</a>.</p>
<p>Guia do blog <strong>Certificação ISO</strong> (Templum). <a href="/iso-45001-requisitos-tudo-que-voce-precisa-saber/">Requisitos 4 a 10</a> · <a href="/passo-a-passo-certificacao-iso-45001/">passo a passo</a> · <a href="/consultoria-iso-45001/">consultoria</a> · <a href="/quanto-custa-iso-45001/">quanto custa</a> · <a href="/presentes/planilha-planilha-perigos-e-riscos/">planilha perigos e riscos</a>.</p>

<div class="post-portas">
  <a href="#respostas-diretas"><strong>Respostas diretas</strong><span>Perigo x risco, PGR</span></a>
  <a href="#conceitos-fundamentais-o-que-sao-perigos-e-riscos"><strong>Conceitos</strong><span>Definições ISO</span></a>
  <a href="#perigos-psicossociais-o-desafio-emergente"><strong>Psicossocial</strong><span>NR-1 e 45003</span></a>
  <a href="#gestao-de-riscos-hierarquizacao-dos-controles"><strong>Controles</strong><span>Hierarquia</span></a>
</div>

<h2 id="respostas-diretas">Respostas diretas: perigos e riscos ISO 45001</h2>
<ul>
<li><strong>Perigo x risco:</strong> perigo é a fonte (máquina, químico, assédio); risco combina probabilidade e severidade desse perigo.</li>
<li><strong>Onde está na norma?</strong> Identificação e avaliação em <strong>6.1.2</strong>; controles operacionais em <strong>8.1</strong>; revisão após mudanças e incidentes em <strong>10.2</strong>.</li>
<li><strong>Obrigatório certificar?</strong> Não. A metodologia serve ao PGR (NR-1) mesmo sem SGSSO certificado.</li>
<li><strong>Psicossocial:</strong> entra no mesmo inventário (6.1). Diretriz ISO 45003 orienta método; certificação é 45001. <a href="/iso-45003-vs-iso-45001/">45003 vs 45001</a>.</li>
<li><strong>Hierarquia de controles:</strong> eliminar, substituir, engenharia, administrativo, EPI (último recurso).</li>
<li><strong>Participação:</strong> trabalhadores identificam perigos (5.4); auditoria cobra evidência de consulta.</li>
</ul>

<h2 id="o-que-a-norma-exige">O que a ISO 45001 exige sobre perigos e riscos</h2>
<p>A empresa precisa manter processos <strong>proativos e contínuos</strong> para:</p>
<ul>
<li>identificar perigos e avaliar riscos e oportunidades (6.1.1 e 6.1.2);</li>
<li>determinar requisitos legais aplicáveis e outros requisitos (6.1.3);</li>
<li>planejar ações para tratar riscos e oportunidades (6.1.4);</li>
<li>implementar controles na operação (8.1) e revisar a eficácia (9 e 10).</li>
</ul>
<p>Mapa completo por cláusula: <a href="/iso-45001-requisitos-tudo-que-voce-precisa-saber/#requisito-6">requisitos 6.1 da ISO 45001</a>. Quem parte do zero: <a href="/passo-a-passo-certificacao-iso-45001/">passo a passo até certificar</a>.</p>

<h2 id="conceitos-fundamentais-o-que-sao-perigos-e-riscos">Conceitos fundamentais: perigo, risco e oportunidade</h2>
<h3>Perigo</h3>
<p>Fonte, situação ou condição com potencial de causar lesão ou agravo à saúde: máquina sem proteção, exposição química, layout inadequado, assédio moral. O perigo existe antes do acidente.</p>
<h3>Risco</h3>
<p>Combinação da <strong>probabilidade</strong> de o perigo se materializar com a <strong>severidade</strong> do dano. Exposição, frequência e duração da tarefa entram na avaliação.</p>
<h3>Oportunidade</h3>
<p>A cláusula 6.1 também pede oportunidades de melhorar o SGSSO (não só ameaças). Exemplo: digitalizar inspeções para revisar riscos com mais frequência.</p>
<h3>Percepção na linha de frente</h3>
<p>Quem executa a tarefa enxerga condições que a planilha de escritório não captura. A norma exige consulta aos trabalhadores (5.4): quase acidentes, sugestões e participação em inspeções viram insumo do inventário.</p>

<h2 id="implementando-a-iso-45001-processo-de-identificacao-de-perigos">Identificação de perigos: o que incluir no inventário</h2>
<p>Considere, no mínimo:</p>
<ul>
<li>atividades <strong>rotineiras e não rotineiras</strong> (manutenção, limpeza, mudança de layout);</li>
<li>fatores humanos (competência, fadiga, pressão, atalhos);</li>
<li>mudanças previstas em equipamentos, processos, fornecedores ou organograma;</li>
<li>trabalho de terceiros e visitantes no seu escopo;</li>
<li>emergências (incêndio, vazamento, evacuação).</li>
</ul>
<p>Atividades esporádicas costumam concentrar perigos graves porque não há rotina nem treino frequente. Inclua-as no PGR e no SGSSO com o mesmo rigor das tarefas diárias.</p>

<h2 id="tipos-de-perigos-a-serem-considerados">Tipos de perigos a considerar</h2>
<ul>
<li><strong>Físicos:</strong> ruído, vibração, calor, frio, radiação, queda, energia elétrica</li>
<li><strong>Químicos:</strong> vapores, poeiras, gases, produtos tóxicos ou corrosivos</li>
<li><strong>Biológicos:</strong> vírus, bactérias, fungos, material biológico</li>
<li><strong>Ergonômicos:</strong> postura, repetitividade, levantamento, mobiliário</li>
<li><strong>Psicossociais:</strong> estresse, assédio, violência, sobrecarga, turnos</li>
<li><strong>Mecânicos:</strong> partes móveis, prensas, veículos, ferramentas</li>
</ul>
<p>Na prática os riscos se somam. Pintura industrial pode juntar químico, ergonomia e meta de produção no mesmo registro de avaliação.</p>

<h2 id="avaliacao-de-riscos-metodologias-e-priorizacao-eficaz">Avaliação e priorização</h2>
<p>Para cada perigo, registre metodologia, critérios e resultado (baixo, médio, alto ou escala própria documentada). Use matriz probabilidade x severidade ou método equivalente, sempre com <strong>evidência auditável</strong>.</p>
<ul>
<li>considere controles já existentes antes de classificar o risco residual;</li>
<li>priorize ações onde severidade ou exposição são altas;</li>
<li>revise após incidentes, não conformidades, mudanças significativas ou reclamações;</li>
<li>no PGR, a NR-1 prevê revisão periódica do inventário (inclusive com certificação ISO 45001 a cada três anos, item 1.5.4.4.6.1).</li>
</ul>
<p>Quem conduz a avaliação precisa ser competente para o risco (técnico de SST, engenheiro, equipe multidisciplinar para psicossocial). A ISO 45001 não prescreve uma matriz única: exige consistência e melhoria contínua.</p>

<h2 id="gestao-de-riscos-hierarquizacao-dos-controles">Hierarquia de controles (ISO 45001 e NR-1)</h2>
<p>Ordem de preferência na redução do risco:</p>
<ol>
<li><strong>Eliminação</strong> do perigo (retirar a fonte)</li>
<li><strong>Substituição</strong> por processo, material ou equipamento menos perigoso</li>
<li><strong>Engenharia</strong> (enclausuramento, exaustão, proteções fixas)</li>
<li><strong>Administrativo</strong> (procedimento, rodízio, sinalização, treinamento)</li>
<li><strong>EPI</strong> só quando as opções anteriores não forem suficientes</li>
</ol>
<h3>Exemplo: abrir embalagens</h3>
<p>Entregar luva para estilete é EPI. Trocar por abridor que não expõe lâmina elimina o corte na origem. Auditoria costuma questionar plano que para no EPI quando há alternativa de engenharia ou eliminação.</p>
<p><a href="https://certificacaoiso.com.br/form/?utm_source=blog&amp;utm_medium=banner-artigo&amp;utm_campaign=iso-45001-perigos&amp;norma=ISO%2045001"><img src="/wp-content/uploads/2025/09/Banner-Blog-3-1000x343.webp" alt="Consultoria da Templum: solicite uma proposta"></a></p>

<h2 id="perigos-psicossociais-o-desafio-emergente">Perigos psicossociais, NR-1 e ISO 45003</h2>
<p>Assédio, sobrecarga, violência e ambiente hostil entram no inventário como os demais fatores. Desde a redação da NR-1 (Portaria MTE nº 1.419/2024), fatores psicossociais fazem parte do GRO/PGR; fiscalização punitiva referente a essa redação desde <strong>26 de maio de 2026</strong>.</p>
<p>Na ISO 45001, trate psicossocial na cláusula 6.1 (identificação e avaliação) e nos controles de 8.1 (canais de denúncia, ajuste de carga, pausas, escuta). A <strong>ISO 45003</strong> é diretriz de boas práticas; não substitui certificação. Veja <a href="/iso-45003-vs-iso-45001/">ISO 45003 vs ISO 45001</a>, <a href="/nr-1-riscos-psicossociais/">NR-1 e riscos psicossociais</a> e <a href="/nr-1-e-iso-45001/">NR-1 e ISO 45001</a>.</p>

<h2 id="ferramentas-de-identificacao-e-avaliacao-de-riscos-pela-iso-45001">Ferramentas úteis (sem substituir o processo)</h2>
<ul>
<li><strong>APP (Análise Preliminar de Perigos):</strong> antes de nova linha, obra ou equipamento</li>
<li><strong>FMEA:</strong> falhas de equipamento e efeitos na SST</li>
<li><strong>Análise de tarefa segura:</strong> passo a passo da atividade com controles por etapa</li>
<li><strong>Inspeções e auditorias internas:</strong> capturar desvios entre procedimento e prática</li>
<li><strong>PGR:</strong> documento legal que consolida inventário e plano de ação (<a href="/nr-1/">NR-1</a>)</li>
</ul>
<p>Modelo editável: <a href="/presentes/planilha-planilha-perigos-e-riscos/">planilha de perigos e riscos</a>.</p>

<h2 id="papel-da-lideranca-trabalhadores-e-especialistas">Liderança, trabalhadores e registros</h2>
<ul>
<li><strong>Direção:</strong> recursos, prioridade real e ambiente sem retaliação a relatos</li>
<li><strong>SST e RH:</strong> método, requisitos legais, integração com PCMSO (NR-7)</li>
<li><strong>Trabalhadores e CIPA:</strong> identificação, consulta e feedback sobre controles</li>
</ul>
<p>Registre inventário, avaliações, ações, comunicação e revisões. Após acidente ou quase acidente, atualize a análise antes de voltar à operação normal quando o risco exigir.</p>

<h2 id="monitoramento-medicao-e-integracao-legal">PGR, certificação e integração legal</h2>
<p>O PGR atende a NR-1; a ISO 45001 organiza o SGSSO além do mínimo legal. Empresas certificadas ganham ciclo de auditoria externa e revisão formal do inventário alinhada ao item 1.5.4.4.6.1 da NR-1.</p>
<p>Quem migra de OHSAS: <a href="/ohsas-18001-e-iso-45001/">OHSAS 18001 e ISO 45001</a>. Cliente ou edital exige certificado: <a href="/iso-45001-cliente-edital-exige-certificado/">ISO 45001 em licitação</a>. Investimento: <a href="/quanto-custa-iso-45001/">quanto custa a ISO 45001</a>.</p>

<h2 id="aprofunde">Aprofunde no cluster ISO 45001</h2>
<ul>
<li><a href="/iso-45001/">Hub ISO 45001</a></li>
<li><a href="/iso-45001-requisitos-tudo-que-voce-precisa-saber/">Requisitos cláusulas 4 a 10</a></li>
<li><a href="/passo-a-passo-certificacao-iso-45001/">Passo a passo certificação</a></li>
<li><a href="/consultoria-iso-45001/">Consultoria ISO 45001</a></li>
<li><a href="/consultoria-iso-sistema-integrado-9001-14001-45001/">SGI 9001 + 14001 + 45001</a></li>
</ul>
<p><a href="https://templum.com.br/consultoria/iso-45001/">Consultoria Templum ISO 45001</a> · <a href="/form/?utm_source=blog&amp;utm_medium=cta&amp;utm_campaign=iso-45001-perigos&amp;norma=ISO%2045001">Diagnóstico gratuito</a></p>

<p><strong>Conteúdo em vídeo (live):</strong> <a href="https://youtube.com/live/4x3mP77FwgY?feature=share">ISO 45001 perigos e riscos</a>.</p>
`;

writeFileSync(path.join(dir, "iso-45001-perigos.html"), html, "utf8");

const meta = {
  title: "ISO 45001: perigos e riscos na gestão proativa de SST",
  seo_title: "ISO 45001 perigos e riscos: identificar, avaliar e controlar",
  seo_description:
    "Perigos e riscos na ISO 45001: cláusula 6.1, hierarquia de controles, psicossocial e PGR/NR-1. Passo a passo, requisitos, custo e planilha.",
  tldr:
    "Perigo é a fonte de dano; risco combina probabilidade e severidade. A ISO 45001 exige identificação contínua (6.1.2), controles na hierarquia correta (8.1) e participação dos trabalhadores. Integra com PGR da NR-1, inclusive psicossocial.",
  faq: [
    {
      pergunta: "Qual a diferença entre perigo e risco na ISO 45001?",
      resposta:
        "<p><strong>Perigo</strong> é a fonte (máquina, químico, assédio). <strong>Risco</strong> é probabilidade x severidade. <a href=\"/iso-45001-perigos/#conceitos-fundamentais-o-que-sao-perigos-e-riscos\">Conceitos</a>.</p>",
    },
    {
      pergunta: "Como a ISO 45001 trata riscos psicossociais?",
      resposta:
        "<p>Como perigos/riscos no inventário (6.1), alinhado à NR-1. A ISO 45003 orienta método. <a href=\"/iso-45003-vs-iso-45001/\">45003 vs 45001</a> · <a href=\"/nr-1-riscos-psicossociais/\">NR-1 psicossocial</a>.</p>",
    },
    {
      pergunta: "Perigos e riscos substituem o PGR?",
      resposta:
        "<p>Não. O PGR é obrigação legal; a ISO 45001 organiza o SGSSO. O inventário bem feito serve aos dois. <a href=\"/nr-1-e-iso-45001/\">NR-1 e ISO 45001</a>.</p>",
    },
    {
      pergunta: "Qual a hierarquia de controles na ISO 45001?",
      resposta:
        "<p>Eliminação, substituição, engenharia, administrativo, EPI por último. <a href=\"/iso-45001-perigos/#gestao-de-riscos-hierarquizacao-dos-controles\">Hierarquização</a>.</p>",
    },
    {
      pergunta: "Onde estão os requisitos de perigos e riscos na norma?",
      resposta:
        "<p>Cláusula <strong>6.1.2</strong> (identificação e avaliação) e <strong>8.1</strong> (controles operacionais). <a href=\"/iso-45001-requisitos-tudo-que-voce-precisa-saber/#requisito-6\">Requisitos ISO 45001</a>.</p>",
    },
    {
      pergunta: "Quando revisar o inventário de perigos e riscos?",
      resposta:
        "<p>Após mudanças, incidentes, reclamações ou achados de auditoria; e periodicamente no PGR. Certificação ISO 45001 alinha revisão trienal do inventário (NR-1 item 1.5.4.4.6.1).</p>",
    },
  ],
};

writeFileSync(path.join(dir, "iso-45001-perigos.meta.json"), JSON.stringify(meta, null, 2) + "\n", "utf8");
console.log("iso-45001-perigos reescrito (GEO full)");
