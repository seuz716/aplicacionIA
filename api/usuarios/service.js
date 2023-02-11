const express = require('express');
const bcrypt = require('bcrypt');
const modeloUsuarios = require('./model');
const jwt = require('../auth/jwt');
require('dotenv').config();

async function iniciarSesion(datosUsuario) {
  let resultado = {};

  if (datosUsuario && Object.keys(datosUsuario).length > 0 && datosUsuario.usuario && datosUsuario.clave) {
    let usuario = await modeloUsuarios.buscarUsuario(datosUsuario.usuario);

    if (usuario) {
      let claveEncriptada = usuario.clave;
      let esValida = bcrypt.compareSync(datosUsuario.clave, claveEncriptada);

      if (esValida) {
        let existe = await modeloUsuarios.comprobarExistenciaUsuario(datosUsuario.usuario);

        if (!existe) {
          resultado.mensaje = "Inicio de sesión correcto";
          let token = jwt.generarToken(usuario);
          delete usuario.clave;
          resultado.token = token;
        } else {
          resultado.mensaje = "El usuario ya existe";
        }
      } else {
        resultado.mensaje = "Usuario o Clave incorrectos";
        resultado.datos = datosUsuario;
      }
    } else {
      resultado.mensaje = "Usuario o Clave incorrectos";
      resultado.datos = datosUsuario;
    }
  } else {
    resultado.mensaje = "Datos Incorrectos";
    resultado.datos = datosUsuario;
  }

  return resultado;
}


async function crearUsuario(datosUsuario) {
let resultado = {};


if (!datosUsuario) {
    resultado.mensaje = "No se han proporcionado datos del usuario";
    resultado.datos = null;
    return resultado;
}

if (!datosUsuario.usuario || !datosUsuario.clave) {
    resultado.mensaje = "El usuario y la clave son campos requeridos";
    resultado.datos = datosUsuario;
    return resultado;
}

// Verifica que el usuario no exista previamente en la base de datos
let usuarioExistente = await modeloUsuarios.buscarUsuario({usuario: datosUsuario.usuario});
if (usuarioExistente) {
    resultado.mensaje = "El usuario ya existe en la base de datos";
    resultado.datos = datosUsuario;
    return resultado;
}

let claveEncriptada = bcrypt.hashSync(datosUsuario.clave, parseInt(process.env.ENC_SALTROUNDS));
datosUsuario.clave = claveEncriptada;

let resultadoCrear = await modeloUsuarios.crearUno(datosUsuario);
if (!resultadoCrear) {
    resultado.mensaje = "No se pudo crear el usuario";
    resultado.datos = datosUsuario;
    return resultado;
}

if (!resultadoCrear.acknowledged) {
    resultado.mensaje = "No se pudo crear el usuario. Error en la operación de creación";
    resultado.datos = resultadoCrear;
    return resultado;
}

resultado.mensaje = "Usuario creado correctamente";
resultado.datos = resultadoCrear;
return resultado;
};


module.exports = {
 iniciarSesion,
 crearUsuario
};
