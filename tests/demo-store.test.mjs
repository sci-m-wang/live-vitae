import test from "node:test";
import assert from "node:assert/strict";
import { createDemoStore } from "../src/lib/demo-store.mjs";

const seed = { publications: [{ id: "paper", title: "Original" }], profile: { name: "Paimon" }, sections: [] };
const memoryStorage = () => {
  const data = new Map();
  return { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
};
test("demo starts with an independent copy of the bundled content", () => {
  const store = createDemoStore({ storage: memoryStorage(), key: "demo", seed });
  const snapshot = store.read();
  assert.deepEqual(snapshot.documents, seed);
  snapshot.documents.profile.name = "Changed";
  assert.equal(store.read().documents.profile.name, "Paimon");
});
test("saved changes survive a new store instance and preserve other documents", () => {
  const storage = memoryStorage();
  const store = createDemoStore({ storage, key: "demo", seed });
  store.save("publications", [{ id: "new", title: "Added" }], 0);
  const restored = createDemoStore({ storage, key: "demo", seed }).read();
  assert.equal(restored.documents.publications[0].id, "new");
  assert.equal(restored.documents.profile.name, "Paimon");
  assert.equal(restored.revisions.publications, 1);
  assert.equal(seed.publications[0].title, "Original");
});
test("different sites have independent local sandboxes", () => {
  const storage = memoryStorage();
  createDemoStore({ storage, key: "one", seed }).save("sections", [{ id: "page" }], 0);
  assert.deepEqual(createDemoStore({ storage, key: "two", seed }).read().documents.sections, []);
});
test("stale saves cannot overwrite a newer local document", () => {
  const storage = memoryStorage();
  const first = createDemoStore({ storage, key: "demo", seed });
  const second = createDemoStore({ storage, key: "demo", seed });
  first.save("profile", { name: "First tab" }, 0);
  assert.throws(() => second.save("profile", { name: "Second tab" }, 0), { code: "CONTENT_CONFLICT" });
  assert.equal(first.read().documents.profile.name, "First tab");
});
test("reset restores every document and invalidates stale forms", () => {
  const store = createDemoStore({ storage: memoryStorage(), key: "demo", seed });
  store.save("publications", [], 0);
  const reset = store.reset();
  assert.deepEqual(reset.documents, seed);
  assert.throws(() => store.save("profile", { name: "Stale" }, 0), { code: "CONTENT_CONFLICT" });
});
test("malformed local storage is recoverable", () => {
  const storage = memoryStorage();
  storage.setItem("demo", "not json");
  const store = createDemoStore({ storage, key: "demo", seed });
  assert.equal(store.read().recovered, true);
  assert.deepEqual(store.read().documents, seed);
  store.save("sections", [], 0);
  assert.equal(store.read().recovered, false);
});
test("unavailable browser storage supports an explicit session-only fallback", () => {
  const store = createDemoStore({ storage: null, key: "demo", seed });
  assert.equal(store.persistent, false);
  store.save("profile", { name: "Current session" }, 0);
  assert.equal(store.read().documents.profile.name, "Current session");
});
test("quota failures leave the last saved content intact", () => {
  const storage = memoryStorage();
  const store = createDemoStore({ storage, key: "demo", seed });
  storage.setItem = () => { throw new Error("Quota exceeded"); };
  assert.throws(() => store.save("profile", { name: "Too large" }, 0), /Quota exceeded/);
  assert.equal(store.read().documents.profile.name, "Paimon");
});
