require("dotenv").config();

const env = ["SPOTIFY_CLIENT_ID", "SPOTIFY_REDIRECT_URI"];

function buildEnvConfig(acc, cur) {
  return { ...acc, [`process.env.${cur}`]: process.env[cur] };
}

module.exports = env.reduce(buildEnvConfig, {});
/*Con el archivo .env se hace un afuncionalidad que se encarga de reemplazar la cadena o variable de entorno por el valor real process.env[cur]
Este debe ser requerido por un archivo .babelrc.js 
*/
