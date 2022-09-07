require("dotenv").config() // el metodo config carga el contenido del archivo .env y lo agrega a process.env
const cors = require("cors")
const path = require("path")
const express = require("express")
require("./configuracion/base-de-datos")
const passport = require("./configuracion/passport")
const fileUpload = require("express-fileupload")
const Router = require("./rutas/rutas")
const PORT = 4000

const app = express()

//middlewares
app.use(express.static(path.join(__dirname, "storage")))
app.use(cors())
app.use(fileUpload())
app.use(express.json())
app.use("/api",Router)
app.use(passport.initialize())

app.listen(PORT,()=> console.log(`Estás en el puerto ${PORT}`))

