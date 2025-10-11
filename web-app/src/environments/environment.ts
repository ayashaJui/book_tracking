const apiGatewayUrl = 'http://localhost:9071';

export const environment = {
  production: false,

  authorization_server_url: 'http://localhost:9072',

  user_service_url: `${apiGatewayUrl}/userservice/v1`,
  user_library_service_url: `${apiGatewayUrl}/userlibraryservice/v1`,
  catalog_service_url: `${apiGatewayUrl}/catalogservice/v1`,

  oauth2_client_id: 'biblioteca-web',
};
