import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const narrativeFields = new Set(["bio", "description", "abstract", "summary", "details", "intro"]);
const paragraphs = [];
function collect(value, location, narrative = false) {
  if (typeof value === "string" && narrative && value.trim()) paragraphs.push({ location, text: value });
  else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      collect(child, `${location}.${key}`, narrative || narrativeFields.has(key));
    }
  }
}
for (const name of ["profile", "publications", "sections"]) {
  collect(JSON.parse(await readFile(new URL(`../src/data/${name}.json`, import.meta.url), "utf8")), name);
}

test("narrative prose avoids connecting dashes and semicolons", () => {
  for (const { location, text } of paragraphs) {
    assert.doesNotMatch(text, /[—–;；]/u, location);
  }
});

test("narrative paragraphs use colons sparingly", () => {
  for (const { location, text } of paragraphs) {
    for (const paragraph of text.split(/\n\s*\n/u)) {
      assert.ok((paragraph.match(/[:：]/gu) || []).length <= 1, location);
    }
  }
});
