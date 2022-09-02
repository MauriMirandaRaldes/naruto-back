const mongoose = require("mongoose")

mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true, // nos conectamos a mongoose con dos formas de conexión
    useNewUrlParser: true
})
.then(() => console.log("Base de datos conectada"))
.catch(err => console.error(err))

// en el servidor tenemos que requerir lo que hicimos acá