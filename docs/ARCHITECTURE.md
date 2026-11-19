# Arquitetura e fluxos

## Contexto / containers

| Container | Responsabilidade | Persistência/segredo |
|---|---|---|
| Browser + GitHub Pages | Formulário, leitura/edição e impressão | Sem API key; estado de demonstração local |
| Fastify API no Render | Validação, geração, CORS, health check | OPENAI_API_KEY apenas na variável secreta do backend |
| PostgreSQL Render | Persistir metadados/rascunhos | DATABASE_URL conectada via Blueprint |
| OpenAI API | Gerar texto e ilustração quando ativado | Chamada exclusivamente do servidor |

## Caminho do rascunho

1. O adulto envia apelido fictício, faixa etária, tema e tom ao frontend.
2. O frontend envia JSON para `POST /api/books`.
3. A API valida o contrato, chama o provedor (mock por padrão) e grava o rascunho no PostgreSQL quando configurado.
4. O browser mostra páginas como texto simples para revisão; a resposta não inclui segredo.
5. Ilustrações são geradas uma por vez sob demanda. No MVP, bytes/base64 são apenas temporários e não constituem armazenamento durável.
6. Imprimir/Salvar PDF ocorre no browser depois da revisão humana.

## Contratos HTTP M01

- `GET /healthz` → `{status:"ok"}`; sem versão/segredo/ambiente sensível.
- `POST /api/books` corpo `{ protagonistAlias, age, theme, tone? }` → `{ id, status, pages:[{index,text}], createdAt }`.
- `POST /api/books/:id/illustrations` corpo `{pageIndex}` → `{pageIndex, mimeType, imageDataUrl}`; depende de projeto existente e retorna bytes temporários.
- Respostas de erro têm código genérico e mensagem segura, sem stack, prompts internos ou credenciais.

## Segurança e limites conhecidos

M01 é protótipo para dados fictícios. API não tem autenticação, autorização por responsável, rate limit, quotas por usuário nem armazenamento durável de imagens. Não abra publicamente para uso real até os itens SEC/AUTH/STORAGE/PRIVACY do roadmap serem aceitos. Configure allowlist CORS exatamente com a URL Pages; CORS não é autenticação.

## Decisão de integração

Frontend Pages é estático e nunca acessa chave OpenAI. Fastify intermedeia chamadas diretas à OpenAI API. MCP é protocolo de integração de ferramentas para agentes; não é o serviço de geração que deve receber a chave do website. A aplicação usa APIs HTTP oficiais via SDK no backend.
