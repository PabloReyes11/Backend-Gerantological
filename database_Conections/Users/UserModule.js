
const connection = require('../../SQL_CONECTION');
const multer = require('multer'); // Middleware para manejar archivos en formularios

//-----------------------------------------------------------obtener el id del personal que esta agregando 
function GetCentroID(req, res, ID_personal) {
  const { ID_PERSONAL } = req.body;
  connection.query('SELECT * FROM personal WHERE PersonalID = ?', [ID_personal], (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).send('Error en el servidor');
    } else {
      const { email, password } = req.body;
      if (results && results.length > 0) {
        const id = results[0].ID_Centro;
        ////console.log("centro: "+ id);
        res.json({ Centro: id });

      } else {
        res.sendStatus(401); // No autorizado
      }
    }
  });
}

//---------------------------------------------------------------------INSERT- USER personal
function InsertNewUserInfoPersonal(req, res, formData) {

  connection.query('INSERT INTO usuarios SET ?', formData, (error, results) => {

    if (error) {
      console.error('Error al realizar el INSERT:', error);
      res.status(500).json({ error: 'Ocurrió un error al agregar el usuario' });
    } else {
      ////console.log('Usuario agregado exitosamente');
      res.status(200).json({ message: 'Usuario agregado exitosamente' });
    }
  });
}


//---------------------------------------------------------------------INSERT- USER contact
function InsertNewUserInfoContact(req, res, formData) {

  connection.query('INSERT INTO direcciones SET ?', formData, (error, results) => {

    if (error) {
      console.error('Error al realizar el INSERT:', error);
      res.status(500).json({ error: 'Ocurrió un error al agregar el usuario' });
    } else {
      ////console.log('Usuario agregado exitosamente');
      res.status(200).json({ message: 'Usuario agregado exitosamente' });
    }
  });
}

function InsertNewUserInfoEmergencia(req, res, formData) {

  connection.query('INSERT INTO contactoemergencia SET ?', formData, (error, results) => {

    if (error) {
      console.error('Error al realizar el INSERT:', error);
      res.status(500).json({ error: 'Ocurrió un error al agregar el usuario' });
    } else {
      ////console.log('Usuario agregado exitosamente');
      res.status(200).json({ message: 'Usuario agregado exitosamente' });
      //agregar el usuario
    }
  });
}


function InsertNewUserPhoto(req, res, formData) {
  connection.query('INSERT INTO fotouser SET ?', formData, (error, results) => {

    if (error) {
      console.error('Error al realizar el INSERT:', error);
      res.status(500).json({ error: 'Ocurrió un error al agregar el usuario' });
    } else {
      ////console.log('Usuario agregado exitosamente');
      res.status(200).json({ message: 'foto agregado exitosamente' });
      //agregar el usuario
    }
  });
}


function obtenerResumenUserNew(req, res) {
  //declaracion de variables
  let ID = "";
  let Nombre = "";
  let AP = "";
  let AM = "";
  let Edad = "";
  let Telefono = "";

  let Calle = "";
  let Colonia = "";
  let CP = "";
  let Delegacion = "";
  let Ciudad = "";
  let Estado = "";

  let Parentesco = "";
  let NombreEmer = "";
  let ApEmer = "";
  let AmEmer = "";
  let EdadEmer = "";
  let TelefonoEmer = "";
  let URL = "";
  const { UserID } = req.body;
  //console.log(UserID);

  connection.query('SELECT * FROM usuarios WHERE UserID = ?', [UserID], (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).send('Error en el servidor');
    } else {
      const { email, password } = req.body;
      if (results && results.length > 0) {

        ID = results[0].UserID;
        Nombre = results[0].Nombre;
        AP = results[0].ApellidoPaterno;
        AM = results[0].ApellidoMaterno;
        Edad = results[0].Edad;
        Telefono = results[0].Telefono;
        ////console.log("centro: "+ id);
        //obtener los siguientes values
        connection.query('SELECT * FROM direcciones WHERE UserID = ?', [UserID], (error, results) => {
          if (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).send('Error en el servidor');
          } else {
            const { email, password } = req.body;
            if (results && results.length > 0) {


              Calle = results[0].Calle;
              Colonia = results[0].Colonia;
              CP = results[0].CodigoPostal;
              Delegacion = results[0].Delegacion;
              Ciudad = results[0].Ciudad;
              Estado = results[0].Estado;
              ////console.log("centro: "+ id);
              //obtener los siguientes values

              connection.query('SELECT * FROM contactoemergencia WHERE UserID = ?', [UserID], (error, results) => {
                if (error) {
                  console.error('Error al ejecutar la consulta:', error);
                  res.status(500).send('Error en el servidor');
                } else {
                  const { email, password } = req.body;
                  if (results && results.length > 0) {


                    ApEmer = results[0].ApellidoPaterno;
                    AmEmer = results[0].ApellidoMaterno;
                    TelefonoEmer = results[0].Telefono;
                    Parentesco = results[0].Parentesco;
                    NombreEmer = results[0].Nombre;

                    ////console.log("centro: "+ id);
                    //obtener los siguientes values

                    connection.query('SELECT * FROM fotouser WHERE UserID = ?', [UserID], (error, results) => {
                      if (error) {
                        console.error('Error al ejecutar la consulta:', error);
                        res.status(500).send('Error en el servidor');
                      } else {
                        const { email, password } = req.body;
                        if (results && results.length > 0) {


                          URL = results[0].FotoURL;


                          //res.sendFile(imagePath);

                          ////console.log("centro: "+ id);
                          //obtener los siguientes values
                          res.json({
                            ID: ID,
                            Nombre: Nombre,
                            Ap: AP,
                            Am: AM,
                            Edad: Edad,
                            Tel: Telefono,
                            Calle: Calle,
                            Colonia: Colonia,
                            CP: CP,
                            Ciudad: Ciudad,
                            Estado: Estado,
                            Del: Delegacion,

                            NombreEmergencia: NombreEmer,
                            ApE: ApEmer,
                            AmE: AmEmer,
                            TelEmer: TelefonoEmer,
                            Parentesco: Parentesco,
                            URL: URL

                          });

                        } else {
                          res.sendStatus(401); // No autorizado
                        }
                      }
                    });


                  } else {
                    res.sendStatus(401); // No autorizado
                  }
                }
              });

            } else {
              res.sendStatus(401); // No autorizado
            }
          }
        });


      } else {
        res.sendStatus(401); // No autorizado
      }
    }
  });

}


