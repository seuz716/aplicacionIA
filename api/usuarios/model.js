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
    const usersPlants = await db
      .collection("usersPlants")
      .find({})
      .toArray();
    return usersPlants;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getOne(id) {
  try {
    const db = await getDbConnection();
    const userPlant = await db
      .collection("usersPlants")
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
      .collection("usersPlants")
      .findOne({ username });
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function createOne(userData) {
  try {
    const db = await getDbConnection();
    const result = await db
      .collection("usersPlants")
      .insertOne(userData);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function updateOne(id, updatedData) {
  try {
    const db = await getDbConnection();
    const result = await db
      .collection("usersPlants")
      .updateOne({ _id: ObjectId(id) }, { $set: updatedData });
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
      .collection("usersPlants")
      .deleteOne({ _id: ObjectId(id) });
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function buscarUsuario(nombre) {
let db = basedatos.obtenerConexion();
return await db.collection("users").findOne({ usuario: nombre });
}

async function comprobarExistenciaUsuario(nombre) {
let usuario = await buscarUsuario(nombre);
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
