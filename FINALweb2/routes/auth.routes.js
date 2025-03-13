const express = require('express');
const router = express.Router();

// Ruta de prueba
router.get('/', (req, res) => {
    res.json({message: 'Auth route is working!'});
});

module.exports = router;
