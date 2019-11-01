function encodeBasic(username, password) {
  return Buffer.from(`${username}:${password}`).toString("base64");
}

module.exports = encodeBasic;


/*
Esta utilidad nos ayuda a encodear a base64
recordemos que codificamos user and password
esta utilidad Buffer me ayuda a crear la codificacion base64

exportar las utils */
