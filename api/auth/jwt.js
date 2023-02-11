const jwt = require('jsonwebtoken');
require('dotenv').config();

/* Los datos requeridos son Id, roles, nombre */

function generarToken(datos) {
    const payload = {
        id: datos._id,
        usuario: datos.usuario,
        roles: datos.roles
    };

    const token = jwt.sign(payload, process.env.JWT_CLAVE, {
        expiresIn: process.env.JWT_EXPIRES
    }); 
    
    return token;
}

module.exports = { generarToken };

