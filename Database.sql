
CREATE DATABASE Life_Up_DB;
USE Life_Up_DB;

-- Nueva Estructura de DB--------------------------------------------------------

CREATE TABLE Users (
  UserID varchar(100) NOT NULL,
  Email varchar(50) NOT NULL,
  Password varchar(100) NOT NULL,
  Rol varchar(50) NOT NULL,
  ID_Centro varchar(20) NOT NULL,
  PRIMARY KEY (UserID) -- Definir UserID como clave primaria
);
--
-- Estructura de tabla para la tabla `InformationPersonal`
--
CREATE TABLE InformationPersonal (
  UserID varchar(100) NOT NULL,
  Nombre varchar(50) NOT NULL,
  ApellidoP varchar(50) NOT NULL,
  ApellidoM varchar(50) NOT NULL,
  PRIMARY KEY (UserID)
);


-- Estructura de tabla para la tabla `centros`
CREATE TABLE centros (
  ID_Centro varchar(20) NOT NULL,
  Nombre varchar(100) NOT NULL,
  Direccion varchar(200) NOT NULL,
  ID_Delegacion varchar(50) NOT NULL,
  CodigoPostal int(5) NOT NULL,
  PRIMARY KEY (ID_Centro)
);

-- Estructura de tabla para la tabla `delegacion`
CREATE TABLE delegacion (
  ID_Delegacion varchar(20) NOT NULL,
  Nombre varchar(100) NOT NULL,
  PRIMARY KEY (ID_Delegacion)
);

CREATE TABLE Piscologia_consultas (
  Expediente_ID VARCHAR(100) NOT NULL,
  NumeroExpediente INT AUTO_INCREMENT PRIMARY KEY,
  Fecha DATE NOT NULL,
  ID_Delegacion VARCHAR(100) NOT NULL,
  ID_Centro VARCHAR(20) NOT NULL,
  Nombre VARCHAR(100) NOT NULL,
  ApellidoP VARCHAR(100) NOT NULL,
  ApellidoM VARCHAR(100) NOT NULL,
  Edad INT NOT NULL,
  Telefono VARCHAR(10) NOT NULL, -- Cambiado a VARCHAR para permitir ceros a la izquierda
  Motivo TEXT NOT NULL,
  UserID VARCHAR(100) NOT NULL
);

CREATE TABLE Enfermeria_consultas (
  Expediente_ID VARCHAR(100) NOT NULL,
  NumeroExpediente INT AUTO_INCREMENT PRIMARY KEY,
  Fecha DATE NOT NULL,
  ID_Delegacion VARCHAR(100) NOT NULL,
  ID_Centro VARCHAR(20) NOT NULL,
  Nombre VARCHAR(100) NOT NULL,
  ApellidoP VARCHAR(100) NOT NULL,
  ApellidoM VARCHAR(100) NOT NULL,
  Edad INT NOT NULL,
  PresionArterial VARCHAR(100) NOT NULL,
  Temperatura DECIMAL(5, 2) NOT NULL,
  RitmoCardiaco DECIMAL(5, 2) NOT NULL,
  UserID VARCHAR(100) NOT NULL
);

CREATE TABLE Talleres (
  TallerID VARCHAR(100) NOT NULL,
  NumeroTaller INT AUTO_INCREMENT PRIMARY KEY,
  Nombre VARCHAR(100) NOT NULL,
  CentroID VARCHAR(20) NOT NULL,
  Instructor_ID VARCHAR(100) NOT NULL,
  GrupoExterno BOOLEAN NOT NULL,
  Duracion INT NOT NULL,
  Dias VARCHAR(200) NOT NULL,
  Hora VARCHAR(100) NOT NULL,
  Cupo INT NOT NULL
);
 
CREATE TABLE Asistencia (
  AsistenciaID VARCHAR(100) NOT NULL PRIMARY KEY,
  TallerID VARCHAR(100) NOT NULL,
  Fecha DATE NOT NULL,
  Asistentes INT NOT NULL,
  UserID VARCHAR(100) NOT NULL
);



