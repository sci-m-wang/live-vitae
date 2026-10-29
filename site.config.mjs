/** Public configuration only. Never put passwords or GitHub tokens here. */
export const siteConfig = {
  // true: public local-editing sandbox. false: password-unlocked GitHub owner editor.
  demo: true,
  defaultLanguage: "zh",
  site: "https://sci-m-wang.github.io",
  base: "/live-vitae/",
  repository: { owner: "sci-m-wang", name: "live-vitae", branch: "main" },
  portrait: "/paimon-portrait.jpg",
  favicon: "/paimon-icon.png",
  socialImage: "/media/paimon-birthday.png",
  // Optional integrations are off until these identifiers are configured.
  scholarAuthorId: "",
  githubUsername: "",
  contributionStartYear: 2020,
};

/** @param {Record<string, string | undefined>} env */
export function resolveDeployment(env = {}) {
  const [owner, repository] = (env.GITHUB_REPOSITORY || `${siteConfig.repository.owner}/${siteConfig.repository.name}`).split("/");
  const siteURL = new URL(env.SITE_URL || (env.GITHUB_REPOSITORY ? `https://${owner}.github.io` : siteConfig.site));
  const defaultBase = env.SITE_URL
    ? siteURL.pathname
    : env.GITHUB_REPOSITORY
      ? (repository.toLowerCase() === `${owner}.github.io`.toLowerCase() ? "/" : `/${repository}/`)
      : siteConfig.base;
  const base = `/${(env.BASE_PATH ?? defaultBase).replace(/^\/+|\/+$/g, "")}/`.replace(/^\/\/$/, "/");
  return { site: siteURL.origin, base, owner, repository, branch: siteConfig.repository.branch };
}

/** Prefix root-relative links only; retain query strings, hashes and remote URLs.
 * @param {string} value
 * @param {string} base
 */
export function withBase(value, base = "/") {
  if (!value.startsWith("/") || value.startsWith("//")) return value;
  const prefix = `/${base.replace(/^\/+|\/+$/g, "")}/`.replace(/^\/\/$/, "/");
  if (prefix !== "/" && (value === prefix.slice(0, -1) || value.startsWith(prefix))) return value;
  return prefix + value.slice(1);
}
