const Personajes = require("../modelos/modeloPersonajes")

const PersonajesControllers = {

    obtenerPersonajes: async function (req,res){

        var misPersonajes

        try {
            misPersonajes = await Personajes.find().populate("detallesPj")
        } catch (error){
            console.log(error)
        }

        res.json(
            {
                respuesta: misPersonajes
            }
        )

    },

    obtenerUnPersonaje: async function (req,res){

        var idFinal = req.params.id

        try {
            var miPersonaje = await Personajes.findOne({_id:idFinal})
            console.log(miPersonaje)
        } catch (error){
            console.log(error)
        }
        res.json(
            {
                suceso: true,
                respuesta: miPersonaje
            }
        )

    },

    likeDislike: async function (req,res){

        const idParametro = req.params.id
        const idPassport = req.user.id

        await Personajes.findOne({_id:idParametro}) // sin este paso no funciona nada
        
        .then(personaje => {
            if (personaje.likes.includes(idPassport)){
                Personajes.findOneAndUpdate({_id:idParametro}, {$pull: {likes: idPassport}}, {new: true})
                .then(respuesta => res.json({
                    suceso: true, 
                    respuesta: respuesta.likes,
                    mensaje: "like quitado correctamente"
                }))
                .catch(error => console.log(error))

            } else {
                Personajes.findOneAndUpdate({_id:idParametro}, {$push: {likes: idPassport}}, {new: true})
                .then(respuesta => res.json({
                    suceso: true,
                    respuesta: respuesta.likes,
                    mensaje: "like agregado correctamente"
                }))
                .catch(error => console.log(error))
            }
        })
        .catch(error => res.json({
            suceso: false,
            respuesta: error
        }))

    }

}

module.exports = PersonajesControllers