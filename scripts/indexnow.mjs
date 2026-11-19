// Notifica o IndexNow (Bing e motores participantes) sobre URLs novas/alteradas.
// Uso: node scripts/indexnow.mjs [url1 url2 ...]
// Sem args: envia só a home (smoke test).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HOST = "certificacaoiso.com.br";
const KEY = "c0942ba66b2a40c496681d94bea9e90d";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
// Bing WMT costuma refletir melhor envios diretos em www.bing.com/indexnow.
const ENDPOINT = "https://www.bing.com/indexnow";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const keyOnDisk = readFileSync(join(root, "public", `${KEY}.txt`), "utf8").trim();
if (keyOnDisk !== KEY) {
  console.error("Chave no disco não bate com KEY do script.");
  process.exit(1);
}

const args = process.argv.slice(2).filter(Boolean);
const urlList = (args.length ? args : [`https://${HOST}/`]).map((u) => {
  try {
    const parsed = new URL(u);
    if (parsed.hostname !== HOST && parsed.hostname !== `www.${HOST}`) {
      throw new Error(`URL fora do host: ${u}`);
    }
    return parsed.href;
  } catch (e) {
    console.error(e.message || e);
    process.exit(1);
  }
});

const body = {
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList,
};

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});

const text = await res.text();
console.log(`IndexNow ${res.status} ${res.statusText}`);
if (text) console.log(text);
if (![200, 202].includes(res.status)) process.exit(1);
