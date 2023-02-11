const express = require('express');
const router = express.Router();

// Importar los modelos y servicios necesarios
const modelo = require('../models/modelo');
const servicio = require('../services/servicio');

// Ruta para iniciar la traducción de texto
router.post('/traducir', async (req, res) => {
  try {
    const textoOriginal = req.body.texto;
    const resultadoTraduccion = await servicio.traducirTexto(textoOriginal);
    return res.status(200).json({ resultado: resultadoTraduccion });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener el historial de traducciones realizadas
router.get('/historial', async (req, res) => {
  try {
    const historial = await modelo.obtenerHistorial();
    return res.status(200).json({ historial });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
