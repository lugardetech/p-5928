export class IntegrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IntegrationError';
  }
}

export const handleMercadoLivreError = (errorData: any): string => {
  switch(errorData.error) {
    case 'invalid_client':
      return 'Credenciais do aplicativo (client_id/client_secret) inválidas';
    case 'invalid_grant':
      return 'Código de autorização inválido ou expirado';
    case 'invalid_request':
      return 'Requisição inválida - verifique os parâmetros enviados';
    default:
      return `Erro: ${errorData.error_description || errorData.message || JSON.stringify(errorData)}`;
  }
};