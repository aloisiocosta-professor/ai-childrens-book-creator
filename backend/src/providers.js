import OpenAI from "openai";

const MOCK_PAGES = [
  "Numa manhã tranquila, a pequena viajante encontrou um mapa desenhado entre as nuvens.",
  "O mapa mostrava uma trilha que começava no jardim e terminava perto de uma estrela azul.",
  "Com curiosidade, ela chamou seu amigo passarinho para seguir as pistas com cuidado.",
  "A primeira pista estava sob uma folha: observar também é uma forma de coragem.",
  "No caminho, uma ponte balançava; os dois pararam, respiraram e pensaram numa solução.",
  "Juntos atravessaram devagar e descobriram que pedir ajuda torna a jornada mais leve.",
  "A estrela azul brilhava numa clareira e agradeceu por terem cuidado da natureza.",
  "De volta para casa, a viajante guardou o mapa e lembrou que cada passo pode ser especial."
];

const storySchema = {
  type: "object",
  additionalProperties: false,
  required: ["pages"],
  properties: {
    pages: {
      type: "array",
      minItems: 8,
      maxItems: 8,
      items: { type: "object", additionalProperties: false, required: ["index", "text"], properties: { index: { type: "integer" }, text: { type: "string" } } }
    }
  }
};

export function createProvider(config = process.env) {
  const mode = config.AI_PROVIDER || "mock";
  if (mode === "mock") {
    return {
      mode,
      async generateStory(book) {
        return MOCK_PAGES.map((text, i) => ({ index: i + 1, text: text.replace("pequena viajante", book.protagonistAlias) }));
      },
      async generateIllustration(book, pageIndex) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><rect width="100%" height="100%" fill="#f6e9d0"/><circle cx="512" cy="400" r="180" fill="#f3c969"/><text x="512" y="760" text-anchor="middle" font-family="sans-serif" font-size="36" fill="#24323a">Ilustração de demonstração • página ${pageIndex}</text></svg>`;
        return { mimeType: "image/svg+xml", imageDataUrl: `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}` };
      }
    };
  }
  if (mode !== "openai") throw new Error("AI_PROVIDER deve ser mock ou openai.");
  if (!config.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY é necessária para ativar AI_PROVIDER=openai.");
  const client = new OpenAI({ apiKey: config.OPENAI_API_KEY });
  return {
    mode,
    async generateStory(book) {
      const response = await client.responses.create({
        model: config.OPENAI_TEXT_MODEL || "gpt-6.2-astra",
        input: [
          { role: "system", content: "Escreva uma história infantil segura, gentil e adequada à idade informada. Não inclua dados pessoais além do apelido fornecido. Responda apenas no schema JSON solicitado." },
          { role: "user", content: JSON.stringify({ protagonistAlias: book.protagonistAlias, age: book.age, theme: book.theme, tone: book.tone }) }
        ],
        text: { format: { type: "json_schema", name: "book_story", strict: true, schema: storySchema } }
      });
      const result = JSON.parse(response.output_text);
      if (!Array.isArray(result.pages) || result.pages.length !== 8) throw new Error("O provedor retornou um formato de história inválido.");
      return result.pages.map((p, i) => ({ index: i + 1, text: String(p.text).slice(0, 1200) }));
    },
    async generateIllustration(book, pageIndex) {
      const page = book.pages[pageIndex - 1];
      if (!page) throw new Error("Página inválida.");
      const response = await client.images.generate({
        model: config.OPENAI_IMAGE_MODEL || "gpt-image-2.5-flare",
        prompt: `Ilustração infantil original, acolhedora, sem texto: ${page.text}. Tema: ${book.theme}. Não retrate pessoa real.`,
        size: "1024x1024",
        n: 1
      });
      const image = response.data?.[0]?.b64_json;
      if (!image) throw new Error("O provedor não retornou uma imagem.");
      return { mimeType: "image/png", imageDataUrl: `data:image/png;base64,${image}` };
    }
  };
}
