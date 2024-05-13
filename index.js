const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
var bodyParser = require('body-parser');
const multer = require('multer'); // Middleware para manejar archivos en formularios



app.use(cors({
  origin: '*', // Origen permitido (URL de tu aplicación de React) http://20.102.109.114:3001/
  credentials: true, // Habilita el envío de cookies de origen a través de CORS
}));



const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');
// other app.use() options ...
app.use(expressCspHeader({ 
    policies: { 
        'default-src': [expressCspHeader.NONE], 
        'img-src': [expressCspHeader.SELF], 
        'script-src': [expressCspHeader.SELF],
        'style-src': [expressCspHeader.SELF],
        'object-src': [expressCspHeader.NONE],
        'frame-src': [expressCspHeader.NONE],
        'base-uri': [expressCspHeader.NONE],
        'form-action': [expressCspHeader.NONE],
        'frame-ancestors': [expressCspHeader.NONE],
        'manifest-src': [expressCspHeader.NONE],
        'media-src': [expressCspHeader.NONE],
        'worker-src': [expressCspHeader.NONE]
    } 
}));  

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));


const destinoFoto = "uploads";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './' + destinoFoto); // Carpeta donde se guardarán las imágenes, asegúrate de crearla
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname); // Nombre de archivo único
  }
});

const upload = multer({ storage });
const path = require('path');


//LOGIN 
const { Autentication } = require('./ActionsDB/login');

//Users
const { 
  insertUser, updateUser, deleteUser, 
  getAllUsers, insertInformationPersonal,
    updateInformationPersonal,
    deleteInformationPersonal,
    getInformationPersonal, 
    getInfoResumenPsicologia } = require('./ActionsDB/Users/UsersActions');

const {getDelegaciones} = require('./ActionsDB/Delegations');

const { createConsulta,
  getConsultaByID,
  updateConsulta,
  deleteConsulta, getAllConsultas,getConsultaByUserID, getConsultaByCentroID,
  getConsultasPorDia } = require('./ActionsDB/Psicologia/PsicologiaActions');

const {createEnfermeriaConsulta,
  getConsultaEnfermeriaByUserID,
  updateEnfermeriaConsulta,
  deleteEnfermeriaConsulta, getAllEnfermeriaConsultas,
  getInfoResumenEnfermeria, getConsultaEnfermeriaByCenterID,
  getPacientesPorDia} = require('./ActionsDB/Enfermeria/Enfermeria');

  const {createTaller, getTalleres, getTallerByID, getInstructors, deleteTaller,
    registrarAsistencia,getTalleresUsuario,
    getAsistenciasInstructor, deleteAsistencia,
    getResumenInstructor, modificarInstructor, 
    getTalleresYAsistentes} = require('./ActionsDB/Talleres/Talleres');


