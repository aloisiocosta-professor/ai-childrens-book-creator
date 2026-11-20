# AI Children's Personalized Book Creator

Aplicação independente para criar livros infantis personalizados com apoio de IA. Kidoo é referência funcional; marca, textos, ilustrações e identidade visual são originais.

## MVP 01

- Frontend estático em `frontend/`, preparado para GitHub Pages.
- API Node.js + Fastify em `backend/`; PostgreSQL quando `DATABASE_URL` existe e memória local no modo de demonstração.
- Provedor padrão `mock`: não chama nem cobra OpenAI.
- Adaptadores de texto e imagem via OpenAI API ficam disponíveis quando `AI_PROVIDER=openai` e as variáveis do backend estão configuradas.
- Rascunho com 8 páginas, faixa etária 3–8 anos, revisão do responsável e impressão/Salvar como PDF pelo navegador.
- Não coleta fotografia. Use apelido fictício no piloto.

## Estado do deployment — 19/11/2026

- Repositório GitHub público.
- API Render: [book-creator-api-hekp](https://book-creator-api-hekp.onrender.com), deploy do commit `0c4a43ad9f954e504c623a11362ea4ac3416da7d`; o endpoint `/healthz` respondeu `{"status":"ok"}` na validação registrada.
- A API está configurada com `AI_PROVIDER=mock`; o deployment saudável não comprova chamadas reais à OpenAI. A chave configurada no Render não foi lida nem validada.
- O banco Render está no plano Free, próprio para protótipo, sem garantias adequadas de retenção/backups para dados reais.
- GitHub Pages ainda não está publicado: o workflow `.github/workflows/pages.yml` só roda manualmente e a URL do projeto retornou 404 na última verificação. A existência do workflow não significa que o site foi implantado.
- A issue [RELEASE-001](https://github.com/aloisiocosta-professor/ai-childrens-book-creator/issues/8) acompanha os gates e pendências de release.

## Rodar localmente

Requer Node.js 24+ e Python 3.

No terminal 1, na raiz do repositório:

```sh
cp .env.example .env
cd backend
npm install
npm run dev
```

No terminal 2, na raiz do repositório:

```sh
python3 -m http.server 5500 --directory frontend
```

No Windows, `py -m http.server 5500 --directory frontend` pode substituir `python3`.

Edite `frontend/config.js` para definir `apiBaseUrl: "http://localhost:3000"`. Sem API configurada, o frontend usa demonstração local. O arquivo `.env` é ignorado pelo Git. Nunca coloque segredos em `frontend/`, GitHub Pages ou no navegador.

Para usar PostgreSQL local, preencha `DATABASE_URL` no `.env`. Sem esse valor, a API usa memória volátil; dados somem ao reiniciar.

## Verificação

```sh
cd backend
npm test
npm run check
```

O GitHub Actions CI executa essas verificações em pull requests e pushes para `main`, usando `AI_PROVIDER=mock`. O CI estrutural não valida chamadas pagas à OpenAI nem geração real de imagens.

## Estrutura

- `frontend/`: editor sem chave ou segredo.
- `backend/src/`: API, provedores e persistência.
- `backend/sql/`: migração inicial PostgreSQL.
- `docs/`: especificação, arquitetura, segurança de API keys e roadmap.
- `render.yaml`: Blueprint de referência para a API e o banco.
- `.github/workflows/`: CI, publicação manual no Pages e automação de deploy configurada no Render.

## Limites e próximo trabalho

O MVP ainda não implementa login de responsáveis, isolamento multiusuário, moderação abrangente, armazenamento durável de imagens nem política final de retenção. Não use dados identificáveis de crianças.

O Render Free é ambiente de demonstração. Antes de guardar dados reais, escolher armazenamento privado e banco com retenção, backups e controles de acesso adequados. Definir também limites de uso, moderação, retenção e exclusão.

A URL do GitHub Pages precisa ser publicada e verificada antes de considerar o frontend acessível. O repositório público expõe código e histórico, portanto segredos devem ficar em variáveis de ambiente de servidor. Para um produto comercial, confirme a adequação dos termos do Pages ou escolha outro host estático.

A ativação de `AI_PROVIDER=openai` exige validar a chave e as cotas da API, configurar limites de custo/uso e realizar uma chamada autorizada. ChatGPT Plus não inclui créditos da API.

## Decisões

Ver `docs/PRODUCT_SPEC.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY-API-KEYS.md` e `docs/ROADMAP.md`.
