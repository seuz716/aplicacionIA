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
  const resultado = {};

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

  const usuarioExistente = await modeloUsuarios.buscarUsuario({
    usuario: datosUsuario.usuario,
  });
  if (usuarioExistente) {
    resultado.mensaje = "El usuario ya existe en la base de datos";
    resultado.datos = datosUsuario;
    return resultado;
  }

  const claveEncriptada = bcrypt.hashSync(
    datosUsuario.clave,
    parseInt(process.env.ENC_SALTROUNDS)
  );
  datosUsuario.clave = claveEncriptada;

  const resultadoCrear = await modeloUsuarios.crearUno(datosUsuario);
  if (!resultadoCrear) {
    resultado.mensaje = "No se pudo crear el usuario";
    resultado.datos = datosUsuario;
    return resultado;
  }

  if (!resultadoCrear.acknowledged) {
    resultado.mensaje =
      "No se pudo crear el usuario. Error en la operación de creación";
    resultado.datos = resultadoCrear;
    return resultado;
  }

  resultado.mensaje = "Usuario creado correctamente";
  resultado.datos = resultadoCrear;
  return resultado;
}


async function actualizarUsuario(id, datos) {
  let resultado = {};

  if (!id || id.length !== 24) {
    resultado.mensaje = "ID inválido";
    resultado.datos = id;
    return resultado;
  }

  if (!datos || Object.keys(datos).length === 0) {
    resultado.mensaje = "No hay datos para actualizar";
    resultado.datos = datos;
    return resultado;
  }

  if (!datos.nombre || datos.nombre.trim() === "") {
    resultado.mensaje = "Nombre vacío";
    resultado.datos = datos.nombre;
    return resultado;
  }

  let resConsulta = await modeloUsuarios.updateOne(id, datos);
  if (!resConsulta || !resConsulta.acknowledged) {
    resultado.mensaje = "Error al actualizar el usuario";
    resultado.datos = resConsulta;
    return resultado;
  }

  resultado.mensaje = "Usuario actualizado correctamente";
  resultado.datos = resConsulta;
  return resultado;
}

async function eliminarUsuario(id) {
  let resultado = {};
  if (id && id.length === 24 && /^[0-9A-F]+$/i.test(id)) {
    let resultadoEliminar = await modeloUsuarios.deleteOne(id);
    if (resultadoEliminar && resultadoEliminar.acknowledged) {
      resultado.mensaje = "Usuario eliminado correctamente";
      resultado.datos = resultadoEliminar;
    } else {
      resultado.mensaje = "Error al eliminar el usuario en la base de datos";
      resultado.datos = resultadoEliminar;
    }
  } else {
    resultado.mensaje = "ID inválido";
    resultado.datos = id;
  }
  return resultado;
};

async function consultarUsuarios() {
  let resultado = {};
  try {
    let usuarios = await modeloUsuarios.findAll();
    if (usuarios) {
      resultado.mensaje = "Usuarios consultados correctamente";
      resultado.datos = usuarios;
    } else {
      resultado.mensaje = "No se encontraron usuarios en la base de datos";
      resultado.datos = null;
    }
  } catch (error) {
    resultado.mensaje = "Error al consultar usuarios";
    resultado.datos = error;
  }
  return resultado;
}



module.exports = {
 iniciarSesion,
 crearUsuario,
 actualizarUsuario,
 eliminarUsuario,
consultarUsuarios
};