//------------------------------------------------------------- Ruta de inicio
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'PageTest', 'index.html'));
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////----------------> END POINT´S SUPER USUARIOS
//------------------------------------------------------------- Ruta de inicio de sesión de super usuarios
app.post('/AppConnection/Login', async (req, res) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin');
  res.header('Access-Control-Allow-Origin', '*');
  const Data = req.body;
  console.log('data: ' + Data.Email);
  
  //Método para autenticar el super usuario
  Autentication(req, res, Data);
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////----------------> END POINT´S USUARIOS
//------------------------------------------------------------- Insert de Usuarios
// Ruta POST para insertar usuarios
app.post('/AppConnection/Users', async (req, res) => {
  const Data = req.body;
  try {
      await insertUser(req, res, Data); // Llamar a la función insertUser
  } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
});
//------------------------------------------------------------- GetAll de Usuarios
app.post('/AppConnection/Users/Table', async (req, res) => {
  const Data = req.body;
  getAllUsers(req, res, Data.ID_Centro);
});
//------------------------------------------------------------- Delete de Usuarios
app.delete('/AppConnection/Users/:id', async (req, res) => {
  const id = req.params.id;
  deleteUser(req, res, id);
});
//------------------------------------------------------------- Update de Usuarios
app.put('/AppConnection/Users/:id', async (req, res) => {
 const id = req.params.id;
  updateUser(req, res, id);
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////----------------> END POINT´S  USUARIOS info personal
//crear endpoint para insertar info personal
app.post('/AppConnection/Users/InformationPersonal', async (req, res) => {
  const Data = req.body;
  try {
      await insertInformationPersonal(req, res, Data); // Llamar a la función insertUser
  } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
});
//crear endpoint para obtener info personal
app.get('/AppConnection/Users/InformationPersonal/:id', async (req, res) => {
  const id = req.params.id;
  getInformationPersonal(req, res, id);
});
//crear endpoint para actualizar info personal
app.put('/AppConnection/Users/InformationPersonal/:id', async (req, res) => {
  const id = req.params.id;
  updateInformationPersonal(req, res, id);
});
//crear endpoint para borrar info personal
app.delete('/AppConnection/Users/InformationPersonal/:id', async (req, res) => {
  const id = req.params.id;
  deleteInformationPersonal(req, res, id);
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////----------------> END POINT´S DELEGACIONES
//crear endpoint para obtener delegaciones
app.get('/AppConnection/Delegaciones', async (req, res) => {
  getDelegaciones(req, res);
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////----------------> END POINT´S PSICOLOGÍA
//enpoint de insertar
app.post('/AppConnection/Psicologia/Consulta', async (req, res) => {
  const Data = req.body;
  //console.log( Data);
  try {
      await createConsulta(req, res, Data); // Llamar a la función insertUser
  } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//enpoint para obtener todas las consultas por usuario
app.get('/AppConnection/Psicologia/Consulta/:id', async (req, res) => {
  const id = req.params.id;
  getConsultaByUserID(req, res, id);
});
//obtener todo por centro
app.get('/AppConnection/Psicologia/Consulta/Centro/:id', async (req, res) => {
  const CentroID = req.params.id;
  getConsultaByCentroID(req, res, CentroID);
});
//enpoint de obtener todas las consultas
app.get('/AppConnection/Psicologia/Consulta', async (req, res) => {
  getAllConsultas(req, res);
});

//endpoint para eliminar una consulta
app.delete('/AppConnection/Psicologia/Consulta/:id', async (req, res) => {
  const id = req.params.id;
  deleteConsulta(req, res, id);
});

//enpoint de obtener todas las consultas
app.get('/AppConnection/Psicologia/Resmen/:id', async (req, res) => {
  //console.log('id: ' + req.params.id);
  const id = req.params.id;
  getInfoResumenPsicologia(req, res, id);
});


/*///////////////////////////////////////////////////////////////////////////////////////////////////////////////////----------------> END POINT´S ENFERMERÍA*/
//create consulta
app.post('/AppConnection/Enfermeria/Consulta', async (req, res) => {
  const Data = req.body;
  try {
      await createEnfermeriaConsulta(req, res, Data); // Llamar a la función insertUser
  } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//get para obtener consulta por userid
app.get('/AppConnection/Enfermeria/Consulta/:id', async (req, res) => {
  const id = req.params.id;
  getConsultaEnfermeriaByUserID(req, res, id);
});

//get para obtener consulta por userid
app.get('/AppConnection/Enfermeria/Consulta/Centro/:id', async (req, res) => {
  const id = req.params.id;
  getConsultaEnfermeriaByCenterID(req, res, id);
});

//delete para eliminar consulta
app.delete('/AppConnection/Enfermeria/Consulta/:id', async (req, res) => {
  const id = req.params.id;
  deleteEnfermeriaConsulta(req, res, id);
});



//resumen de enfermeria
app.get('/AppConnection/Enfermeria/Resumen/:id', async (req, res) => {
  const id = req.params.id;
  getInfoResumenEnfermeria(req, res, id);
});


//------------------------------------------------------------- Endpoints de talleres
//insertar taller
app.post('/AppConnection/Talleres', async (req, res) => {
  const Data = req.body;
  try {
      await createTaller(req, res, Data); // Llamar a la función insertUser
  } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
});
//obtener todos los talleres
app.get('/AppConnection/Talleres/:id', async (req, res) => {
  const centroID = req.params.id;
  getTalleres(req, res, centroID);
});

//get taller por id
app.get('/AppConnection/Talleres/:id', async (req, res) => {
  const id = req.params.id;
  getTallerByID(req, res, id);
}); 

//getInstructores
app.get('/AppConnection/Talleres/Instructores', async (req, res) => {
  //console.log('entro');
  //getInstructors(req, res);
});

app.get('/AppConnection/Instructores/:id', async (req, res) =>   {
  //obtener el id
  const id_centro = req.params.id;
  
  getInstructors(req, res, id_centro);
});

//get para un hello world
app.get('/Test/App', async (req, res) =>   {
  //console.log('Holaa');
  res.send('Hello World');
});

//Endpoint para eliminar un taller
app.delete('/AppConnection/Talleres/:id', async (req, res) => {
  const id = req.params.id;
  deleteTaller(req, res, id);
});

//obtener talleres por ususario
app.get('/AppConnection/Talleres/Usuario/:id', async (req, res) => {
  const id = req.params.id;
  getTalleresUsuario(req, res, id);
});

//registrar la asistencia
app.post('/AppConnection/Talleres/Asistencia', async (req, res) => {
  const Data = req.body;
  try {
      await registrarAsistencia(req, res, Data); // Llamar a la función insertUser
  } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
});

//obtener la assitencias por instructor
app.get('/AppConnection/Talleres/Asistencias/:id', async (req, res) => {
  const id = req.params.id;
  getAsistenciasInstructor(req, res, id);
});

//eliminar asistencia
app.delete('/AppConnection/Talleres/Asistencia/:id', async (req, res) => {
  const id = req.params.id;
  deleteAsistencia(req, res, id);
});

//getResumen instructor
app.get('/AppConnection/Talleres/Resumen/:id', async (req, res) => {
  const id = req.params.id;
  getResumenInstructor(req, res, id);
});

//modificar instructor
app.put('/AppConnection/Talleres/Instructores/:id', async (req, res) => {
  const id = req.params.id;
  //obtener body el UserID
  const Data = req.body;
  modificarInstructor(req, res, Data.UserID, id);
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////----------------> END POINT´S ESTADÍSTICAS
//obtener las consultas psicologia por dia
app.get('/AppConnection/Estadisticas/ConsultasPorDia/:id', async (req, res) => {
  const id = req.params.id;
  getConsultasPorDia(req, res, id);
});

//obtener las consultas enfermeria por dia
app.get('/AppConnection/Estadisticas/ConsultasEnfermeriaPorDia/:id', async (req, res) => {
  const id = req.params.id;
  getPacientesPorDia(req, res, id);
});

//obtener talleres y asistentes
app.get('/AppConnection/Estadisticas/TalleresYAsistentes/:id', async (req, res) => {
  const id = req.params.id;
  getTalleresYAsistentes(req, res);
});


const host = '0.0.0.0'; // Escucha en todas las interfaces


//_----------------------------------------------------------------------------
// Iniciar el servidor
app.listen(3001, host, () => {
  console.log('Servidor Express en funcionamiento en el puerto 3001');
});
