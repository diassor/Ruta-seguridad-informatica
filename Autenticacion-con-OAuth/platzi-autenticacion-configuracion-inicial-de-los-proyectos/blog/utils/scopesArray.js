/*
scopeArray.js son los scope en auth son los diferentes permisos que le pedimos al authorization server
dependiendo de los scope que le pedimos nos entrega un token que tiene firmado esos permisos
los scope vienen en los clients que hay loslista
de esta manera podemos estar firmando toquens con diferentes permisos

es necesario que se tengan los endpoints para que den los token necesarios
estos sonlos endpoints que necesito

"user-read-private", = nos entrega info del user

"user-read-email", =  para saber almenos el email del user

se hace en un Array por que es mas facil escalar
si queremos otro scope solo agregamos al array

*/

const scopesArray = [
  "user-read-private",
  "user-read-email",
  "playlist-read-collaborative"
];

module.exports = scopesArray;
