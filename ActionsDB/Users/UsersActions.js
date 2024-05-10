const connection = require('../../SQL_CONECTION');
const { v4: uuidv4 } = require('uuid');
const CryptoJS = require('crypto-js');


// Generate a unique ID
function UID() {
    // Implementation of unique ID generation logic
    // You can use a library like uuid or generate your own unique ID logic
    // Here's an example using uuid library
    return uuidv4();
}


// Insertar un nuevo usuario
function insertUser(req, res, Data) {
    Data.UserID = UID(); // Generar un ID único para el usuario
    const PassHashed = CryptoJS.SHA256(Data.Password).toString();
    const query = 'INSERT INTO Users (UserID, Email, Password, Rol, ID_Centro) VALUES (?, ?, ?, ?, ?)';
    const values = [Data.UserID, Data.Email, PassHashed, Data.Rol, Data.ID_Centro];

    // Ejecutar la consulta SQL
    connection.query(query, values, (error, results) => {
        if (error) {
            // Si hay un error en la consulta, enviar una respuesta de error
            console.error('Error al insertar usuario:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        } else {
            // Si la consulta se ejecuta correctamente, enviar una respuesta exitosa
            //console.log('Usuario insertado correctamente:', Data.UserID);
            //MOSTRAR HASH DE PASSWORD
            //console.log('Password hashed:', PassHashed);
            res.status(200).json({ UserID: Data.UserID });
        }
    });
}

// Update an existing user
function updateUser(req, res, user) {
    const query = 'UPDATE Users SET Email = ?, Password = ?, Rol = ?, ID_Centro = ? WHERE UserID = ?';
    const values = [user.Email, user.Password, user.Rol, user.ID_Centro, user.UserID];

    return new Promise((resolve, reject) => {
        connection.query(query, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
                res.send({Message: 'User updated'});
            }
        });
    });
}

// Delete a user
function deleteUser(req, res, userID) {
    const query = 'DELETE FROM Users WHERE UserID = ?';

    return new Promise((resolve, reject) => {
        connection.query(query, userID, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
                res.send({Message: 'User deleted'});
            }
        });
    });
}

// Get all users with their personal information and center name
function getAllUsers(req, res, ID_Centro) {
    const query = 'SELECT Users.*, InformationPersonal.Nombre, InformationPersonal.ApellidoP, InformationPersonal.ApellidoM, centros.Nombre AS NombreCentro FROM Users INNER JOIN InformationPersonal ON Users.UserID = InformationPersonal.UserID INNER JOIN centros ON Users.ID_Centro = centros.ID_Centro WHERE Users.ID_Centro = ?';
    const values = [ID_Centro];

    return new Promise((resolve, reject) => {
        connection.query(query, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
                res.send(results);
            }
        });
    });
}

//////////////////////////////////////////- InformationPersonal
// Insertar información personal de un usuario
function insertInformationPersonal(req, res, Data) {
    const query = 'INSERT INTO InformationPersonal (UserID, Nombre, ApellidoP, ApellidoM) VALUES (?, ?, ?, ?)';
    const values = [Data.UserID, Data.Nombre, Data.ApellidoP, Data.ApellidoM];
    return new Promise((resolve, reject) => {
        connection.query(query, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                //console.log('Information personal inserted');
                resolve(results);
                
                res.send({Message: 'Information personal inserted'});
            }
        });
    });
}

// Actualizar información personal de un usuario
function updateInformationPersonal(req, res, Data) {
    const query = 'UPDATE InformationPersonal SET Nombre = ?, ApellidoP = ?, ApellidoM = ? WHERE UserID = ?';
    const values = [Data.Nombre, Data.ApellidoP, Data.ApellidoM, Data.UserID];
    return new Promise((resolve, reject) => {
        connection.query(query, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
                res.send({Message: 'Information personal updated'});
            }
        });
    });
}

// Eliminar información personal de un usuario
function deleteInformationPersonal(req, res, userID) {
    const query = 'DELETE FROM InformationPersonal WHERE UserID = ?';
    return new Promise((resolve, reject) => {
        connection.query(query, userID, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
                res.send({Message: 'Information personal deleted'});
            }
        });
    });
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

// Obtener información de estadistica psicologia
// Obtener información de estadística
// Obtener información de estadística
function getInfoResumenPsicologia(req, res, userID) {
    const query = `
        SELECT 
            CONCAT(IP.Nombre, ' ', IP.ApellidoP, ' ', IP.ApellidoM) AS NombreCompleto,
            C.Nombre AS NombreCentro,
            COUNT(PC.Expediente_ID) AS TotalConsultas,
            MONTHNAME(PC.Fecha) AS MesMasActivo,
            CONCAT(PC.Nombre, ' ', PC.ApellidoP, ' ', PC.ApellidoM) AS UltimoPacienteAtendido
        FROM 
            Users U
        INNER JOIN 
            InformationPersonal IP ON U.UserID = IP.UserID
        LEFT JOIN 
            Piscologia_consultas PC ON U.UserID = PC.UserID
        LEFT JOIN 
            centros C ON U.ID_Centro = C.ID_Centro
        WHERE 
            U.UserID = ?
        GROUP BY 
            C.Nombre
        ORDER BY 
            PC.Fecha DESC
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

//funcion que me retorne select * from usuarios where id_centro = id_centro y rol = rol
function getUsersByRol(req, res, ID_Centro, Rol) {
    const query = 'SELECT * FROM Users WHERE ID_Centro = ? AND Rol = ?';
    const values = [ID_Centro, Rol];

    return new Promise((resolve, reject) => {
        connection.query(query, values, (error, results) => {
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
    insertUser,
    updateUser,
    deleteUser,
    getAllUsers,
    insertInformationPersonal,
    updateInformationPersonal,
    deleteInformationPersonal,
    getInformationPersonal,
    getInfoResumenPsicologia,
    getUsersByRol

};