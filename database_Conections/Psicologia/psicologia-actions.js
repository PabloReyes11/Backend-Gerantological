const connection = require('../../SQL_CONECTION');

function InsertNewConsultPsicologia(req, res, formData) {
    connection.query('INSERT INTO psicologia SET ?', formData, (error, results) => {
  
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
    InsertNewConsultPsicologia
  }