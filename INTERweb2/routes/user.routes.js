const express = require('express');
const router = express.Router();

// Ruta de prueba
router.get('/', (req, res) => {
    res.json({message: 'User route is working!'});
});

module.exports = router;

