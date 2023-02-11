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
    // Recoger los datos del usuario desde la petición
    const datosUsuario = req.body;

    // Validar los datos de entrada
    if (!datosUsuario.nombre || !datosUsuario.usuario || !datosUsuario.password || !datosUsuario.rol) {
      return res.status(400).send({ error: "Faltan datos necesarios para crear un usuario" });
    }

    // Crear el usuario a través del servicio
    const resultado = await servicioUsuarios.crearUsuario(datosUsuario);

    // Enviar la respuesta
    return res.send(resultado);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Ocurrió un error al procesar la solicitud" });
  }
});


controladorUsuarios.put("/actualizarUsuario/:id", async function (req, res) {
  let id = req.params.id;
  let datos = req.body;
  try {
    let resultado = await servicioUsuarios.actualizarUsuario(id, datos);
    res.send(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).send({error: "Ha ocurrido un error al actualizar el usuario"});
  }
});

controladorUsuarios.delete("/eliminarUsuario/:id", async function (req, res) {
  let id = req.params.id;
  if (!id) {
    return res.status(400).send({ mensaje: "No se proporcionó un ID" });
  }
  if (typeof id !== "string" || id.length !== 24 || !/^[0-9A-F]+$/i.test(id)) {
    return res.status(400).send({ mensaje: "El ID proporcionado no es válido" });
  }
  let resultado = await servicioUsuarios.eliminarUsuario(id);
  res.send(resultado);
});

controladorUsuarios.get("/consultarUsuarios", async function (req, res) {
  let resultado = await servicioUsuarios.consultarUsuarios();
  res.send(resultado);
});

module.exports = controladorUsuarios;
