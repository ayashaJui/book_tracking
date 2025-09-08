import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from "../../environments/environment";

export const authCodeFlowConfig: AuthConfig = {
    issuer: environment.authorization_server_url,
    clientId: environment.oauth2_client_id,
    redirectUri: window.location.origin,
    silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
    responseType: 'code',
    scope: 'openid profile email',
    requireHttps: false,
    oidc: true,
    useSilentRefresh: true,
    timeoutFactor: 0.75,
}