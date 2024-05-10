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

// Obtener todos los talleres de un centro con el nombre del instructor y del centro
function getTalleres(req, res, centroID) {
    const query = `
        SELECT 
            Talleres.*,
            Users.Email AS NombreInstructor,
            centros.Nombre AS NombreCentro,
            InformationPersonal.Nombre AS NombreInstructor,
            InformationPersonal.ApellidoP AS AP_Instructor,
            InformationPersonal.ApellidoM AS AM_Instructor
        FROM 
            Talleres
        JOIN 
            Users ON Talleres.Instructor_ID = Users.UserID
        JOIN 
            centros ON Talleres.CentroID = centros.ID_Centro
        JOIN 
            InformationPersonal ON Users.UserID = InformationPersonal.UserID
        WHERE 
            Talleres.CentroID = ?;
    `;
    return new Promise((resolve, reject) => {
        connection.query(query, centroID, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
                // También puedes enviar la respuesta JSON aquí si lo deseas
                res.json(results);
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

/*CREATE TABLE Users (
  UserID varchar(100) NOT NULL,
  Email varchar(50) NOT NULL,
  Password varchar(100) NOT NULL,
  Rol varchar(50) NOT NULL,
  ID_Centro varchar(20) NOT NULL,
  PRIMARY KEY (UserID) -- Definir UserID como clave primaria
);
*/
//funcion que obtenga los usuarios que su Rol sea Instructor y el ID_Centro sea el que le pase de parametro
function getInstructors(req, res, centroID) {
    const query = 'SELECT * FROM Users WHERE Rol = "Instructor" AND ID_Centro = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, centroID, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
                res.send(results);
            }
        });
    });
}

//funcion para eliminar taller
function deleteTaller(req, res, tallerID){
    const query = 'DELETE FROM Talleres WHERE TallerID = ?';
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

/*
Registrar asistencias, crear funcion
CREATE TABLE Asistencia (
  AsistenciaID VARCHAR(100) NOT NULL PRIMARY KEY,
  TallerID VARCHAR(100) NOT NULL,
  Fecha DATE NOT NULL,
  Asistentes INT NOT NULL,
  UserID VARCHAR(100) NOT NULL
);
*/

function getAsistenciasInstructor(req, res, instructorID) {
    const query = `
        SELECT t.Nombre AS NombreTaller, a.Asistentes, a.Fecha, a.AsistenciaID
        FROM Talleres t
        JOIN Asistencia a ON t.TallerID = a.TallerID
        WHERE a.UserID = ?`;
        
    return new Promise((resolve, reject) => {
        connection.query(query, instructorID, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
                //res.send json con el resultado
                res.send(results);
            }
        });
    });
}
//function para eliminar asistencia por id
function deleteAsistencia(req, res, asistenciaID){
    const query = 'DELETE FROM Asistencia WHERE AsistenciaID = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, asistenciaID, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
                res.send(results);
            }
        });
    });
}

//obtener talleres que tiene un usuario
function getTalleresUsuario(req, res, userID){
    const query = 'SELECT * FROM Talleres WHERE Instructor_ID = ?';
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
//crear funcion para registrar asistencias
function registrarAsistencia(req, res, asistenciaData) {
    asistenciaData.AsistenciaID = UID();
    const query = 'INSERT INTO Asistencia SET ?';
    return new Promise((resolve, reject) => {
        connection.query(query, asistenciaData, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
                console.log('Asistencia registrada con éxito: ', asistenciaData.TallerID);
                res.send({"ID": asistenciaData.TallerID});
            }
        });
    });
}

function getResumenInstructor(req, res, userID) {
    const query = `
        SELECT 
            COUNT(DISTINCT t.TallerID) AS NumeroTalleres,
            ROUND(AVG(a.Asistentes)) AS PromedioAsistentes,
            (SELECT Nombre FROM Talleres WHERE TallerID = TallerMasAsistido.TallerID) AS TallerMasAsistido,
            CONCAT(ip.Nombre, ' ', ip.ApellidoP, ' ', ip.ApellidoM) AS NombreCompleto,
            c.Nombre AS NombreCentro
        FROM 
            Talleres t
        JOIN 
            Asistencia a ON t.TallerID = a.TallerID
        JOIN 
            Users u ON a.UserID = u.UserID
        JOIN 
            InformationPersonal ip ON u.UserID = ip.UserID
        JOIN 
            centros c ON u.ID_Centro = c.ID_Centro
        JOIN 
            (SELECT TallerID FROM Asistencia GROUP BY TallerID ORDER BY COUNT(*) DESC LIMIT 1) AS TallerMasAsistido 
        WHERE 
            u.UserID = ?
        GROUP BY 
            u.UserID`;
        
    return new Promise((resolve, reject) => {
        connection.query(query, userID, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results[0]);
                //res.send json con el resultado
                res.send(results[0]);
            }
        });
    });
}

//modificar el instructor asignado a un taller
function modificarInstructor(req, res, instructorID, tallerID){
    const query = 'UPDATE Talleres SET Instructor_ID = ? WHERE TallerID = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, [instructorID, tallerID], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
                res.send(results);
            }
        });
    });
}

// Obtener talleres registrados, sus días de impartición y la suma de asistentes
function getTalleresYAsistentes(req, res) {
    // Consulta SQL para obtener talleres, sus días de impartición y la suma de asistentes
    const query = `
        SELECT 
            T.TallerID,
            T.Nombre,
            T.Dias,
            SUM(A.Asistentes) AS TotalAsistentes
        FROM 
            Talleres T
        LEFT JOIN 
            Asistencia A ON T.TallerID = A.TallerID
        GROUP BY 
            T.TallerID, T.Nombre, T.Dias;
    `;
    
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
 createTaller, getTalleres, getTallerByID,getInstructors,deleteTaller,
 registrarAsistencia,getTalleresUsuario,
 getAsistenciasInstructor,deleteAsistencia,
 getResumenInstructor, modificarInstructor,

 getTalleresYAsistentes
};