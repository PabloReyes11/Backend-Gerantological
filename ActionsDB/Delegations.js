const connection = require('../SQL_CONECTION');
const { v4: uuidv4 } = require('uuid');
const CryptoJS = require('crypto-js');



// Obtener información personal de un usuario
function getDelegaciones(req, res) {
    const query = 'SELECT * FROM delegacion';
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
                res.send(results);
            }
        });
    });
}

module.exports = {
   
    getDelegaciones
};