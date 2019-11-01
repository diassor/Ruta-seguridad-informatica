/*
Para evitar ataques de XSS ,
establecemos un estado que va a ser abreviatorio y
se lo pasaremos al flujo de authentication
pasamos el length y este genera un string

teniendo el length vamos a armar y a tomar aleatoriamente caracteres permitidos hasta cumplir
con el tamano length


*/


const generateRandomString = function(length) {
  let randomString = "";
  const possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; // prettier-ignore

  for (var i = 0; i < length; i++) {
    randomString += possibleChars.charAt(
      Math.floor(Math.random() * possibleChars.length)
    );
  }

  return randomString;
};

module.exports = generateRandomString;
