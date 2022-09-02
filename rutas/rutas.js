const Router = require("express").Router()
const passport = require("passport")

//-------Personajes---------
const controladoresPersonajes = require("../controladores/controladorPersonajes")
const {obtenerPersonajes, obtenerUnPersonaje, likeDislike} = controladoresPersonajes // Busco dentro de controladoresPersonajes y traigo cada propiedad
Router.route("/misPersonajes")
.get(obtenerPersonajes)
Router.route("/misPersonajes/:id")
.get(obtenerUnPersonaje)
.put(passport.authenticate("jwt", {session: false}), likeDislike)

//------Comentarios---------
const comentariosControllers = require("../controladores/controladorComentarios")
const {postearComentario, obtenerComentarios, eliminarComentario, modificarComentario} = comentariosControllers

Router.route("/misComentarios")
.post(passport.authenticate("jwt",{session:false}), postearComentario)
.get(obtenerComentarios)

Router.route("/misComentarios/:id")
.delete(passport.authenticate("jwt",{session:false}), eliminarComentario)
.put(passport.authenticate("jwt",{session: false}), modificarComentario)

//-------DetallesPj-------------
const DetallesPj = require("../controladores/controladorDetallesPj")
const {obtenerDetallesPj} = DetallesPj

Router.route("/misDetalles")
.get(obtenerDetallesPj)

//--------Usuarios, Validaciones, Email de verificación y Passport---------
const validador = require("../configuracion/validador")
const usuariosControllers = require("../controladores/controladorUsuarios")
const {agregarUsuario, /*cargarFoto*/ ingresarUsuario, salirUsuario, verificarEmail, verificarToken} = usuariosControllers

Router.route("/auth/misUsuarios")
.post(validador, agregarUsuario) // le pasamos el validador antes de enviar los datos al controlador

// Router.route("/auth/misUsuarios/cargarFoto")
// .post(cargarFoto)

Router.route("/auth/misUsuarios/signIn")
.post(ingresarUsuario)

Router.route("/auth/misUsuarios/signOut")
.post(salirUsuario)

Router.route("/verificacion/:uniqueString")
.get(verificarEmail)

Router.route("/auth/signInToken")
.get(passport.authenticate("jwt",{session:false}), verificarToken) // al igual que con las validaciones, pasa por passport y recien despues pasa a al controlador de verificarToken

module.exports = Router