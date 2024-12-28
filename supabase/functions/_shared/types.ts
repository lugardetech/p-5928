export interface MercadoLivreTokens {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

export interface TokenExchangeRequest {
  code: string;
  userId: string;
  integrationId: string;
}