import { createApp } from "./app.js";
import { createStore } from "./store.js";
const store = createStore(process.env);
await store.initialize();
const app = createApp({ store });
const port = Number(process.env.PORT || 3000);
await app.listen({ port, host: "0.0.0.0" });
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => { await app.close(); await store.close?.(); process.exit(0); });
}
