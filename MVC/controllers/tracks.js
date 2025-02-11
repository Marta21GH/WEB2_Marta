/**
* Obtener lista de la base de datos
* @param {*} req
* @param {*} res
*/
const getItems = (req, res) => {
    const data = ["hola", "mundo"]
    res.send({data})
    }
    //const getItem = (req, res) => {...}
    //const createItem = (req, res) => {...}
    //const updateItem = (req, res) => {...}
    //const deleteItem = (req, res) => {...}
    module.exports = { getItems, getItem,
    createItem, updateItem,
    deleteItem };