import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { siteConfig } from "../site.config.mjs";

const readJSON = async (name) => JSON.parse(await readFile(new URL(`../src/data/${name}.json`, import.meta.url), "utf8"));
const profile = await readJSON("profile");
const publications = await readJSON("publications");
const sections = await readJSON("sections");
const ui = await readJSON("ui");
const uniqueIds = (items) => {
  assert.equal(new Set(items.map((item) => item.id)).size, items.length);
  for (const item of items) assert.match(item.id, /^[a-z0-9][a-z0-9-]*$/);
};

test("content collections have stable unique IDs", () => {
  for (const items of [publications, sections, ...["metrics", "experience", "funding", "projects", "awards", "activities", "news"].map((key) => profile[key])]) uniqueIds(items);
  for (const section of sections) uniqueIds(section.entries);
});
test("page slugs are unique and do not shadow built-in routes", () => {
  assert.equal(new Set(sections.map((section) => section.slug)).size, sections.length);
  for (const section of sections) {
    assert.match(section.slug, /^[a-z0-9][a-z0-9-]*$/);
    assert.ok(!["update", "404", "robots.txt"].includes(section.slug));
    assert.ok(["publications", "funding", "experience", "awards", "service", "news", "collection"].includes(section.template));
  }
});
test("publications support all filters and complete detail dialogs", () => {
  for (const paper of publications) {
    for (const key of ["title", "authors", "venue", "venueShort"]) assert.ok(paper[key]);
    assert.ok(["first", "cofirst", "coauthor", "working"].includes(paper.category));
    assert.ok(["published", "accepted", "preprint"].includes(paper.status));
    assert.ok(Number.isInteger(paper.year));
    assert.ok(Number.isInteger(paper.citations.count) && paper.citations.count >= 0);
    assert.ok(paper.links && paper.abstract);
  }
});
test("optional UI overrides are bilingual", () => {
  for (const value of Object.values(ui)) {
    assert.equal(typeof value.en, "string");
    assert.equal(typeof value.zh, "string");
  }
});
test("demo content does not rename structural controls", () => {
  for (const key of ["Update", "Update information", "All work", "First / co-first", "Published", "Working papers", "Education", "Work", "Funding", "Projects", "Abstract", "Details"]) {
    assert.ok(!(key in ui), `Keep functional copy recognizable: ${key}`);
  }
});
test("all configured local assets and localized CV files exist", async () => {
  const paths = [siteConfig.portrait, siteConfig.favicon, siteConfig.socialImage, ...Object.values(profile.links.cv), ...profile.news.map((item) => item.image).filter(Boolean)];
  for (const asset of paths.filter((value) => value.startsWith("/"))) {
    const pathname = new URL(asset, "https://example.org").pathname;
    await access(new URL(`../public${pathname}`, import.meta.url));
  }
});
test("demo ships no encrypted owner vault", { skip: !siteConfig.demo }, async () => {
  await assert.rejects(access(new URL("../public/admin-vault.json", import.meta.url)));
});
