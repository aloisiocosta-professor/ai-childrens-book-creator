import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";
import { createProvider } from "../src/providers.js";
import { createStore } from "../src/store.js";

const config = { AI_PROVIDER: "mock", CORS_ALLOWED_ORIGINS: "http://localhost:5500" };

test("health check is available without secrets", async () => {
  const app = createApp({ config, store: createStore({}), provider: createProvider(config) });
  const response = await app.inject({ method: "GET", url: "/healthz" });
  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json(), { status: "ok" });
  await app.close();
});

test("mock provider creates an eight-page draft and persists it", async () => {
  const store = createStore({});
  const app = createApp({ config, store, provider: createProvider(config) });
  const response = await app.inject({ method: "POST", url: "/api/books", payload: { protagonistAlias: "Lia", age: 6, theme: "amizade" } });
  assert.equal(response.statusCode, 201);
  const book = response.json();
  assert.equal(book.pages.length, 8);
  assert.equal(book.pages[0].index, 1);
  assert.equal((await store.get(book.id)).protagonistAlias, "Lia");
  await app.close();
});

test("invalid age and empty alias are rejected", async () => {
  const app = createApp({ config, store: createStore({}), provider: createProvider(config) });
  for (const payload of [
    { protagonistAlias: "Lia", age: 9, theme: "amizade" },
    { protagonistAlias: " ", age: 6, theme: "amizade" }
  ]) {
    const response = await app.inject({ method: "POST", url: "/api/books", payload });
    assert.equal(response.statusCode, 400);
    assert.equal(response.json().error.code, "INVALID_BOOK_REQUEST");
  }
  await app.close();
});

test("mock illustrations are temporary and only for existing pages", async () => {
  const store = createStore({});
  const app = createApp({ config, store, provider: createProvider(config) });
  const created = await app.inject({ method: "POST", url: "/api/books", payload: { protagonistAlias: "Lia", age: 6, theme: "amizade" } });
  const book = created.json();
  const image = await app.inject({ method: "POST", url: `/api/books/${book.id}/illustrations`, payload: { pageIndex: 1 } });
  assert.equal(image.statusCode, 200);
  assert.equal(image.json().temporary, true);
  assert.match(image.json().imageDataUrl, /^data:image\/svg\+xml;base64,/);
  await app.close();
});
