const express = require('express');
const conexion = require('./database/connection');
const controladorUsuarios = require('./api/usuarios/controller')
const bodyparser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(morgan('common'));
app.use(cors());
app.use(helmet());
app.use(compression());

app.use("/api/usuarios", controladorUsuarios);

conexion.conectar()
  .then(() => {
    app.listen(port, () => {
      console.log(`API ejecutándose en el puerto: ${port}`);
    });
  })
  .catch(error => {
    console.error(error);
  });
