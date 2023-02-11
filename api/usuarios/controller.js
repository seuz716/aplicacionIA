const express = require("express");
const controladorUsuarios = express.Router();
const servicioUsuarios = require('./service');

controladorUsuarios.get("/iniciarSesion", async (req, res) => {
  try {
    const datosUsuario = req.query;

    // Validar los datos de entrada
    if (!datosUsuario.nombre || !datosUsuario.usuario || !datosUsuario.password) {
      return res.status(400).send({ error: "Faltan datos necesarios para iniciar sesión" });
    }

    const resultado = await servicioUsuarios.iniciarSesion(datosUsuario);
    return res.send(resultado);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Ocurrió un error al procesar la solicitud" });
  }
});

controladorUsuarios.post("/crearUsuario", async (req, res) => {
  try {
    const datosUsuario = req.body;

    // Validar los datos de entrada
    if (!datosUsuario.nombre || !datosUsuario.usuario || !datosUsuario.password || !datosUsuario.rol) {
      return res.status(400).send({ error: "Faltan datos necesarios para crear un usuario" });
    }

    const resultado = await servicioUsuarios.crearUsuario(datosUsuario);
    return res.send(resultado);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Ocurrió un error al procesar la solicitud" });
  }
});

module.exports = controladorUsuarios;
