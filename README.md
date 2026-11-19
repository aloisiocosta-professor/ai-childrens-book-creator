# AI Children's Personalized Book Creator

Aplicação independente para criar livros infantis personalizados com apoio de IA. Kidoo é referência funcional; marca, textos, ilustrações e identidade visual são originais.

## MVP 01

- Frontend estático em `frontend/`, preparado para GitHub Pages.
- API Node.js + Fastify em `backend/`; PostgreSQL persistente quando `DATABASE_URL` existe e memória local no modo de demonstração.
- Provedor padrão `mock`: não chama nem cobra OpenAI.
- Adaptadores de texto e imagem via OpenAI API disponíveis somente quando `AI_PROVIDER=openai` e as variáveis do backend estiverem configuradas.
- Rascunho com 8 páginas, faixa etária 3–8 anos, revisão do responsável e impressão/Salvar como PDF pelo navegador.
- Não coleta fotografia. Use apelido fictício no piloto.

## Rodar localmente

Requer Node.js 24+.

```sh
cd backend
npm install
npm run dev
```

Abra `frontend/index.html`. Para chamar uma API local, edite `frontend/config.js` e defina `apiBaseUrl: "http://localhost:3000"`. Sem API configurada, o frontend usa demonstração local.

Para PostgreSQL, copie `.env.example` para `.env`, preencha `DATABASE_URL` local e execute a API. O arquivo `.env` é ignorado pelo Git. Nunca coloque segredos em `frontend/`, GitHub Pages ou no navegador.

## Verificação

```sh
cd backend
npm test
```

O CI roda testes em pull requests e pushes para `main`. Pages e Render têm fluxos de publicação manual separados; nenhum serviço foi provisionado e nenhum deploy foi executado por este PR.

## Estrutura

- `frontend/`: editor visual sem chave ou segredo.
- `backend/src/`: API, provedores e persistência.
- `backend/sql/`: migração inicial PostgreSQL.
- `docs/`: especificação, arquitetura, segurança de API keys e roadmap.
- `render.yaml`: blueprint de referência; criar recursos em Render pode ter custo e exige configuração/revisão do responsável.
- `.github/workflows/`: CI, Pages manual e deploy Render manual.

## Limites de segurança do MVP

A aplicação ainda não implementa login de responsáveis, isolamento multiusuário, moderação abrangente, armazenamento durável de imagens nem política final de retenção. Não implante com dados identificáveis de crianças. O banco e as rotas devem receber autenticação/autorização antes de uso real; consulte `docs/ROADMAP.md`.

## Decisões

Ver `docs/PRODUCT_SPEC.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY-API-KEYS.md` e `docs/ROADMAP.md`.
