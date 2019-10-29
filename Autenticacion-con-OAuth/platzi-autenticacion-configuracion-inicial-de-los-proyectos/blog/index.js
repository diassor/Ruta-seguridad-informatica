const express = require("express");
const path = require("path");
const request = require("request");
const querystring = require("querystring");
const cors = require("cors");
const cookieParser = require("cookie-parser");


/*Ahora ponemos nuestras utilidades
*/
const generateRandomString = require("./utils/generateRandomString");
const encodeBasic = require("./utils/encodeBasic");
const scopesArray = require("./utils/scopesArray");

const playlistMocks = require("./utils/mocks/playlist");
//incluir nuestra configuracion la que tenemos todas
//las variantes de entorno que definimos
const { config } = require("./config");


const app = express();

// static files
app.use("/static", express.static(path.join(__dirname, "public")));

//middlewares esto es como funciona express y del
//backend que se esta utilizando cada tecnologia
//tiene su forma de imprementar los cors y de leer las cookies
//cors buena practica de seguridad
app.use(cors());
app.use(cookieParser());


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// routes
app.get("/", async function(req, res, next) {
  const { access_token: accessToken } = req.cookies;

  try {
    const userInfo = await getUserInfo(accessToken);
    res.render("playlists", {
      userInfo,
      isHome: true,
      playlists: { items: playlistMocks }
    });
  } catch (error) {
    next(error);
  }
});

app.get("/playlists", async function(req, res, next) {
  const { access_token: accessToken } = req.cookies;

  if (!accessToken) {
    return res.redirect("/");
  }

  try {
    const userInfo = await getUserInfo(accessToken);
    const userPlaylists = await getUserPlaylists(accessToken, userInfo.id);

    res.render("playlists", { userInfo, playlists: userPlaylists });
  } catch (error) {
    next(error);
  }
});


//nuestro endpoint de login
app.get("/login", function(req, res) {
  const state = generateRandomString(16);

  const queryString = querystring.stringify({
    response_type: "code", //este es el cambio por el access token
    client_id: config.spotifyClientId, //pasamos el client ID de spotify que lo sacamos de config
    scope: scopesArray.join(" "), // scope es un string separado por espacios , lo tenemos asi para el futuro agregar mas scope
    redirect_uri: config.spotifyRedirectUri,
    state: state
    // es el state que acabamos de hacer , nos aseguramos que sea el mismo con el que empezamos el retorno (no pobrem CXX)
  });

  res.cookie("auth_state", state, { httpOnly: true }); // nos aseguramos que la cookie sea httpOnly para que no puedan aceder del cliente
  res.redirect(`https://accounts.spotify.com/authorize?${queryString}`);  // redirecionamos a spotify accounts y pasamos el querystring
});
//pasamos el endpoint callback que debe ser igual a la url de redirecionamiento que le pasamos
//al cliente spotify
/*
lo que hace este callback es leer el codigo osea cuando el cliente acepta dar los permisos de
autorización a nuestra app no envia el codigo que posteriormente lo vamos a usar por el access token
generalmente ese codigo lo envia en el query y tambien nos envia el estado que le pasamos
*/
app.get("/callback", function(req, res, next) {
  const { code, state } = req.query;
  const { auth_state } = req.cookies;

/*sacamos el codigo del query y lo verificamos
si el estado es null o si pertenece  si es diferente lo sacamos del req.cookies gracias al cookieParser
entonces enviamos un error
Express maneja los errores llamando a next con un error
de esta manera evitamos los ataques de XSS
si el estado es valido podemos limpiar la cookie ya no neceito almacenar ese estado en especial si queremos hace nuevos require states
*/
  if (state === null || state !== auth_state) {
    next(new Error("The state doesn't match"));
  }

  res.clearCookie("auth_state");
/*Ahora construimos construimos un objeto para nuestro require donde esta la url que esta  nuestro token
grand_type es sabe que le estamos enviando un codigo y que requerimos el token
*/
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: config.spotifyRedirectUri,
      grant_type: "authorization_code"
    },
/*En el headers acemos un authorization para usar nuestra utilidad encodeBasic le pasamos el spotifyClientId y spotifyClientSecret
*/
    headers: {
      Authorization: `Basic ${encodeBasic(
        config.spotifyClientId,
        config.spotifyClientSecret
      )}`
    },
/*queremos que este query sea de tipo json y con esto ya tenemos nuestro objeto de configuracion
*/
    json: true
  };
/*hacemos un request de tipo post con nustras opciones y el callback de error con tres argumentos si hay un error o el state del response es
diferente de 200 sale el error mediante express */

  request.post(authOptions, function(error, response, body) {
    if (error || response.statusCode !== 200) {
      next(new Error("The token is invalid"));
    }
/*En caso contrario almacenamos nuestro access token en una cookie para usarlo en nuestros request y nos aseguramos que sea httpOnly para que solo se pueda
leer del lado del servidor */
    res.cookie("access_token", body.access_token, { httpOnly: true });
/*Finalmente hacemos un redirect para ver los playlists del usuario */
    res.redirect("/playlist");
  });
});



// server
const server = app.listen(3000, function() {
  console.log(`Listening http://localhost:${server.address().port}`);
});
