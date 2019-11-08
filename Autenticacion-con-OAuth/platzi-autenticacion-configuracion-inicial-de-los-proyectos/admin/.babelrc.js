const env = require(".config/setup");

module.exports = {
  presets: ["next/babel"],
  plugins: [["transform-define", env]]
};

/*Como estamos usando next
debemos reescribir la configuracion de next
almenos por defecto debemos incluir
presets: ["next/babel"],
Esto tiene toda la config that need next for to work
now add the plugin
    plugins: [["transform-define", env]]
pasamos las .env de nuestro archivo de config
de esta manera podemos requerir ower file client.js
for to access to variables of enveroment
*/
