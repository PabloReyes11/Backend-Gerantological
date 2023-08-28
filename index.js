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

//IMPORTS PARA LAS FUNCTIONS DE SUPER USUARIO
const { AuthSU } = require('./database_Conections/SuperUsuarios/LoginSU_sql');
const { getTable } = require('./database_Conections/SuperUsuarios/DashboardSU');
const { insertUser } = require('./database_Conections/SuperUsuarios/DashboardSU');
const { getListCentros } = require('./database_Conections/SuperUsuarios/DashboardSU');
const { getNumeroDeUsuarios } = require('./database_Conections/SuperUsuarios/DashboardSU');
const { incrementUser } = require('./database_Conections/SuperUsuarios/DashboardSU');
const { getInfoUser } = require('./database_Conections/SuperUsuarios/DashboardSU');
const { deleteUser } = require('./database_Conections/SuperUsuarios/DashboardSU');

//LOGIN NORMAL
const { AuthNormal } = require('./database_Conections/login');

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
  getPhotoURL
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
  VerificarIDTaller
} = require('./database_Conections/Talleres/Talleres-Actions');

// MODULO DE WIDGETS
const {
  getSexos,
  getFechasEndPoint,
  getFechasPsicologia
} = require('./database_Conections/Widgets/widgets-functions');





///////////////////////////////////////////////////////////////////////////////////////////////////////////////////----------------> END POINT´S SUPER USUARIOS
//------------------------------------------------------------- Ruta de inicio de sesión de super usuarios
app.post('/api/login', async (req, res) => {
  //Obtener el body
  const { email, password } = req.body;
  //Método para autenticar el super usuario
  AuthSU(req, res, email);
});
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



//_----------------------------------------------------------------------------
// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor Express en funcionamiento en el puerto 3000');
});
