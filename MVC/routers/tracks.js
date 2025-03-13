const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
    const data = ["hola", "mundo", "tracks"]
    res.send({data})
})

const {getItems, getItem, createItem} = require("../controllers/tracks")
router.get("/", getItems)
//router.get("/:id", getItem)

router.post("/", createItem)

module.exports = router