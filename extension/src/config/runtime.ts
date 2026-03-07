function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

const DEFAULT_WEB_ORIGIN = "http://localhost:3000";
const webOriginFromEnv = import.meta.env.VITE_WEB_ORIGIN;

export const WEB_ORIGIN = trimTrailingSlash(
  webOriginFromEnv && webOriginFromEnv.trim().length > 0
    ? webOriginFromEnv
    : DEFAULT_WEB_ORIGIN,
);

const rewriteEndpointFromEnv = import.meta.env.VITE_REWRITE_ENDPOINT;
export const REWRITE_ENDPOINT =
  rewriteEndpointFromEnv && rewriteEndpointFromEnv.trim().length > 0
    ? rewriteEndpointFromEnv
    : `${WEB_ORIGIN}/api/extension/rewrite`;
