export const getLoginUrl = () => {
  const oauthPortalUrlRaw = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;

  if (!oauthPortalUrlRaw || !appId) {
    console.error("Missing OAuth env vars", {
      VITE_OAUTH_PORTAL_URL: oauthPortalUrlRaw,
      VITE_APP_ID: appId,
    });

    // Fallback: stay on page instead of crashing
    return window.location.origin;
  }

  // Ensure valid absolute URL
  const oauthPortalUrl = oauthPortalUrlRaw.startsWith("http")
    ? oauthPortalUrlRaw
    : `https://${oauthPortalUrlRaw}`;

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL("/app-auth", oauthPortalUrl);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
