const mongoose = require('mongoose');

// Conectarse a la base de datos
mongoose.connect('mongodb://localhost/nombre_de_tu_base_de_datos', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Crear un esquema para los datos
const historialSchema = new mongoose.Schema({
  textoOriginal: { type: String, required: true },
  textoTraducido: { type: String, required: true },
  fecha: { type: Date, default: Date.now }
});

// Crear un modelo a partir del esquema
const Historial = mongoose.model('Historial', historialSchema);

// Función para obtener el historial de traducciones
const obtenerHistorial = async () => {
  try {
    // Buscar todos los registros en la colección Historial
    const historial = await Historial.find({});
    return historial;
  } catch (error) {
    throw new Error(`Error al obtener el historial: ${error.message}`);
  }
};

// Función para agregar una traducción al historial
const agregarHistorial = async (textoOriginal, textoTraducido) => {
  try {
    // Crear un nuevo registro en la colección Historial
    const nuevaTraduccion = new Historial({
      textoOriginal,
      textoTraducido
    });
    await nuevaTraduccion.save();
  } catch (error) {
    throw new Error(`Error al agregar el historial: ${error.message}`);
  }
};

module.exports = {
  obtenerHistorial,
  agregarHistorial
};
