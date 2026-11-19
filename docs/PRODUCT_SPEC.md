# Especificação do MVP 01

**Estado:** baseline de implementação submetida a revisão por PR.  
**Produto:** AI Children's Personalized Book Creator.  
**Público operador:** responsável adulto. A criança não deve usar o editor nem fornecer dados diretamente.

## Problema e objetivo

Ajudar um responsável a criar e revisar um rascunho de história infantil personalizada, página a página, com capacidade de imprimir/Salvar como PDF.

## Escopo

- Crianças de 3 a 8 anos como faixa editorial (não como contas ou usuários do sistema).
- Um apelido fictício, idade, tema e tom; nenhum campo de foto.
- Rascunho de 8 páginas no MVP; expansão para 8–12 páginas fica configurável após revisão de contrato.
- Geração textual por provedor mock ou OpenAI API server-side.
- Ilustração por página sob demanda via mock ou OpenAI Images; imagem da resposta é temporária no browser até integrar armazenamento durável.
- Edição e confirmação narrativa pelo responsável.
- Exportação via impressão do browser.

## Fora do escopo

Autenticação real, contas públicas, fotos de crianças, cobrança, áudio, gráfica, compartilhamento/publicação pública, aplicação móvel, revisão jurídica de privacidade e arquivo de imagens durável.

## Regras observáveis

1. O padrão mock não faz chamadas externas.
2. A API rejeita apelido vazio/maior que 40 caracteres, idade fora de 3–8 e tema maior que 160 caracteres.
3. O provedor retorna exatamente 8 páginas numeradas, cada uma com texto não vazio.
4. Texto é tratado como conteúdo não confiável e renderizado como texto, sem HTML executável.
5. Marcar revisão exige que o responsável veja o livro; edição posterior deve invalidar revisão no próximo incremento.
6. OpenAI API key não sai do backend nem aparece em resposta, frontend, logs ou artefato do Actions.
7. Sem autenticação, dados enviados à API são apenas de demonstração e não podem identificar a criança.

## Pendências de produto/segurança

- Resolver páginas vs. quantidade de ilustrações (o contrato anterior v0.2 define 8–12 páginas e uma ilustração por página para exportação).
- Aprovar linguagem, limites por idade, moderação e política editorial.
- Escolher autenticação, autorização, retenção, exclusão e backup antes de dados reais.
- Escolher armazenamento de objetos antes de persistir/servir imagens geradas.
- Fazer revisão humana da privacidade aplicável antes de fotos/dados reais.

## Critérios de aceite M01

- Instalação local e API iniciam em modo mock.
- Health check responde sem segredo.
- Criar livro mock produz oito páginas; validação de faixa etária funciona.
- Testes automatizados cobrem happy path e entradas inválidas.
- Frontend funciona sem backend em demo e, configurado, usa a API pelo mesmo-origin/CORS.
- Modo OpenAI falha de forma segura sem key e chama texto/imagem somente sob demanda quando ativado.
- CI executa em PR.
- Blueprint e workflows são configuração versionada; nenhum serviço externo foi provisionado.
- Documentação explica segredo, custos, limites e próximos gates.
