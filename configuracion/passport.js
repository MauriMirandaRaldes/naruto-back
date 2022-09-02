const passport = require("passport")
const jwtStrategy = require("passport-jwt").Strategy // requiero la estrategia
const extractJwt = require("passport-jwt").ExtractJwt // requiero la extracción
const Usuario = require("../modelos/modeloUsuarios")

module.exports = passport.use( new jwtStrategy ({ // el metodo use requiere un parametro, el tipo de estrategia

    jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY

},(jwt_payload, done)=> { // SI LA INFORMACION NO ESTA LLEGANDO A PASSPORT ES PORQUE EL TOKEN EXPIRÓ, HAY QUE VOLVER A HACER SIGN UP Y SING IN PARA SOLUCIONARLO

    Usuario.findOne({_id: jwt_payload.id})

    .then(usuario => {
        if (usuario){
            return done(null, usuario) // el metodo done tiene dos parametros, el primero es el error, el segundo  es la info
        }
        else {
            return done(null, false)
        }
    }).catch (error => {
        console.log(error.status) // éste es el error que despues llega como error status 401
        return done(error, false)
    })

}))