const connection = require('../../SQL_CONECTION');
const { v4: uuidv4 } = require('uuid');

/*
CREATE TABLE Talleres (
  TallerID VARCHAR(100) NOT NULL,
  NumeroTaller INT AUTO_INCREMENT PRIMARY KEY,
  Nombre VARCHAR(100) NOT NULL,
  CentroID VARCHAR(20) NOT NULL,
  Instructor_ID VARCHAR(100) NOT NULL,
  GrupoExterno BOOLEAN NOT NULL,
  Duracion INT NOT NULL,
  Dias VARCHAR(200) NOT NULL,
  Hora VARCHAR(100) NOT NULL,
  Cupo INT NOT NULL
);

{
    "Nombre": "Taller depintura",
    "CentroID": "PRUEBA TALLER",
  "Instructor_ID": "SJND",
  "GrupoExterno": false,
  "Duracion": 120,
  "Dias": "lUNES, MARTES",
  "Hora": "14:30 - 16:20",
  "Cupo": 30
}
*/

// Generate a unique ID
function UID() {
    return uuidv4();
}

// Crear un nuevo taller
function createTaller(req, res, tallerData) {
    tallerData.TallerID = UID();
    const query = 'INSERT INTO Talleres SET ?';
    return new Promise((resolve, reject) => {
        connection.query(query, tallerData, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
                console.log('Taller creado con éxito: ', tallerData.TallerID);
                res.send({"ID": tallerData.TallerID});
            }
        });
    });
}

// Obtener todos los talleres de un centro
function getTalleres(req, res, centroID) {
    const query = 'SELECT * FROM Talleres WHERE CentroID = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, centroID, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
                //res.send json ocn el id
                res.send(results);
            }
        });
    });
}

// Obtener un taller por ID
function getTallerByID(req, res, tallerID) {
    const query = 'SELECT * FROM Talleres WHERE TallerID = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, tallerID, (error, results) => {
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
 createTaller, getTalleres, getTallerByID
};