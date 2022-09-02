const joi = require("joi")

const validador = (req,res,next)=> {

    const schema = joi.object(
        {
            nombre: joi.string().max(20).min(3).trim().pattern(new RegExp("[a-zA-Z]")).required().messages(
                {
                    "string.min": "Name must have more than 3 characters",
                    "string.max": "Name must have a maximum of 20 characters"
                }),
        
            apellido: joi.string().max(30).min(3).trim().pattern(new RegExp("[a-zA-Z]")).required().messages(
                {
                    "string.min": "Last name must have more than 3 characters",
                    "string.max": "Last name must have a maximum of 30 characters"
                }),

            email: joi.string().email({minDomainSegments: 2}).required().trim().messages(
                {
                    "string.email": "Wrong email format, not found @"
                }),
                
            contraseña: joi.string().pattern(new RegExp("[a-zA-Z0-9]")).required().trim().min(6).max(20).messages(
                {
                    "string.pattern": "Password must have lowercase, uppercase and a number",
                    "string.min": "Password must have more than 6 characters",
                    "string.max": "Password mus have a maximum of 20 characters"
                }),

            foto: joi.string().pattern(new RegExp("[a-zA-Z0-9]")).required(),
            
            from: joi.string() // Se coloca el from para saber de donde viene el registro
            
        })
        
        const validacion = schema.validate(req.body, {abortEarly: false})

        // console.log(validacion.error)

        if (validacion.error){

            return (

                res.json({
                        suceso: false,
                        mensaje: validacion.error.details // si el usuario se equivoca le va a tirar la respuesta de donde fue que se equivoco, osea las validaciones que creamos arriba
                    })

            )

        }

        next() // el next hace que si la informacion de un input fue correcta pasa al siguiente, continúa

    }

module.exports = validador
