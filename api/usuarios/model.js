const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");

const url = "mongodb://localhost:27017/";
const dbName = "database";

let client;

async function getDbConnection() {
  if (!client) {
    client = await MongoClient.connect(url, { useNewUrlParser: true });
  }
  return client.db(dbName);
}

async function findAll() {
  try {
    const db = await getDbConnection();
    const usuarios = await db
      .collection("usuarios")
      .find({})
      .toArray();
    return usuarios;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getOne(id) {
  try {
    const db = await getDbConnection();
    const userPlant = await db
      .collection("usuarios")
      .findOne({ _id: ObjectId(id) });
    return userPlant;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function obtenerPorNombre(username) {
  try {
    const db = await getDbConnection();
    const user = await db
      .collection("usuarios")
      .findOne({ username });
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function createOne(datosUsuario) {
  try {
    const db = await getDbConnection();
    const result = await db
      .collection("usuarios")
      .insertOne(datosUsuario);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function updateOne(id, datos) {
  try {
    const db = await getDbConnection();
    const result = await db
      .collection("usuarios")
      .updateOne({ _id: ObjectId(id) }, { $set: datos });
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function deleteOne(id) {
  try {
    const db = await getDbConnection();
    const result = await db
      .collection("usuarios")
      .deleteOne({ _id: ObjectId(id) });
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function buscarUsuario(usuario) {
  let db = basedatos.obtenerConexion();
  return await db.collection("users").findOne({ usuario: usuario });
}

async function comprobarExistenciaUsuario(datos) {
let usuario = await buscarUsuario(datos);
return usuario ? true : false;
}

module.exports = {
  findAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
  buscarUsuario,
  obtenerPorNombre,
  comprobarExistenciaUsuario
};
