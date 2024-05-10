const connection = require('../../SQL_CONECTION');
const { v4: uuidv4 } = require('uuid');

/*
CREATE TABLE Enfermeria_consultas (
  Expediente_ID VARCHAR(100) NOT NULL,
  NumeroExpediente INT AUTO_INCREMENT PRIMARY KEY,
  Fecha DATE NOT NULL,
  ID_Delegacion VARCHAR(100) NOT NULL,
  ID_Centro VARCHAR(20) NOT NULL,
  Nombre VARCHAR(100) NOT NULL,
  ApellidoP VARCHAR(100) NOT NULL,
  ApellidoM VARCHAR(100) NOT NULL,
  Edad INT NOT NULL,
  PresionArterial VARCHAR(100) NOT NULL,
  Temperatura DECIMAL(5, 2) NOT NULL,
  RitmoCardiaco DECIMAL(5, 2) NOT NULL,
  UserID VARCHAR(100) NOT NULL
);

*/

// Generate a unique ID
function UID() {
    return uuidv4();
}

// Crear una nueva consulta de enfermería
function createEnfermeriaConsulta(req, res, consultaData) {
    consultaData.Expediente_ID = UID();
    const query = 'INSERT INTO Enfermeria_consultas SET ?';
    return new Promise((resolve, reject) => {
        connection.query(query, consultaData, (error, results) => {
            if (error) {
                reject(error);
            } else {
                //console.log("Consulta de enfermería creada exitosamente");
                resolve(results);
                res.send(results);
            }
        });
    });
}

// Obtener una consulta de enfermería por su ID
function getEnfermeriaConsultaByID(req, res, consultaID) {
    const query = 'SELECT * FROM Enfermeria_consultas WHERE NumeroExpediente = ?';
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

// Obtener todas las consultas de enfermería
function getAllEnfermeriaConsultas(req, res, UserID) {
    const query = 'SELECT * FROM Enfermeria_consultas WHERE UserID = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, UserID, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
                res.send(results);
            }
        });
    });
}

function getConsultaEnfermeriaByUserID(req, res, userID) {
    const query = `
        SELECT 
            PC.Expediente_ID,
            PC.NumeroExpediente,
            PC.Fecha,
            C.Nombre AS ID_Centro,
            PC.Nombre,
            PC.ApellidoP,
            PC.ApellidoM,
            PC.Edad,
            PC.PresionArterial,
            PC.Temperatura,
            PC.RitmoCardiaco,
            PC.UserID,
            U.Email AS Personal
        FROM 
            Enfermeria_consultas PC
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
function getConsultaEnfermeriaByCenterID(req, res, userID) {
    const query = `
        SELECT 
            PC.Expediente_ID,
            PC.NumeroExpediente,
            PC.Fecha,
            C.Nombre AS ID_Centro,
            PC.Nombre,
            PC.ApellidoP,
            PC.ApellidoM,
            PC.Edad,
            PC.PresionArterial,
            PC.Temperatura,
            PC.RitmoCardiaco,
            PC.UserID,
            U.Email AS Personal
        FROM 
            Enfermeria_consultas PC
        INNER JOIN 
            centros C ON PC.ID_Centro = C.ID_Centro
        INNER JOIN 
            delegacion D ON PC.ID_Delegacion = D.ID_Delegacion
        INNER JOIN 
            Users U ON PC.UserID = U.UserID
        WHERE 
            PC.ID_Centro = ?`;
            
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
// Actualizar una consulta de enfermería
function updateEnfermeriaConsulta(req, res, consultaID, consultaData) {
    const query = 'UPDATE Enfermeria_consultas SET ? WHERE NumeroExpediente = ?';
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

// Eliminar una consulta de enfermería
function deleteEnfermeriaConsulta(req, res, consultaID) {
    const query = 'DELETE FROM Enfermeria_consultas WHERE NumeroExpediente = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, consultaID, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
                //console.log("Consulta de enfermería eliminada exitosamente");
                res.send(results);
            }
        });
    });
}

function getInfoResumenEnfermeria(req, res, userID) {
    const query = `
        SELECT 
            CONCAT(IP.Nombre, ' ', IP.ApellidoP, ' ', IP.ApellidoM) AS NombreCompleto,
            C.Nombre AS NombreCentro,
            COUNT(EC.Expediente_ID) AS TotalConsultas,
            MONTHNAME(EC.Fecha) AS MesMasActivo,
            CONCAT(EC.Nombre, ' ', EC.ApellidoP, ' ', EC.ApellidoM) AS UltimoPacienteAtendido
        FROM 
            Users U
        INNER JOIN 
            InformationPersonal IP ON U.UserID = IP.UserID
        LEFT JOIN 
            Enfermeria_consultas EC ON U.UserID = EC.UserID
        LEFT JOIN 
            centros C ON U.ID_Centro = C.ID_Centro
        WHERE 
            U.UserID = ?
        GROUP BY 
            C.Nombre
        ORDER BY 
            EC.Fecha DESC
        LIMIT 1`;
        
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

function getPacientesPorDia(req, res, idCentro) {
   
    
    // Consulta SQL para contar el número de consultas por día para un centro específico
    const query = `
        SELECT Fecha, COUNT(*) AS NumConsultas
        FROM Enfermeria_consultas
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
    createEnfermeriaConsulta,
    getEnfermeriaConsultaByID,
    getAllEnfermeriaConsultas,
    updateEnfermeriaConsulta,
    deleteEnfermeriaConsulta,
    getInfoResumenEnfermeria,
    getConsultaEnfermeriaByUserID,
    getConsultaEnfermeriaByCenterID,

    getPacientesPorDia
};