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


module.exports = {
    getInfoResumenEnfermeria
};