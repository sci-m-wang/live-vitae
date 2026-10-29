import test from "node:test";
import assert from "node:assert/strict";
import { resolveDeployment, withBase, siteConfig } from "../site.config.mjs";

test("project Pages derives owner, repository and base from Actions", () => {
  assert.deepEqual(resolveDeployment({ GITHUB_REPOSITORY: "alice/my-cv" }), {
    site: "https://alice.github.io", base: "/my-cv/", owner: "alice", repository: "my-cv", branch: "main",
  });
});
test("user and organization sites use the root", () => {
  assert.equal(resolveDeployment({ GITHUB_REPOSITORY: "Alice/alice.github.io" }).base, "/");
});
test("custom domain and explicit base override Pages defaults", () => {
  const result = resolveDeployment({ GITHUB_REPOSITORY: "alice/cv", SITE_URL: "https://cv.example.org", BASE_PATH: "/" });
  assert.equal(result.site, "https://cv.example.org");
  assert.equal(result.base, "/");
  assert.equal(resolveDeployment({ SITE_URL: "https://example.org/research/" }).base, "/research/");
});
test("local defaults follow the configured site", () => {
  assert.equal(resolveDeployment({}).base, siteConfig.base);
  assert.equal(resolveDeployment({}).owner, siteConfig.repository.owner);
});
test("URL helper prefixes internal links once and preserves everything else", () => {
  for (const base of ["/", "/live-vitae/"]) {
    assert.equal(withBase("/publications/?publication=demo#details", base), `${base}publications/?publication=demo#details`);
    assert.equal(withBase("/", base), base);
    assert.equal(withBase(`${base}profile.svg`, base), `${base}profile.svg`);
    for (const value of ["", "#top", "mailto:hello@example.org", "https://example.org", "//example.org/file"]) {
      assert.equal(withBase(value, base), value);
    }
  }
});
