const mongoose = require("mongoose")

const fotoSchema = new mongoose.Schema(
    {
        imagenPerfil: {type: String}
    }
)

const fotoPerfil = mongoose.model("fotoperfils", fotoSchema)
module.exports = fotoPerfil