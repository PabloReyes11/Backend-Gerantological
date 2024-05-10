const connection = require('../../SQL_CONECTION');

//---------------------------------------------------------------------delete- USER
function deleteUser(req, res, ID) {
  connection.query('DELETE FROM personal WHERE PersonalID = ?', [ID], (error, results) => {
    if (error) {
      // Manejar errores de consulta
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ error: 'Error al ejecutar la consulta' });
    } else {
      // Enviar los resultados de la consulta como respuesta
      res.sendStatus(200);
      //console.log('borrado')
    }
  });

}

//---------------------------------------------------------------------buscar user id- USER
function getInfoUser(req, res, ID) {
  connection.query('SELECT * FROM personal WHERE PersonalID = ?', [ID], (error, results) => {
    if (error) {
      // Manejar errores de consulta
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ error: 'Error al ejecutar la consulta' });
    } else {
      // Enviar los resultados de la consulta como respuesta
      res.json(results);
 
    }
  });

}

//---------------------------------------------------------------------INSERT- USER
function insertUser(req, res, formData) {
  connection.query('INSERT INTO personal SET ?', formData, (error, results) => {
    if (error) {
      console.error('Error al realizar el INSERT:', error);
      res.status(500).json({ error: 'Ocurrió un error al agregar el usuario' });
    } else {
      ////console.log('Usuario agregado exitosamente');
      res.status(200).json({ message: 'Usuario agregado exitosamente' });
    }
  });
}
//---------------------------------------------------------------------INCREMENT - USER
function incrementUser(req, res, Data) {
  connection.query('INSERT INTO numerousuarios SET ?', Data, (error, results) => {
    if (error) {
      console.error('Error al realizar el INSERT:', error);
      res.status(500).json({ error: 'Ocurrió un error al agregar el usuario' });
    } else {
      ////console.log('Usuario agregado exitosamente');
      res.status(200).json({ message: 'Usuario incrementado exitosamente' });
    }
  });
}
//----------------------------------------------------------------------OBTENER lista centros
function getListCentros(req, res) {
  connection.query('SELECT ID_Centro, Nombre FROM centros', (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).send('Error en el servidor');
    } else {
      res.json(results);
    }
  });
}
//----------------------------------------------------------------------OBTENER Numero de usuarios
function getNumeroDeUsuarios(req, res) {

  connection.query('SELECT Indice FROM numerousuarios ORDER BY Indice DESC LIMIT 1', (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).send('Error en el servidor');
    } else {
      res.json(results[0]);
    }
  });
}

//----------------------------------------------------------------------OBTENER TABLA
function getTable(req, res) {
  connection.query('SELECT PersonalID, Rol, ID_Centro, Email, Acceso FROM personal', (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).send('Error en el servidor');
    } else {
      res.json(results);
    }
  });
}


module.exports = {
  getTable,
  insertUser,
  getListCentros,
  getNumeroDeUsuarios,
  incrementUser,
  getInfoUser,
  deleteUser
};
