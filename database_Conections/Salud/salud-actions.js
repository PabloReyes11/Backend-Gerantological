const connection = require('../../SQL_CONECTION');

function InsertNewExpedienteSalud(req, res, formData) {
    connection.query('INSERT INTO salud_expedientes SET ?', formData, (error, results) => {
  
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

  function InsertNewConsultaSalud(req, res, formData) {
    connection.query('INSERT INTO salud_consultas SET ?', formData, (error, results) => {
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
    InsertNewExpedienteSalud,
    InsertNewConsultaSalud
  }