const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
var bodyParser = require('body-parser');
const multer = require('multer'); // Middleware para manejar archivos en formularios

// Configuración de CORS
app.use(cors());
// Middleware para analizar el cuerpo de la solicitud como JSON
app.use(express.json());

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
const destinoFoto = "uploads";
// Configuración de multer para guardar la imagen en el servidor
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


//require functions


//LOGIN 
const { Autentication } = require('./ActionsDB/login');

//users
const { insertUser, updateUser, deleteUser, getAllUsers,
  insertInformationPersonal,
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
/*
//IMPORTS PARA LAS FUNCTIONS DE SUPER USUARIO
const { AuthSU } = require('./database_Conections/SuperUsuarios/LoginSU_sql');
const { getTable } = require('./database_Conections/SuperUsuarios/DashboardSU');
const { insertUser } = require('./database_Conections/SuperUsuarios/DashboardSU');
const { getListCentros } = require('./database_Conections/SuperUsuarios/DashboardSU');
const { getNumeroDeUsuarios } = require('./database_Conections/SuperUsuarios/DashboardSU');
const { incrementUser } = require('./database_Conections/SuperUsuarios/DashboardSU');
const { getInfoUser } = require('./database_Conections/SuperUsuarios/DashboardSU');
const { deleteUser } = require('./database_Conections/SuperUsuarios/DashboardSU');

//MODULO DE USUARIOS
const {
  GetCentroID,
  InsertNewUserInfoPersonal,
  InsertNewUserInfoContact,
  InsertNewUserInfoEmergencia,
  InsertNewUserPhoto,
  obtenerResumenUserNew,
  getTableUser,
  getUserInfoWidget,
  getUser, DeleteUserInfo,
  getPhotoURL,
  getUserLUmobile
} = require('./database_Conections/Users/UserModule');

//MODULO DE PSICOLOGÍA
const {
  InsertNewConsultPsicologia
} = require('./database_Conections/Psicologia/psicologia-actions');

//MODULO DE SALUD
const {
  InsertNewExpedienteSalud,
  InsertNewConsultaSalud
} = require('./database_Conections/Salud/salud-actions');

//MODULO DE TEST
const { obtenerTest } = require('./database_Conections/test');

//MODULO DE TALLERES
const {
  getTableTalleres,
  getIdTalleresUltimo,
  InsertNewTaller,
  DeleteTaller,
  VerificarIDTaller,
  getListTalleres,
  InsertAssitance
} = require('./database_Conections/Talleres/Talleres-Actions');

// MODULO DE WIDGETS
const {
  getSexos,
  getFechasEndPoint,
  getFechasPsicologia
} = require('./database_Conections/Widgets/widgets-functions');

*/



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////----------------> END POINT´S SUPER USUARIOS
//------------------------------------------------------------- Ruta de inicio de sesión de super usuarios
app.post('/AppConnection/Login', async (req, res) => {
  const Data = req.body;
  console.log('data: ' + Data);
  
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
  console.log( Data);
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
  console.log('id: ' + req.params.id);
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
  console.log('entro');
  //getInstructors(req, res);
});

app.get('/AppConnection/Instructores/:id', async (req, res) =>   {
  //obtener el id
  const id_centro = req.params.id;
  
  getInstructors(req, res, id_centro);
});

//get para un hello world
app.get('/Test/App', async (req, res) =>   {
  console.log('Holaa');
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
/*
//------------------------------------------------------------- Ruta de obtener tabla de usuarios y roles
app.get('/api/tableRol', async (req, res) => {
  //Método para autenticar el super usuario
  getTable(req, res);
});
//------------------------------------------------------------- obtiene lista de centros y ids
app.get('/api/GetCentros', async (req, res) => {
  //Método para autenticar el super usuario
  getListCentros(req, res);
});
//------------------------------------------------------------- obtiene el numero de usuario ultimo
app.get('/api/GetNumUser', async (req, res) => {
  //Método para autenticar el super usuario
  getNumeroDeUsuarios(req, res);
});
//------------------------------------------------------------- Ruta de insertar usuarios super
app.post('/api/AddUser', async (req, res) => {
  //Método para autenticar el super usuario
  const formData = req.body;
  insertUser(req, res, formData);
});
//------------------------------------------------------------- Ruta de incremenmto en numero de usuarios
app.post('/api/IncrementUSerNum', async (req, res) => {
  //Método para autenticar el super usuario
  const Data = req.body;
  incrementUser(req, res, Data);
});
//------------------------------------------------------------- obtiene la informacion del personal en base a su id
app.post('/api/UserSearch', async (req, res) => {
  //Método para autenticar el super usuario
  const ID = req.body.ID;
  getInfoUser(req, res, ID);
});
//------------------------------------------------------------- obtiene la informacion del personal en base a su id
app.post('/api/DeleteUser', async (req, res) => {
  //Método para autenticar el super usuario
  const ID = req.body.ID;
  deleteUser(req, res, ID);
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////----------------> END POINT´S LOGIN PERSONAL
app.post('/api/loginNormal', (req, res) => {
  
  //Obtener el body
  const { email, password } = req.body;
  console.log('user: '+ email);
  console.log('pass: '+password);
  //Método para autenticar el super usuario
  AuthNormal(req, res, email);
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////----------------> END POINT´S MODULO DE USUARIOS
//------------------------------------------------------------- obtiene el numero de usuario ultimo
app.post('/api/GetCentroID', async (req, res) => {
  //Método OBTENER EL CENTRO
  const { ID_Personal } = req.body;
  //console.log("personal: "+ID_Personal);
  GetCentroID(req, res, ID_Personal);
});
//------------------------------------------------------------- Ruta de insertar usuarios info personal
app.post('/api/addInformationPersonalUser', async (req, res) => {
  //Método para autenticar el super usuario
  const formData = req.body;

  InsertNewUserInfoPersonal(req, res, formData);
});
//------------------------------------------------------------- Ruta de insertar usuarios info personal contacto, tabla direcciones
app.post('/api/addInformationContactUser', async (req, res) => {
  //Método para autenticar el super usuario
  const formData = req.body;
  InsertNewUserInfoContact(req, res, formData);
});
//------------------------------------------------------------- Ruta de insertar usuarios info personal emergencia
app.post('/api/addInformationEmergencyUser', async (req, res) => {
  //Método para autenticar el super usuario
  const formData = req.body;

  InsertNewUserInfoEmergencia(req, res, formData);
});
//------------------------------------------------------------- Ruta de insertar usuarios info personal emergencia
app.post('/api/addUserPhoto', upload.single('userPhoto'), (req, res) => {
  try {
    const userId = req.body.userId;
    //console.log('ID de usuario:', userId);
    ///console.log('Nombre del archivo:', req.file.filename);
    const namePhoto = req.file.filename;
    const ruta = "./" + destinoFoto + '/' + namePhoto;
    // console.log('destino: ' , ruta);
    //res.status(200).json({ message: 'Imagen subida correctamente.' });
    const UserID = userId;
    const FotoURL = namePhoto;
    const formData = {
      UserID,
      FotoURL
    }
    InsertNewUserPhoto(req, res, formData);
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    res.status(500).json({ error: 'Error al subir la imagen.' });
  }
});
// 

app.post('/api/obtenerInfoNuevoUser', async (req, res) => {
  //Método para autenticar el super usuario
  //getListCentros(req, res);
  obtenerResumenUserNew(req, res);
});



//------------------------------------------------------------- Ruta de obtener tabla de usuarios 
app.get('/api/tableUsers', async (req, res) => {
  //Método para autenticar el super usuario
  getTableUser(req, res);
});

app.get('/getImageUser', (req, res) => {
  const imagePath = path.join(__dirname, 'public', 'uploads', 'foto.png');
  res.sendFile(imagePath);
});

//------------------------------------------------------------- borrar user
app.post('/api/DeleteUserInfoComplete', async (req, res) => {
  //Método para autenticar el super usuario
  const ID = req.body.ID;
  DeleteUserInfo(req, res, ID);
});

app.post('/api/getWidgetInfo', (req, res) => {
  const { ID } = req.body;
  getUserInfoWidget(req, res, ID);
});

// delete usaer
app.post('/api/UserInfoSearch', async (req, res) => {
  //Método para autenticar el super usuario
  const ID = req.body.ID;
  getUser(req, res, ID);
});

app.get('/api/ObtenerFoto', async (req, res) => {
  //Método para autenticar el super usuario
  //console.log("afuera de try");
  const { ID } = req.query;
  try {
    const NamePhoto = await getPhotoURL(ID);
    const rutaFoto = "./uploads" + '/' + NamePhoto; // Reemplaza 'nombre_de_la_foto.jpg' con el nombre real de la foto
    // Asegúrate de que la rutaFoto sea segura y esté dentro de un directorio específico para evitar accesos no deseados
    const rutaCompleta = path.resolve(rutaFoto);
    //console.log(rutaCompleta);
    res.sendFile(rutaCompleta);
  } catch (error) {
    console.error('Error al obtener la foto del usuario:', error);
    res.status(500).json({ error: 'Error al obtener la foto del usuario.' });
  }
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////----------------> END POINT´S MODULO PSICOLOGÍA
//add consult
app.post('/api/Psicologia-Insert-NewConsult', async (req, res) => {
  //Método para autenticar el super usuario
  const formData = req.body;
  InsertNewConsultPsicologia(req, res, formData);
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////----------------> END POINT´S MODULO SALUD
//add expediente
app.post('/api/Salud-Insert-NewExpedient', async (req, res) => {
  //Método para autenticar el super usuario
  const formData = req.body;
  InsertNewExpedienteSalud(req, res, formData);
});
//add consulta
app.post('/api/Salud-Insert-NewConsult', async (req, res) => {
  //Método para autenticar el super usuario
  console.log("index");
  const formData = req.body;
  InsertNewConsultaSalud(req, res, formData);
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////----------------> END POINT´S MODULO TALLERES
//gettablke
app.get('/api/tableTalleres', async (req, res) => {
  //Método para autenticar el super usuario
  getTableTalleres(req, res);
});

//getID
app.get('/api/getIDTalleres', async (req, res) => {
  //Método para autenticar el super usuario
  getIdTalleresUltimo(req, res);
});

//insert
app.post('/api/Taller-Insert-NewTaller', async (req, res) => {
  //Método para autenticar el super usuario
  const formData = req.body;
  InsertNewTaller(req, res, formData);
});

//delte
app.post('/api/TallerDelete', async (req, res) => {
  //Método para autenticar el super usuario
  const ID = req.body.ID;
  console.log(ID);
  DeleteTaller(req, res, ID);
});

app.post('/api/VerificarTallerID', async (req, res) => {
  //Método para autenticar el super usuario
  const ID = req.body.ID;
  console.log(ID);
  VerificarIDTaller(req, res, ID);
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////----------------> END POINT´S MODULO WIDGETS
//sexos
app.get('/api/widgets-Get-sexos', async (req, res) => {
  //Método para autenticar el super usuario

  getSexos(req, res);
});
//fechas de altas
app.get('/api/widgets-Get-Fechas', async (req, res) => {
  //Método para autenticar el super usuario

  getFechasEndPoint(req, res);
});

//fechas de atencion
app.get('/api/widgets-Get-Psicologia', async (req, res) => {
  //Método para autenticar el super usuario

  getFechasPsicologia(req, res);
});

//endpoint test
app.post('/test', (req, res,) => {
  const { copiedPersonalID } = req.body;
  //llamar a la funcion de busqueda
  obtenerTest(req, res, dato);
});

//////////////////////////////////////////////////life up mobile
//endpoint buscar user
app.get('/api/app-verify', (req, res) => {
  const ID = req.query.username;
  //llamar a la funcion de busqueda
  getUserLUmobile(req, res, ID);
});

app.get('/api/GetTalleres', async (req, res) => {
  //Método para autenticar el super usuario
  getListTalleres(req, res);
});

app.post('/api/New-Assistance-Taller', async (req, res) => {
  //Método para autenticar el super usuario
  const formData = req.body;
  InsertAssitance(req, res, formData);
});



*/

const host = '0.0.0.0'; // Escucha en todas las interfaces


//_----------------------------------------------------------------------------
// Iniciar el servidor
app.listen(3000, host, () => {
  console.log('Servidor Express en funcionamiento en el puerto 3000');
});
