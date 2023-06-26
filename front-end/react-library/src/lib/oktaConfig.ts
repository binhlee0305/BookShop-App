export const oktaConfig = {
    clientId: '0oaa255ghvLWvDlvM5d7',
    issuer: 'https://dev-69331449.okta.com/oauth2/default',
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid','profile','email'],
    pkce: true,
    disableHttpsCheck: true,
}