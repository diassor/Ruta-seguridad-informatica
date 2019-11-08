function getHashParams() {
  const hashParams = {};
  const r = /([^&;=]+)=?([^&;]*)/g;
  const q = window.location.hash.substring(1);

  let e;
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }

  return hashParams;
}

export default getHashParams;

/*Este evalua las variables que estan el hash de la url las
trae como un objeto 
*/
