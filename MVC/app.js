require('dotenv').config();
const express = require("express")
const cors = require("cors")
const dbConnect = require('./config/mongo')

const app = express()

//Le decimos a la app de express() que use cors para evitar el error Cross-Domain (XD)
app.use(cors())
app.use(express.json())
app.use("/api", require("./routers"))
app.use("/api/tracks", require("./routers"))

const port=process.env.PORT || 3000

app.listen(port, () => {
    console.log("Servidor escuchando en el puerto " + port)
    dbConnect();
})