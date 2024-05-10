const connection = require('../../SQL_CONECTION');

function getTableTalleres(req, res) {
    connection.query('SELECT * FROM talleres', (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).send('Error en el servidor');
        } else {
            res.json(results);
        }
    });
}

function getIdTalleresUltimo(req, res) {
    connection.query('SELECT NumeroTaller FROM talleres ORDER BY TallerID DESC LIMIT 1', (error, results) => {
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).send('Error en el servidor');
        } else {
            if (results.length > 0) {
                const ultimoNumeroTaller = results[0].NumeroTaller;
                res.json({ NumeroTaller: ultimoNumeroTaller });
            } else {
                // La tabla está vacía, puedes manejar esta situación como desees
                res.json({ NumeroTaller: 0 });
            }
        }
    });

}


function InsertNewTaller(req, res, formData) {
    connection.query('INSERT INTO talleres SET ?', formData, (error, results) => {
        //console.log("entro");
        if (error) {
            console.error('Error al realizar el INSERT:', error);
            res.status(500).json({ error: 'Ocurrió un error al agregar el usuario' });
        } else {
            ////console.log('Usuario agregado exitosamente');
            res.status(200).json({ message: ' agregado exitosamente' });
            //agregar el usuario
        }
    });
}


function VerificarIDTaller(req, res, ID) {


    connection.query('SELECT * FROM talleres WHERE TallerID = ?', [ID], (error, results) => {
        if (error) {
          // Handle database query error
          console.error('Error al ejecutar la consulta:', error);
          return res.sendStatus(500); // Envia solo el código de estado 500
        }
      
        if (results && results.length > 0) {
          // Found matching results, return 200 OK
          return res.sendStatus(200); // Envia solo el código de estado 200
        } else {
          // No matching results found, return 404 Not Found
          //console.log('No encontrado');
          return res.sendStatus(404); // Envia solo el código de estado 404
        }
      });
      

}

function DeleteTaller(req, res, ID) {

    connection.query('DELETE FROM talleres WHERE TallerID = ?', [ID], (error, results) => {
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

function getListTalleres(req, res) {
    connection.query('SELECT TallerID, Nombre, Hora FROM talleres', (error, results) => {
      if (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.status(500).send('Error en el servidor');
      } else {
        //console.log("Enviando: "+ results.length);
        
        res.json(results);
      }
    });
  }

  
  function InsertAssitance(req, res, formData) {
    connection.query('INSERT INTO asistencia SET ?', formData, (error, results) => {
        //console.log("entro");
        if (error) {
            console.error('Error al realizar el INSERT:', error);
            res.status(500).json({ error: 'Ocurrió un error al agregar el usuario' });
        } else {
            ////console.log('Usuario agregado exitosamente');
            res.status(200).json({ message: ' agregado exitosamente' });
            //agregar el usuario
        }
    });
}
module.exports = {
    getTableTalleres,
    getIdTalleresUltimo,
    InsertNewTaller,
    DeleteTaller,
    VerificarIDTaller,
    getListTalleres,
    InsertAssitance
} 