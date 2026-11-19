import Fastify from "fastify";
import cors from "@fastify/cors";
import { randomUUID } from "node:crypto";
import { createProvider } from "./providers.js";
import { createStore } from "./store.js";

export function createApp({ config = process.env, provider = createProvider(config), store = createStore(config) } = {}) {
  const app = Fastify({ logger: { level: config.LOG_LEVEL || "warn", redact: ["req.headers.authorization", "req.headers.cookie"] }, bodyLimit: 32 * 1024 });
  const origins = (config.CORS_ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
  app.register(cors, { origin: origins.length ? origins : false, methods: ["GET", "POST", "OPTIONS"] });
  app.decorate("bookStore", store);
  app.decorate("bookProvider", provider);

  app.get("/healthz", async () => ({ status: "ok" }));

  app.post("/api/books", async (request, reply) => {
    const body = request.body || {};
    const alias = typeof body.protagonistAlias === "string" ? body.protagonistAlias.trim() : "";
    const theme = typeof body.theme === "string" ? body.theme.trim() : "";
    const tone = typeof body.tone === "string" ? body.tone.trim() : "acolhedor";
    const age = Number(body.age);
    if (!alias || alias.length > 40 || !Number.isInteger(age) || age < 3 || age > 8 || !theme || theme.length > 160 || tone.length > 40) {
      return reply.code(400).send({ error: { code: "INVALID_BOOK_REQUEST", message: "Informe um apelido (até 40 caracteres), idade de 3 a 8 e tema (até 160 caracteres)." } });
    }
    const book = { id: randomUUID(), status: "DRAFT", protagonistAlias: alias, age, theme, tone, pages: [], createdAt: new Date().toISOString(), reviewed: false };
    try {
      book.pages = await provider.generateStory(book);
      await store.save(book);
      return reply.code(201).send(book);
    } catch (error) {
      request.log.error({ errorType: error?.name || "Error" }, "book generation failed");
      return reply.code(502).send({ error: { code: "GENERATION_FAILED", message: "Não foi possível gerar o rascunho. Verifique a configuração do provedor ou tente novamente." } });
    }
  });

  app.post("/api/books/:id/illustrations", async (request, reply) => {
    const pageIndex = Number(request.body?.pageIndex);
    if (!Number.isInteger(pageIndex) || pageIndex < 1 || pageIndex > 8) return reply.code(400).send({ error: { code: "INVALID_PAGE", message: "Informe uma página entre 1 e 8." } });
    try {
      const book = await store.get(request.params.id);
      if (!book) return reply.code(404).send({ error: { code: "BOOK_NOT_FOUND", message: "Rascunho não encontrado." } });
      const image = await provider.generateIllustration(book, pageIndex);
      return { pageIndex, ...image, temporary: true };
    } catch (error) {
      request.log.error({ errorType: error?.name || "Error" }, "illustration generation failed");
      return reply.code(502).send({ error: { code: "ILLUSTRATION_FAILED", message: "Não foi possível gerar a ilustração." } });
    }
  });

  return app;
}