//----------------------------------------------------------------------OBTENER TABLA
function getTableUser(req, res) {
  connection.query('SELECT * FROM usuarios', (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).send('Error en el servidor');
    } else {
      res.json(results);
    }
  });
}


function getUserInfoWidget(req, res, ID) {
  let nombre, sexo, familiar, edad, telefono, direccion, foto, fecha;

  //consultar tabla de usuarios
  connection.query('SELECT * FROM usuarios WHERE UserID = ?', [ID], (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).send('Error en el servidor');
    } else {

      if (results && results.length > 0) {
        nombre = results[0].Nombre + " " + results[0].ApellidoPaterno + " " + results[0].ApellidoMaterno;
        sexo = results[0].Sexo;
        edad = results[0].Edad + " años";
        telefono = results[0].Telefono;
        fecha = results[0].Fecha;

        //consultar tabla de direccion
        connection.query('SELECT * FROM direcciones WHERE UserID = ?', [ID], (error, results) => {
          if (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).send('Error en el servidor');
          } else {
            if (results && results.length > 0) {
              direccion = results[0].Calle + ", " + results[0].Colonia + ", " + results[0].CodigoPostal;

              //consultar tabla de direccion
              connection.query('SELECT * FROM contactoemergencia WHERE UserID = ?', [ID], (error, results) => {
                if (error) {
                  console.error('Error al ejecutar la consulta:', error);
                  res.status(500).send('Error en el servidor');
                } else {

                  if (results && results.length > 0) {
                    familiar = results[0].Nombre + " " + results[0].ApellidoPaterno + " " + results[0].ApellidoMaterno;

                    //foto
                    res.json({
                      Nombre: nombre,
                      Direccion: direccion,
                      Sexo: sexo,
                      Familiar: familiar,
                      Edad: edad,
                      Telefono: telefono,
                      Fecha: fecha
                    });

                  } else {
                    res.json({ Valor: "No hay coincidencia" });
                  }
                }
              });

            } else {
              res.json({ Valor: "No hay coincidencia" });
            }
          }
        });

      } else {
        res.json({ Valor: "No hay coincidencia" });
      }
    }
  });
}

//buscar user y eliminarlo
function getUser(req, res, ID) {
  connection.query('SELECT * FROM usuarios WHERE UserID = ?', [ID], (error, results) => {
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


function getUserLUmobile(req, res, ID) {
  connection.query('SELECT * FROM usuarios WHERE UserID = ?', [ID], (error, results) => {
   
    if (error) {
      console.error('Error al buscar al usuario:', error);
      res.status(500).json({ mensaje: 'Error en el servidor' });
      return;
    }

    if (results.length > 0) {
      // El usuario existe, responde con los datos del usuario
      res.status(200).json({ usuario: results[0] });
    } else {
      // El usuario no existe, responde con un código 404 y un mensaje
      res.status(404).json({ mensaje: 'El usuario no existe' });
    }
    
  });

}


function DeleteUserInfo(req, res, ID) {
  connection.query('DELETE FROM usuarios WHERE UserID = ?', [ID], (error, results) => {
    if (error) {
      // Manejar errores de consulta
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ error: 'Error al ejecutar la consulta' });
    } else {
      // Enviar los resultados de la consulta como respuesta
      connection.query('DELETE FROM direcciones WHERE UserID = ?', [ID], (error, results) => {
        if (error) {
          // Manejar errores de consulta
          console.error('Error al ejecutar la consulta:', error);
          res.status(500).json({ error: 'Error al ejecutar la consulta' });
        } else {
          // Enviar los resultados de la consulta como respuesta
          connection.query('DELETE FROM contactoemergencia WHERE UserID = ?', [ID], (error, results) => {
            if (error) {
              // Manejar errores de consulta
              console.error('Error al ejecutar la consulta:', error);
              res.status(500).json({ error: 'Error al ejecutar la consulta' });
            } else {
              // Enviar los resultados de la consulta como respuesta
              connection.query('DELETE FROM fotouser WHERE UserID = ?', [ID], (error, results) => {
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
              //console.log('borrado')
            }
          });
          //console.log('borrado')
        }
      });
      //console.log('borrado')
    }
  });

}






async function getPhotoURL(ID) {
  return new Promise((resolve, reject) => {
    // obtener numero de masculinos
    connection.query('SELECT * FROM fotouser WHERE UserID = ?', [ID], (error, results) => {
      if (error) {
        console.error('Error al ejecutar la consulta:', error);
        reject(error);
      } else {
        const URL = results[0].FotoURL;
        resolve(URL);
      }
    });
  });
}

module.exports = {
  GetCentroID,
  InsertNewUserInfoPersonal,
  InsertNewUserInfoContact,
  InsertNewUserInfoEmergencia,
  InsertNewUserPhoto,
  obtenerResumenUserNew,
  getTableUser,
  getUserInfoWidget,
  getUser,
  DeleteUserInfo,
  getPhotoURL,
  getUserLUmobile
};







