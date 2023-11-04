
const express = require('express');
const router = express.Router();
const Permiso = require('../../models/Permiso');



router.get('/', async (req, res) => {
  try {
    const permisos = await Permiso.findAll();
    res.json(permisos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error en el servidor.' });
  }
});

module.exports = router;