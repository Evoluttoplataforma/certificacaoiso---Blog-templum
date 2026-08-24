-- ============================================================================
-- /checklist-preparacao-auditoria-interna-iso/ — tabela de cláusulas errada
--
-- O post trazia uma tabela de checklist em que TODAS as cinco linhas pareavam um
-- nome de área da ISO 9001:2008 com um número de cláusula da :2015, e nenhuma
-- casava:
--     "Sistema de Gestão da Qualidade" → 4.1   (4.1 é contexto da organização)
--     "Responsabilidade da Direção"    → 5.2   (5.2 é política da qualidade)
--     "Gestão de Recursos"             → 6.1   (6.1 é riscos e oportunidades)
--     "Realização do Produto"          → 7.1   (7.1 é recursos)
--     "Medição, Análise e Melhoria"    → 8.1   (8.1 é planejamento operacional)
-- Os nomes são as cláusulas 4 a 8 da edição de 2008. Num post que se chama
-- "checklist", isso não é erro cosmético: o leitor copia a tabela para uma
-- auditoria e vai verificar o requisito errado.
--
-- Substituição por 7 linhas com as cláusulas reais da versão vigente, pareando
-- cada área com as subcláusulas que a auditoria de fato pede.
--
-- `replace()` com o literal exato, não regexp_replace: no Postgres, um
-- quantificador guloso antes do lazy (\s* antes de .*?) torna o match guloso, e
-- o padrão ancorado em "</table>" engoliu a SEGUNDA tabela do post também.
-- ============================================================================

update public.blog_templum_posts set
  content = replace(content,
'<table>
<thead>
<tr>
<th>Área Auditada</th>
<th>Requisito</th>
<th>Conforme</th>
<th>Observações</th>
</tr>
</thead>
<tbody><tr>
<td>Sistema de Gestão da Qualidade</td>
<td>ISO 9001:2015 Cláusula 4.1</td>
<td>Sim/Não</td>
<td>[Observações específicas]</td>
</tr>
<tr>
<td>Responsabilidade da Direção</td>
<td>ISO 9001:2015 Cláusula 5.2</td>
<td>Sim/Não</td>
<td>[Observações específicas]</td>
</tr>
<tr>
<td>Gestão de Recursos</td>
<td>ISO 9001:2015 Cláusula 6.1</td>
<td>Sim/Não</td>
<td>[Observações específicas]</td>
</tr>
<tr>
<td>Realização do Produto</td>
<td>ISO 9001:2015 Cláusula 7.1</td>
<td>Sim/Não</td>
<td>[Observações específicas]</td>
</tr>
<tr>
<td>Medição, Análise e Melhoria</td>
<td>ISO 9001:2015 Cláusula 8.1</td>
<td>Sim/Não</td>
<td>[Observações específicas]</td>
</tr>
</tbody></table>',
'<table>
<thead>
<tr>
<th>Área auditada</th>
<th>Requisito (ISO 9001:2015)</th>
<th>Conforme</th>
<th>Observações</th>
</tr>
</thead>
<tbody><tr>
<td>Contexto e partes interessadas</td>
<td>4.1 e 4.2</td>
<td>Sim/Não</td>
<td>[Observações específicas]</td>
</tr>
<tr>
<td>Liderança e política da qualidade</td>
<td>5.1 e 5.2</td>
<td>Sim/Não</td>
<td>[Observações específicas]</td>
</tr>
<tr>
<td>Riscos, oportunidades e objetivos</td>
<td>6.1 e 6.2</td>
<td>Sim/Não</td>
<td>[Observações específicas]</td>
</tr>
<tr>
<td>Competência e informação documentada</td>
<td>7.2 e 7.5</td>
<td>Sim/Não</td>
<td>[Observações específicas]</td>
</tr>
<tr>
<td>Operação e provedores externos</td>
<td>8.1 e 8.4</td>
<td>Sim/Não</td>
<td>[Observações específicas]</td>
</tr>
<tr>
<td>Monitoramento e análise crítica</td>
<td>9.1 e 9.3</td>
<td>Sim/Não</td>
<td>[Observações específicas]</td>
</tr>
<tr>
<td>Não conformidade e ação corretiva</td>
<td>10.2</td>
<td>Sim/Não</td>
<td>[Observações específicas]</td>
</tr>
</tbody></table>'),
  -- revised_at é CURADO (ver o comentário em src/pages/[slug].astro). Uma correção
  -- factual de conteúdo é exatamente o que a coluna existe para registrar.
  revised_at = now()
where slug = 'checklist-preparacao-auditoria-interna-iso';
