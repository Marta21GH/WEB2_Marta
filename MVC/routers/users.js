const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
const data = ["hola", "mundo", "users"]
res.send({data})
})
module.exports = router