const documentKeys = ["publications", "profile", "sections"];
const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const validDocuments = (value) => isRecord(value)
  && Array.isArray(value.publications) && isRecord(value.profile) && Array.isArray(value.sections);

/** Local sandbox only. This module has no network or credential dependencies. */
export function createDemoStore({ storage, key, seed }) {
  if (!validDocuments(seed)) throw new Error("Invalid demo seed.");
  const fresh = () => ({
    schema: "live-vitae.demo", version: 1,
    recovered: false,
    documents: structuredClone(seed),
    revisions: { publications: 0, profile: 0, sections: 0 },
  });
  let session = fresh();
  const read = () => {
    if (!storage) return structuredClone({ ...session, recovered: false });
    const raw = storage.getItem(key);
    if (!raw) return fresh();
    try {
      const saved = JSON.parse(raw);
      if (saved.schema !== "live-vitae.demo" || saved.version !== 1 || !validDocuments(saved.documents)
        || !documentKeys.every((name) => Number.isSafeInteger(saved.revisions?.[name]) && saved.revisions[name] >= 0)) {
        throw new Error("Invalid demo snapshot.");
      }
      return { ...saved, recovered: false };
    } catch {
      return { ...fresh(), recovered: true };
    }
  };
  const write = (snapshot) => {
    // Write before updating memory so quota errors never pretend a save succeeded.
    if (storage) storage.setItem(key, JSON.stringify(snapshot));
    session = structuredClone(snapshot);
    return structuredClone(snapshot);
  };
  return {
    persistent: Boolean(storage),
    read,
    save(documentKey, nextDocument, expectedRevision) {
      if (!documentKeys.includes(documentKey)) throw new Error("Unknown demo document.");
      const latest = read();
      if (latest.revisions[documentKey] !== expectedRevision) {
        const error = new Error("其他标签页已保存新版本，请重新检查后再保存。");
        error.code = "CONTENT_CONFLICT";
        throw error;
      }
      const next = structuredClone(latest);
      delete next.recovered;
      next.documents[documentKey] = structuredClone(nextDocument);
      if (!validDocuments(next.documents)) throw new Error("Invalid demo document.");
      next.revisions[documentKey]++;
      return write(next);
    },
    reset() {
      const latest = read();
      const next = fresh();
      for (const name of documentKeys) next.revisions[name] = latest.revisions[name] + 1;
      return write(next);
    },
  };
}
