
const connection = require('../SQL_CONECTION');

function obtenerTest(req, res, dato) {
    

    connection.query('SELECT * FROM personal WHERE ID_Centro = ?', [dato], (error, results) => {
        if (error) {
          console.error('Error al ejecutar la consulta:', error);
          res.status(500).send('Error en el servidor');
        } else {
        
          if (results && results.length > 0) {
            const email = results[0].Email;
            const rol = results[0].Rol;
            ////console.log("centro: "+ id);
            res.json({ 
                Valor: results.length,
                Rol: rol
            });
    
          } else {
              res.json({ Valor: "No hay coincidencia" });
          }
        }
      });
  }

  module.exports = {
    obtenerTest
  };