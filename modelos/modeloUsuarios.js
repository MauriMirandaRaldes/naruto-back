const mongoose = require("mongoose")

const UsuariosScheema = new mongoose.Schema(
    {
        nombre: {type: String, required: true},
        apellido: {type: String, required: true},
        email: {type: String, required: true},
        contraseña: [{type:String, required:true}],
        foto: {type: String},
        emailVerificado: {type: Boolean, required: true},
        from: {type: Array}, // from es un array porque va a traer desde donde nos logeamos, puede traer que nos logeamos manualmente, tambien desde google, facebook, etc
        uniqueString: {type:String, required:true}
    }
)

const Usuarios = mongoose.model("usuarios", UsuariosScheema)

module.exports = Usuarios