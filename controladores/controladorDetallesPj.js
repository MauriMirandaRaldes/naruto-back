const DetallesPj = require("../modelos/modeloDetallesPj")

const DetallesPjControllers = {

    obtenerDetallesPj: async function (req,res){

        try {
            var misDetalles = await DetallesPj.find()
            console.log(misDetalles)
        } catch (error){
            console.log(error)
        }
        res.json(
            {
                respuesta: misDetalles,
                suceso: true
            }
        )

    }

}

module.exports = DetallesPjControllers