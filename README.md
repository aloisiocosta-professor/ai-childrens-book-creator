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

O CI roda testes em pull requests e pushes para `main`. Pages e Render têm fluxos de publicação manual separados; nenhum serviço foi provisionado e nenhum deploy foi executado por este PR.

## Estrutura

- `frontend/`: editor sem chave ou segredo.
- `backend/src/`: API, provedores e persistência.
- `backend/sql/`: migração inicial PostgreSQL.
- `docs/`: especificação, arquitetura, segurança de API keys e roadmap.
- `render.yaml`: blueprint de referência; criar recursos Render exige revisão dos limites/custos.
- `.github/workflows/`: CI, Pages manual e deploy Render manual.

## Limites de segurança e publicação

O MVP não implementa login de responsáveis, isolamento multiusuário, moderação abrangente, armazenamento durável de imagens nem política final de retenção. Não implante com dados identificáveis de crianças.

GitHub Pages está preparado para demonstração estática. O repositório está privado; contas GitHub Free só podem usar Pages com repositório público, e o site Pages é público. Além disso, as regras de Pages não o destinam a hospedar um SaaS. Confirme plano, visibilidade e uso permitido; para produção, considere hospedagem estática compatível com o produto.

O Render Postgres Free expira após 30 dias e não oferece backups; não use para dados reais nem como banco de produção. O Blueprint é apenas configuração, sem criação de recursos.

## Decisões

Ver `docs/PRODUCT_SPEC.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY-API-KEYS.md` e `docs/ROADMAP.md`.
