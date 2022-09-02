const Usuarios = require("../modelos/modeloUsuarios");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
// envío del email
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
// token
const jwt = require("jsonwebtoken");
// Esto es para usar el fileUpload/cargarFoto
const path = require("path");

const enviarEmail = async function (email, uniqueString) {
  // si se nos borra el historial de google o algo por el estilo tenemos que entrar nuevamente a la pagina https://developers.google.com/oauthplayground, ingresar el clientid, clientsecret y conseguir un nuevo refreshToken, ya que éste pareciese expirar despues de cierto tiempo. FIJARSE EN EL CUADERNO LOS PASOS
  // https://mail.google.com

  const miOAuth2Client = new OAuth2(
    process.env.GOOGLE_CLIENTID,
    process.env.GOOGLE_CLIENTSECRET,
    "https://developers.google.com/oauthplayground"
  );

  miOAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESHTOKEN,
  });

  const tokenAcceso = miOAuth2Client.getAccessToken();

  const transporte = nodemailer.createTransport({
    /* Todas estas propiedades tienen que tener estos nombre si o si, vienen por dafault, no puedo escribirlas en español ni de otra manera, si o si las propiedades de este objeto transporte, tienen que tener éstos nombres */
    service: "gmail",
    auth: {
      user: process.env.USUARIO,
      type: "OAuth2",
      clientId: process.env.GOOGLE_CLIENTID,
      clientSecret: process.env.GOOGLE_CLIENTSECRET,
      refreshToken: process.env.GOOGLE_REFRESHTOKEN,
      accessToken: tokenAcceso,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const opcionesEmail = {
    // Las propiedades de este objeto tambien tienen que llevar si o si el nombre from, to, subject, etc, sino tira error la pagina
    from: process.env.USUARIO,
    to: email,
    subject: "Verificación de email",
    html: `<div>
            <h1 style="text-align:center" > Click <a href = "http://localhost:4000/api/verificacion/${uniqueString}" >here</a> form confirm your email, let's see who is the biggest dog here </h1>
            <img style="margin-left:12rem" src = "http://img2.wikia.nocookie.net/__cb20110825232746/naruto/es/images/1/12/La_Promesa_de_Naruto.png"/>
                </div>`,
  };

  await transporte.sendMail(opcionesEmail, function (error, respuesta) {
    // sendMail es un metodo ya definido, por dafault

    if (error) {
      console.log(error);
    } else {
      console.log("Mensaje enviado");
    }
  });
};

const usuariosControllers = {
  verificarEmail: async function (req, res) {
    const { uniqueString } = req.params;
    const usuario = await Usuarios.findOne({ uniqueString: uniqueString }); // va a buscar un usuario dentro de la base de datos cuya clave unica coincida con la clave unica que viene por parámetro

    console.log(usuario);

    if (usuario) {
      (usuario.emailVerificado = true), await usuario.save();
      res.redirect("http://localhost:3000/bienvenida");
    } else {
      res.json({
        suceso: false,
        respuesta: "Your mail was not verified",
      });
    }
  },

  agregarUsuario: async function (req, res) {
    const { nombre, apellido, email, contraseña, foto, from } = req.body; // desestructuro req.body, y separo los datos

    try {
      const usuarioExiste = await Usuarios.findOne({ email }); // IMPORTANTE: {email} TIENE QUE SER UN OBJETO, YA QUE BUSCAMOS DENTRO DE LA COLECCION USUARIOS UN OBJETO QUE TENGA LA PROPIEDAD "email". SI COLOCAMOS LA PALABRA email sin las llaves {}, NO LO ENCUENTRA. Buscamos dentro de nuestra coleccion un email, si lo encontramos es porque el usuario existe

      if (usuarioExiste) {
        // SI EL USUARIO EXISTE EN LA BASE DE DATOS

        if (usuarioExiste.from.indexOf(from) !== -1) {
          // si el from del usuario que está en la base de datos es igual al from que viene de los datos cargados en el formulario. SE USA "indexOf" PORQUE EL FROM DE NUESTRA BASE DE DATOS ES UN ARRAY, ENTONCES AL COLOCAR usuarioExiste.from.indexOf("signUp") estamos buscando dentro de ese array, un from que sea igual a signUp

          res.json({
            mensaje:
              "You have already made your sign up by this means, please sign in",
          });
        } else {
          const contraseñaHasheada = bcryptjs.hashSync(contraseña, 10); // Encriptamos la contraseña, hashear es encriptar
          usuarioExiste.from.push(from); // Le pusheamos el nuevo from al usuario que está en la base de datos
          usuarioExiste.contraseña.push(contraseñaHasheada); // Le pusheamos la contraseña encriptada a la contraseña del usuario que ya está en la base de datos

          if (from === "signUp") {
            // si esta intentando ingresar desde signUp

            usuarioExiste.uniqueString = crypto.randomBytes(15).toString("hex"); // le creamos una clave única
            await usuarioExiste.save();
            await enviarEmail(email, usuarioExiste.uniqueString); // llamamos a la funcion enviarEmail y por parámetro le pasamos el email del usuario y su uniqueString

            res.json({
              mensaje:
                "We sent you an email to validate it, please check your mailbox",
            });
          } else {
            // si el from desde el cual estamos enviando los datos no viene de sign up sino de otro medio

            await usuarioExiste.save();

            res.json({
              mensaje: `Agregamos ${from} a tus medios para realizar sign in`,
            });
          }
        }
      } else {
        // SI EL USUARIO NO EXISTE EN LA BASE DE DATOS

        const contraseñaHasheada = bcryptjs.hashSync(contraseña, 10);

        const nuevoUsuario = await new Usuarios({
          nombre: nombre,
          apellido: apellido,
          email: email,
          contraseña: contraseñaHasheada,
          foto: foto,
          emailVerificado: false,
          from: from,
          uniqueString: crypto.randomBytes(15).toString("hex"), // si se crea un nuevoUsuario le creamos su uniqueString
        });

        if (from !== "signUp") {
          await nuevoUsuario.save();

          res.json({
            mensaje: `Felicitaciones, su cuenta se ha creado exitosamente con ${from}`,
          });
        } else {
          await nuevoUsuario.save();
          enviarEmail(email, nuevoUsuario.uniqueString);

          res.json({
            mensaje:
              "We sent you an email to validate it, please check your mailbox",
          });
        }
      }
    } catch (error) {
      res.json({
        mensaje: "Something went wrong, please try again",
      });
    }
  },

  ingresarUsuario: async function (req, res) {
    const { email, contraseña, from } = req.body; // desestructuramos req.body y separamos los datos

    try {
      const usuarioExiste = await Usuarios.findOne({ email });
      console.log(usuarioExiste)

      if (!usuarioExiste) {
        // Si el usuario no existe

        res.json({
          mensaje:
            "Your user is not registered, please go to sign up and register",
          suceso: false,
        });
      } else {
        // Si el usuario existe

        // console.log(usuarioExiste)

        if (from !== "signIn") {
          // Si el usuario está intentando acceder por un medio que sea distinto a nuestro formulario ("signIn")

          var contraseñaCoincide = usuarioExiste.contraseña.filter((elemento) =>
            bcryptjs.compareSync(contraseña, elemento)
          ); // Comparamos la contraseña que el usuario está ingresando con la contraseña que está en el usuario en la base de datos

          if (contraseñaCoincide.length > 0) {
            // si contraseñaCoincide es true, es decir, si la comparación fue exitosa, va a hacer lo siguiente

            const dataUsuario = {
              // creamos un objeto con la información proveniente del usuario creado en nuestra base de datos
              nombre: usuarioExiste.nombre,
              apellido: usuarioExiste.apellido,
              email: usuarioExiste.email,
              foto: usuarioExiste.foto,
              from: usuarioExiste.from,
              id: usuarioExiste._id, // a data usuario le agregamos también el id del usuario para el desencriptado del token
            };

            await usuarioExiste.save();
            const token = jwt.sign(dataUsuario, process.env.SECRET_KEY, {expiresIn: 60 * 60 * 24,});

            res.json({
              suceso: true,
              respuesta: { dataUsuario, token }, // en la respuesta le pasamos dataUsuario y también el token
              mensaje: `Welcome again ${usuarioExiste.nombre}`,
            });
          } else {
            // Si la contraseña que el usuario está ingresando no coincide con la que está en la base de datos

            res.json({
              suceso: false,
              mensaje: `No realizaste el registro con ${from}, si querés ingresar por éste medio anda a sign up y registrate con ${from} `,
            });
          }
        } else {
          // Si el usuario está intentando acceder por nuestro formulario de signIn

          if (usuarioExiste.emailVerificado === true) {
            // Si email verificado es true, va a hacer lo siguiente

            var contraseñaCoincide = usuarioExiste.contraseña.filter(
              (elemento) => bcryptjs.compareSync(contraseña, elemento)
            ); // nos cercioramos de que la contraseña que el usuario haya escrito sea la misma que está dentro de la base de datos

            if (contraseñaCoincide.length > 0) {
              // si la contraseña coincide

              const dataUsuario = {
                // si la contraseña coincide le damos acceso
                nombre: usuarioExiste.nombre,
                email: usuarioExiste.email,
                foto: usuarioExiste.foto,
                id: usuarioExiste._id,
              };

              const token = jwt.sign(dataUsuario, process.env.SECRET_KEY /*{expiresIn: 60 * 60 * 24}*/ ); // el primer parametro del metodo sign es el payload, el segund el secret key y el tercer opciones

              res.json({
                suceso: true,
                respuesta: { dataUsuario, token },
                mensaje: `Welcome again ${usuarioExiste.nombre}`,
              });
            } else {
              // si la contraseña no coincide

              res.json(
                // si la contraseña no coincide no le damos acceso
                {
                  suceso: false,
                  mensaje: "Mail and password do not match",
                }
              );
            }
          } else {
            // Si el email no fue verificado

            res.json({
              suceso: false,
              mensaje:
                "Yor mail was not verified, please go to your mailbox and check it",
            });
          }
        }
      }
    } catch (error) {
      res.json({
        mensaje: "Something wen wrong, please try again",
      });
    }
  },

  salirUsuario: async function (req, res) {
    var email = req.body.emailRecibido;

    var usuario = await Usuarios.findOne({ email });
    await usuario.save();

    res.json({
      suceso: true,
      mensaje: `${email} disconected`,
    });
  },

  verificarToken: async function (req, res) {

    if (req.user) {
      res.json({
        suceso: true,
        respuesta: {
          id: req.user.id, // Este id es el que tiene guardado el payload del token, revisar en pagina token.dev
          nombre: req.user.nombre,
          apellido: req.user.apellido,
          email: req.user.email,
          foto: req.user.foto,
          from: "token",
        },
        mensaje: "Welcome again " + req.user.nombre,
      });
    } else {
      res.json({
        suceso: false,
        mensaje:
          "You session expired, please sign in again",
      });
    }
  },

  // cargarFoto: async function (req, res) {

  //   const foto = req.files.foto;

  //   try {
  //     const nuevoNombre = crypto.randomBytes(10).toString("hex") + "." + foto.name.split(".")[foto.name.split(".").length - 1];
  //     const ruta = path.resolve("storage", nuevoNombre); // enruta con mi carpeta storage. Qué es lo que enruta? enruta mi const nuevoNombre a la carpeta storage

  //     foto.mv(ruta, (error) => {
  //       if (error) {
  //         console.log(error);
  //       } else {
  //         console.log("Imagen cargada correctamente");
  //       }
  //     });

  //     res.json({
  //       suceso: true,
  //       respuesta: nuevoNombre,
  //       mensaje: "Imagen cargada correctamente"
  //     })

  //   } catch (error) {
  //     res.json({
  //       suceso: false,
  //       error: error,
  //     });
  //   }
  // },
};

module.exports = usuariosControllers;