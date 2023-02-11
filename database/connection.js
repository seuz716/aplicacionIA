const mongoClient = require("mongodb").MongoClient;
require("dotenv").config();

let conexion;

const conectar = function () {
  return new Promise(function (resolve, reject) {
    if (conexion) {
      resolve();
    } else {
      try {
        mongoClient.connect("mongodb+srv://cesar:cesar@cluster0.wtlfm.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true })
        .then(function (client) {
          // Asignar la conexión a la base de datos a la variable conexion
          conexion = client.db("cesar");
          console.log("Conexión a la base de datos realizada con éxito");
          resolve();
        })
        .catch(function (error) {
          reject(error);
        });
      } catch (error) {
        console.error("Ocurrió un error al conectarse a la base de datos:", error);
        reject(error);
      }
    }
  });
};

const obtenerConexion = function () {
    return conexion;
};

module.exports = { conectar, obtenerConexion };
