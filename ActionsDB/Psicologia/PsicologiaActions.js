const connection = require('../../SQL_CONECTION');
const { v4: uuidv4 } = require('uuid');

/*
CREATE TABLE Piscologia_consultas (
  Expediente_ID VARCHAR(100) NOT NULL,
  NumeroExpediente INT AUTO_INCREMENT PRIMARY KEY,
  Fecha DATE NOT NULL,
  ID_Delegacion VARCHAR(100) NOT NULL,
  ID_Centro VARCHAR(20) NOT NULL,
  Nombre VARCHAR(100) NOT NULL,
  ApellidoP VARCHAR(100) NOT NULL,
  ApellidoM VARCHAR(100) NOT NULL,
  Edad INT NOT NULL,
  Telefono VARCHAR(10) NOT NULL, -- Cambiado a VARCHAR para permitir ceros a la izquierda
  Motivo TEXT NOT NULL,
  UserID VARCHAR(100) NOT NULL
);



{
  "Expediente_ID": "",
  "Fecha": "2021-10-10",
  "ID_Delegacion": "123456",
  "ID_Centro": "123456",
  "Nombre": "Juan",
  "ApellidoP": "Perez",
  "ApellidoM": "Gomez",
  "Edad": 25,
  "Telefono": "1234567890",
  "Motivo": "Problemas de ansiedad",
  "UserID": "123456"
}
*/

// Generate a unique ID
function UID() {
    return uuidv4();
}

// Obtener información personal de un usuario
function getInformationPersonal(req, res, userID) {
    const query = 'SELECT * FROM InformationPersonal WHERE UserID = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, userID, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
                res.send(results);
            }
        });
    });
}
// Crear una nueva consulta
function createConsulta(req, res, consultaData) {
    consultaData.Expediente_ID = UID();
    const query = 'INSERT INTO Piscologia_consultas SET ?';
    return new Promise((resolve, reject) => {
        connection.query(query, consultaData, (error, results) => {
            if (error) {
                reject(error);
            } else {
                console.log("Consulta creada exitosamente");
                resolve(results);
                res.send(results);
                
            }
        });
    });
}

// Obtener una consulta por su ID
function getConsultaByID(req, res, consultaID) {
    const query = 'SELECT * FROM Piscologia_consultas WHERE NumeroExpediente = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, consultaID, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
                res.send(results);
            }
        });
    });
}

//obtener consulta por UserID
function getConsultaByUserID(req, res, userID) {
    const query = 'SELECT * FROM Piscologia_consultas WHERE UserID = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, userID, (error, results) => {
            if (error) {
                reject(error);
            } else {
                console.log("Consultas obtenida exitosamente")
                resolve(results);
                res.send(results);
            }
        });
    });
}

// Obtener todas las consultas
function getAllConsultas(req, res) {
    const query = 'SELECT * FROM Piscologia_consultas ';
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



// Actualizar una consulta
function updateConsulta(req, res, consultaID, consultaData) {
    const query = 'UPDATE Piscologia_consultas SET ? WHERE NumeroExpediente = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, [consultaData, consultaID], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
                res.send(results);
            }
        });
    });
}

// Eliminar una consulta
function deleteConsulta(req, res, consultaID) {
    const query = 'DELETE FROM Piscologia_consultas WHERE NumeroExpediente = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, consultaID, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
                console.log("Consulta eliminada exitosamente");
                res.send(results);
            }
        });
    });
}

module.exports = {
    createConsulta,
    getConsultaByID,
    updateConsulta,
    deleteConsulta,
    getAllConsultas,
    getConsultaByUserID
};