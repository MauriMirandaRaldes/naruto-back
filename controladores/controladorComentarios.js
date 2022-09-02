const Comentarios = require("../modelos/modeloComentarios");
const Usuario = require("../modelos/modeloUsuarios")

const comentariosControllers = {

  postearComentario: async function (req, res) {
    var fecha = new Date()
    const formatoProlijo = fecha.toLocaleString()
    const textoFinal = req.body.texto;
    const idPassport = req.user.id

    try {

      const usuario = await Usuario.findOne({_id:idPassport}) // en lugar de usar populate llamé al modelo de usuarios y le dije que me traiga un usuario cuyo _id sea igual al id que viene por passport

      if (usuario){
        var nuevoComentario = await new Comentarios({
          texto: textoFinal,
          fecha: formatoProlijo,
          creador: usuario.nombre,
          foto: usuario.foto
        }).save();

        res.json({
          suceso: true,
          respuesta: nuevoComentario,
          mensaje: "Mensaje posteado correctamente"
        })

      } else {
        res.json({
          mensaje: "Tienes que estar logeado para comentar"
        })
      }
    
    } catch (error) {
      console.log(error);
    }
  },

  obtenerComentarios: async function (req, res) {
    try {
      var misComentarios = await Comentarios.find()
      
    } catch (error) {
      console.log(error);
    }
    res.json({
      respuesta: misComentarios,
    });
  },

  eliminarComentario: async function (req,res){

    var idFinal = req.params.id
    var idPassport = req.user // cuando hago un console.log a idPassport me va a traer el usuario que está logeado

    const comentario = await Comentarios.findOne({_id:idFinal})

    if (comentario){

      if (comentario.creador === idPassport.nombre){
        comentario.remove()
        res.json({
          suceso: true,
          mensaje: "Comentario eliminado correctamente"
        })
      } else {
        res.json({
          suceso: false,
          mensaje: "No puedes eliminar un comentario que no es tuyo"
        })
      }

    }

  },

  modificarComentario: async function (req,res){

    const textoFinal = req.body.textoRecibido // no colocamos req.body.texto porque no podemos pasarle un texto suelto a la variable comentarioFinal, sino que tenemos que pasarle el objeto, que incluya la propiedad texto: y el texto que escribimos
    const idComentario = req.params.id // éste es el id del comentario
    const idPassport = req.user
    const comentario = await Comentarios.findOne({_id:idComentario})
    const fecha = new Date()
    const formatoProlijo = fecha.toLocaleString()

    if (comentario){
      if (comentario.creador === idPassport.nombre){
        await Comentarios.findOneAndUpdate({_id:idComentario},{texto: textoFinal, fecha: formatoProlijo})
        res.json({
          suceso: true,
          mensaje: "Comentario modificado correctamente"
        })
      } else {
        res.json({
          suceso: false,
          mensaje: "No puedes modificar un comentario que no es tuyo"
        })
      }
    }

  }

};

module.exports = comentariosControllers;
