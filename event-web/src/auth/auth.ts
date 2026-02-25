import { keycloak } from "./keycloak";

export async function initAuth() {
  const authenticated = await keycloak.init({
    onLoad: "check-sso",
    pkceMethod: "S256",
    checkLoginIframe: false,
  });

  // token refresh
  setInterval(async () => {
    if (keycloak.token) {
      try {
        await keycloak.updateToken(60);
      } catch {
        // refresh başarısızsa sessizce logout
        keycloak.logout({ redirectUri: window.location.origin });
      }
    }
  }, 30_000);

  return authenticated;
}

export function login() {
  keycloak.login({ redirectUri: window.location.origin });
}

export function logout() {
  keycloak.logout({ redirectUri: window.location.origin });
}

export function getToken() {
  return keycloak.token ?? "";
}

export function isAuthenticated() {
  return !!keycloak.token;
}

export function getUsername() {
  return keycloak.tokenParsed?.preferred_username as string | undefined;
}

export function getRealmRoles(): string[] {
  const ra = keycloak.tokenParsed?.realm_access as any;
  return (ra?.roles ?? []) as string[];
}

export function isAdmin() {
  return getRealmRoles().some((r) => r.toLowerCase() === "admin");
}

export function getUserId(): string {
  return (keycloak.tokenParsed?.sub as string) ?? "";
}