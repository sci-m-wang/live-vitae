import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { resolveDeployment } from "../site.config.mjs";

const root = path.resolve("dist");
const { base } = resolveDeployment(process.env);
async function* files(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* files(file);
    else if (file.endsWith(".html")) yield file;
  }
}
const failures = [];
let checked = 0;
for await (const file of files(root)) {
  const html = await readFile(file, "utf8");
  for (const match of html.matchAll(/\b(?:href|src|data-href-en|data-href-zh)="([^"\s]*)"/g)) {
    const value = match[1];
    if (!value.startsWith("/") || value.startsWith("//")) continue;
    const pathname = new URL(value, "https://example.org").pathname;
    if (!pathname.startsWith(base)) {
      failures.push(`${path.relative(root, file)}: missing base prefix: ${value}`);
      continue;
    }
    const relative = decodeURIComponent(pathname.slice(base.length));
    let target = path.resolve(root, relative);
    try {
      if ((await stat(target)).isDirectory()) target = path.join(target, "index.html");
      await stat(target);
      checked++;
    } catch {
      failures.push(`${path.relative(root, file)}: missing target: ${value}`);
    }
  }
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else console.log(`Validated ${checked} local URLs with base ${base}`);
