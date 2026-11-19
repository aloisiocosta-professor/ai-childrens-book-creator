# Obter e proteger a chave da OpenAI API

Este guia é para configurar uma chave **no futuro**, quando houver decisão de custo. O MVP começa em `AI_PROVIDER=mock`; nenhuma chave é necessária e testes não fazem chamadas pagas.

## Como obter

1. Entre na OpenAI API Platform em [platform.openai.com](https://platform.openai.com/) com a conta adequada.
2. Verifique a organização/projeto e a página de billing. A assinatura ChatGPT e a cobrança da API são produtos separados; benefícios/créditos podem depender do plano e das regras vigentes, então confira o billing antes de habilitar uso.
3. Crie um projeto dedicado, por exemplo `book-creator-prod`, separado de seus experimentos pessoais.
4. Crie uma identidade de serviço para o backend e uma chave de projeto com permissões mínimas necessárias para geração de texto/imagem; use expiração e política de rotação.
5. Configure limites/alertas de uso e revise os modelos/capacidades habilitados antes de qualquer chamada.

## Onde configurar

- **Local:** copie `.env.example` para `.env`, que está no `.gitignore`. Preencha `OPENAI_API_KEY` apenas no computador. Não envie a chave por chat, issue, PR, print, log ou commit.
- **Render:** no Dashboard, abra o serviço backend → Environment → adicione `OPENAI_API_KEY` como valor secreto. Salve e faça redeploy quando o serviço estiver aprovado. O blueprint deixa a variável sem valor; não inclua key em `render.yaml`.
- **GitHub Actions:** testes e Pages não precisam dessa key. Não a adicione como secret de Actions. Se um futuro teste de integração live for aprovado, use um ambiente protegido com escopo mínimo e teto de gasto, sem imprimir o valor.
- **Frontend / GitHub Pages:** jamais. Qualquer variável embutida em JavaScript público pode ser lida e copiada por visitantes.

## Ativar geração paga

1. Primeiro valide o fluxo mock e configure o backend com `AI_PROVIDER=mock`.
2. Decida teto de custo e política de uso.
3. Insira a key somente no Render como segredo.
4. Configure `OPENAI_TEXT_MODEL` e `OPENAI_IMAGE_MODEL` para modelos disponíveis ao projeto.
5. Só então troque `AI_PROVIDER=openai`. Texto é solicitado ao criar história; imagem só quando o responsável clicar em “Gerar ilustração”. Essas operações podem gerar cobrança.
6. Inspecione usage e erros sem armazenar prompts pessoais em logs.

## Rotação ou vazamento

1. Revogue a key comprometida na API Platform imediatamente.
2. Gere substituta com expiração/permissões mínimas.
3. Atualize o segredo em Render, redeploy e valide com uma chamada de baixo custo sob supervisão.
4. Confirme que a chave antiga falha e revogue/salve o registro de incidente.
5. Revise uso anômalo, ajuste limites e nunca reutilize a chave comprometida.

Uma key válida não impede abuso se o endpoint público não tiver autenticação, quota e rate limiting. M01 não está pronto para produção com dados reais. O acesso API é independente da conexão MCP disponível ao Codex e não deve ser confundido com “usar o ChatGPT Plus dentro do website”.
