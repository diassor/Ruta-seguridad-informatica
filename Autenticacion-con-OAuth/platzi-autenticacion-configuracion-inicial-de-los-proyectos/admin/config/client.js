const config = {
  spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
  spotifyRedirectUri: process.env.SPOTIFY_REDIRECT_URI
};

module.exports = { config };
/*configuramos que nuestras variantes de entorno sean
leidas por nuestro client
spotifyClientId = archivo de configuracion basado en las variantes de entorno
process.env.SPOTIFY_CLIENT_ID = para que las variantes de entorno sean leidas las cambiamos en setup por la variantes de entorno reales

*/
