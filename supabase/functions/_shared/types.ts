export interface MercadoLivreTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface TokenExchangeRequest {
  code: string;
  userId: string;
  integrationId: string;
}