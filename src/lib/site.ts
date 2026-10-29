import { siteConfig, withBase } from "../../site.config.mjs";

export const site = siteConfig;
export const sitePath = (value: string) => withBase(value, import.meta.env.BASE_URL);
export const repository = {
  owner: import.meta.env.PUBLIC_REPOSITORY_OWNER || site.repository.owner,
  name: import.meta.env.PUBLIC_REPOSITORY_NAME || site.repository.name,
  branch: site.repository.branch,
};
