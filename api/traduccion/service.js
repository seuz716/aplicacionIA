const tf = require('@tensorflow/tfjs');
const openai = require('openai');

// Inicializar el modelo de ChatGPT con las credenciales de OpenAI
openai.prompt(process.env.OPENAI_MODEL, {
  temperature: 0.5,
  max_tokens: 100,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0
});

// Función para obtener el historial de traducciones
const obtenerHistorial = async () => {
  try {
    // Llamar al método obtenerHistorial del modelo
    const historial = await modelo.obtenerHistorial();
    return historial;
  } catch (error) {
    throw new Error(error.message);
  }
};

async function traducirTexto(textoOriginal) {
  try {
    // Hacer una predicción con el modelo de ChatGPT usando el texto original
    const resultadoTraduccion = await tf.tidy(() => {
      return openai.predict(textoOriginal);
    });
    // Almacenar el historial de traducciones
    await modelo.almacenarHistorial({
      textoOriginal,
      resultadoTraduccion
    });
    return resultadoTraduccion;
  } catch (error) {
    throw new Error(`Error al traducir el texto: ${error.message}`);
  }
}

async function sumarizarTexto(textoOriginal) {
  try {
    // Tokenizar el texto original
    const tokens = tf.tokenize(textoOriginal);
    // Hacer una predicción con el modelo de sumarización
    const resumen = await openai.prompt("text-davinci-002", {
      prompt: tokens.join(" "),
      max_tokens: 50,
      top_p: 1,
      n: 1,
      stop: "",
      temperature: 0.5
    });
    // Devolver el resumen
    return resumen;
  } catch (error) {
    throw new Error(`Error al sumarizar el texto: ${error.message}`);
  }
}

module.exports = {
  traducirTexto,
  obtenerHistorial,
  sumarizarTexto
};
