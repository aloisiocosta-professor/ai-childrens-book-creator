# Obter e proteger a chave da OpenAI API

Este guia é para configurar uma chave **no futuro**, quando houver decisão de custo. O MVP começa em `AI_PROVIDER=mock`; nenhuma chave é necessária e testes não fazem chamadas pagas.

## Como obter

1. Entre na [OpenAI API Platform](https://platform.openai.com/) com a conta adequada.
2. Selecione/crie uma organização e projeto dedicado, por exemplo `book-creator-prod`; consulte a área Billing da API Platform antes de ativar chamadas. A assinatura ChatGPT não é automaticamente o saldo da API. Confira se o plano atual oferece algum crédito elegível e confirme o saldo no painel.
3. Para o backend publicado, crie uma identidade de serviço (não use a key pessoal de um desenvolvedor como credencial permanente).
4. Em API Keys do projeto, crie uma project key com permissões mínimas necessárias para geração de texto/imagem. Defina expiração e uma rotina de rotação.
5. Configure limites/alertas de uso e revise modelos/capacidades habilitados antes de qualquer chamada.

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
6. Inspecione Usage e erros sem armazenar prompts pessoais em logs.

## Rotação ou vazamento

1. Revogue a key comprometida na API Platform imediatamente.
2. Gere substituta com expiração/permissões mínimas.
3. Atualize o segredo em Render, redeploy e valide com uma chamada de baixo custo sob supervisão.
4. Confirme que a chave antiga falha e registre o incidente.
5. Revise uso anômalo, ajuste limites e nunca reutilize a chave comprometida.

Uma key válida não impede abuso se o endpoint público não tiver autenticação, quota e rate limiting. M01 não está pronto para produção com dados reais. O acesso API é independente da conexão MCP disponível ao Codex: a aplicação usa APIs oficiais via SDK no backend; não usa o ChatGPT Desktop/Codex como servidor nem incorpora um MCP do ChatGPT no website.
