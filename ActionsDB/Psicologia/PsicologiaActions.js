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
                //console.log("Consulta creada exitosamente");
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

function getConsultaByUserID(req, res, userID) {
    const query = `
        SELECT 
            PC.Expediente_ID,
            PC.NumeroExpediente,
            PC.Fecha,
            D.Nombre AS NombreDelegacion,
            C.Nombre AS NombreCentro,
            PC.Nombre AS NombrePaciente,
            PC.ApellidoP AS ApellidoPPaciente,
            PC.ApellidoM AS ApellidoMPaciente,
            PC.Edad,
            PC.Telefono,
            PC.Motivo,
            PC.UserID,
            U.Email AS Personal
        FROM 
            Piscologia_consultas PC
        INNER JOIN 
            centros C ON PC.ID_Centro = C.ID_Centro
        INNER JOIN 
            delegacion D ON PC.ID_Delegacion = D.ID_Delegacion
        INNER JOIN 
            Users U ON PC.UserID = U.UserID
        WHERE 
            PC.UserID = ?`;
            
    return new Promise((resolve, reject) => {
        connection.query(query, userID, (error, results) => {
            if (error) {
                reject(error);
            } else {
                //console.log("Consultas obtenidas exitosamente");
                resolve(results);
                res.send(results);
            }
        });
    });
}
function getConsultaByCentroID(req, res, centro) {
    const query = `
        SELECT 
            PC.Expediente_ID,
            PC.NumeroExpediente,
            PC.Fecha,
            D.Nombre AS NombreDelegacion,
            C.Nombre AS NombreCentro,
            PC.Nombre AS NombrePaciente,
            PC.ApellidoP AS ApellidoPPaciente,
            PC.ApellidoM AS ApellidoMPaciente,
            U.Email AS Personal,
            PC.Edad,
            PC.Telefono,
            PC.Motivo,
            PC.UserID
        FROM 
            Piscologia_consultas PC
        INNER JOIN 
            centros C ON PC.ID_Centro = C.ID_Centro
        INNER JOIN 
            delegacion D ON PC.ID_Delegacion = D.ID_Delegacion
        INNER JOIN 
            Users U ON PC.UserID = U.UserID
        WHERE 
            PC.ID_Centro = ?`;
            
    return new Promise((resolve, reject) => {
        connection.query(query, centro, (error, results) => {
            if (error) {
                reject(error);
            } else {
                //console.log("Consultas obtenidas exitosamente");
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
                //console.log("Consulta eliminada exitosamente");
                res.send(results);
            }
        });
    });
}


//estadistica
// Obtener el número de consultas por día para un centro específico
function getConsultasPorDia(req, res, idCentro) {
   
    
    // Consulta SQL para contar el número de consultas por día para un centro específico
    const query = `
        SELECT Fecha, COUNT(*) AS NumConsultas
        FROM Piscologia_consultas
        WHERE ID_Centro = ?
        GROUP BY Fecha;
    `;
    
    return new Promise((resolve, reject) => {
        connection.query(query, [idCentro], (error, results) => {
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
    createConsulta,
    getConsultaByID,
    updateConsulta,
    deleteConsulta,
    getAllConsultas,
    getConsultaByUserID,
    getConsultaByCentroID,

    getConsultasPorDia
};