-- Volcado de datos para la tabla `delegacion`
INSERT INTO `delegacion` (`ID_Delegacion`, `Nombre`) VALUES
('DL-01', 'Cerro Gordo'),
('DL-02', 'Las Joyas'),
('DL-03', 'Coecillo'),
('DL-04', 'San Juan Bosco'),
('DL-05', 'San Miguel'),
('DL-06', 'Del Carmen'),
('DL-07', 'Cerrito de Jerez');


INSERT INTO `centros` (`ID_Centro`, `Nombre`, `Direccion`, `ID_Delegacion`, `CodigoPostal`) VALUES
('CEDIF-01', 'San Juan de Dios', 'Plaza Revolución 107, San Juan de Dios, León, Gto', 'DL-05', 37004),
('CEDIF-02', 'Con Deseos de Vivir', 'Familia San Bruno 102, Jardines de Los Naranjos, Praderas de Santa Rosa, León, Gto', 'DL-03', 37210),
('CEDIF-03', 'Casa de los abuelos', 'Juan Bautista La Salle 303, Panorama, León, Gto', 'DL-01', 37160);



/*
---- CREAR UAUARIO ADMINISTRADOR ----

CREATE USER 'AdminDif'@'localhost' IDENTIFIED BY 'EcabLUgdwUd71Lw';
GRANT ALL PRIVILEGES ON Life_Up_DB.* TO 'AdminDif'@'localhost';
FLUSH PRIVILEGES;

////////////////////////////////////////////////////////////////////////////////////   DIF SAN JUAN DE DIOS ----
INSERT INTO Users (UserID, Email, Password, Rol, ID_Centro)
VALUES ('31f626a0-81f0-46a6-bb56-b818e3fd5dbc', 'administrador.SJDD@dif.com', 'e63fe0bfb493d19ce17b301a16453ae56de8d379585f9ec1ab5784ed18903cfa', 'Administrador', 'CEDIF-01');

INSERT INTO InformationPersonal (UserID, Nombre, ApellidoP, ApellidoM)
VALUES ('31f626a0-81f0-46a6-bb56-b818e3fd5dbc', 'Admin', 'Admin', 'Admin');

{
  "Email": "administrador.SJDD@dif.com",
  "Password": "AdministradorSanJuanDeDios"
}


////////////////////////////////////////////////////////////////////////////////////   DIF Con Deseos de Vivir ----
INSERT INTO Users (UserID, Email, Password, Rol, ID_Centro)
VALUES ('b2f931b1-ed1f-49e8-9ccf-fad4f4f791b1', 'administrador.SJDD@dif.com', 'b8f61ea007b0dbecebf47c49d0024891fb7f498491478ef4601665d17d8dd0eb', 'Administrador', 'CEDIF-02');

INSERT INTO InformationPersonal (UserID, Nombre, ApellidoP, ApellidoM)
VALUES ('b2f931b1-ed1f-49e8-9ccf-fad4f4f791b1', 'Admin', 'Admin', 'Admin');

{
  "Email": "administrador.CDDV@dif.com",
  "Password": "AdministradorConDeseosDeVivir"
}

////////////////////////////////////////////////////////////////////////////////////    DIF Casa de los abuelos ----
INSERT INTO Users (UserID, Email, Password, Rol, ID_Centro)
VALUES ('be116e3d-b9a3-41df-9644-d1bf6246a4fc', 'administrador.CDLA@dif.com', 'c29562e067a0b0e75b2d8740b7746b413cb269a7354fe7502e88814795152903', 'Administrador', 'CEDIF-03');

INSERT INTO InformationPersonal (UserID, Nombre, ApellidoP, ApellidoM)
VALUES ('be116e3d-b9a3-41df-9644-d1bf6246a4fc', 'Admin', 'Admin', 'Admin');

{
  "Email": "administrador.CDLA@dif.com",
  "Password": "AdministradorCasadelosAbuelos"
}


*/
