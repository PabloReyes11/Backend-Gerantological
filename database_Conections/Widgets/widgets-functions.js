const connection = require('../../SQL_CONECTION');


////////////////////////////////////////////////////////////////////////////////////////////////-------------> Obtener cantidad de masculinos
async function getMasculino() {
    return new Promise((resolve, reject) => {
      // obtener numero de masculinos
      connection.query('SELECT * FROM usuarios WHERE Sexo = "Masculino"', (error, results) => {
        if (error) {
          console.error('Error al ejecutar la consulta:', error);
          reject(error);
        } else {
          const cantidadMasculinos = results.length;
          resolve(cantidadMasculinos);
        }
      });
    });
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////-------------> Obtener cantidad de femeninos
  async function getFemenino() {
    return new Promise((resolve, reject) => {
      // obtener numero de masculinos
      connection.query('SELECT * FROM usuarios WHERE Sexo = "Femenino"', (error, results) => {
        if (error) {
          console.error('Error al ejecutar la consulta:', error);
          reject(error);
        } else {
          const cantidadMasculinos = results.length;
          resolve(cantidadMasculinos);
        }
      });
    });
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////-------------> Funcion principal para obtener la cantidad de sexo
  async function getSexos(req, res) {
    try {
      const cantidadMasculinos = await getMasculino();
      const cantidadFemeninos = await getFemenino();

      
      ////console.log("Masculinos: " + cantidadMasculinos);
      ////console.log("Femeninos: " + cantidadFemeninos);
     // //console.log("total: " + totalUser);


      const datos = [
        ['Género', 'Cantidad'],
        ['Masculino', cantidadMasculinos],
        ['Femenino', cantidadFemeninos],
    ];
      ////console.log("total: " + getPorcentaje(cantidadMasculinos, totalUser));
      ////console.log("fecha: "+ fecha);
      res.json(datos);
      // clasificar en porcentaje
    } catch (error) {
      console.error('Error al obtener la cantidad de masculinos:', error);
      res.status(500).send('Error en el servidor');
    }
  }
  

  async function getFechasSQLFilter() {
    return new Promise((resolve, reject) => {

        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const DataGraficaFecha = [['Mes', 'Usuarios']];

        const promesas = meses.map((mes, indice) => {
            return new Promise((resolverConsulta, rechazarConsulta) => {
                connection.query(`SELECT Fecha FROM usuarios WHERE MONTH(STR_TO_DATE(Fecha, "%d/%m/%Y")) = ${indice + 1}`, (error, resultados) => {
                    if (error) {
                        console.error(`Error al ejecutar la consulta para el mes ${mes}:`, error);
                        rechazarConsulta(error);
                    } else {
                        DataGraficaFecha.push([mes, resultados.length]);
                        resolverConsulta();
                    }
                });
            });
        });

        Promise.all(promesas)
            .then(() => {
                resolve(DataGraficaFecha);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

async function getFechasSQLFilterPsicologia() {
  return new Promise((resolve, reject) => {

      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const DataGraficaFecha = [['Mes', 'Usuarios']];

      const promesas = meses.map((mes, indice) => {
          return new Promise((resolverConsulta, rechazarConsulta) => {
              connection.query(`SELECT Fecha FROM psicologia WHERE MONTH(STR_TO_DATE(Fecha, "%d/%m/%Y")) = ${indice + 1}`, (error, resultados) => {
                  if (error) {
                      console.error(`Error al ejecutar la consulta para el mes ${mes}:`, error);
                      rechazarConsulta(error);
                  } else {
                      DataGraficaFecha.push([mes, resultados.length]);
                      resolverConsulta();
                  }
              });
          });
      });

      Promise.all(promesas)
          .then(() => {
              resolve(DataGraficaFecha);
          })
          .catch((error) => {
              reject(error);
          });
  });
}
  
async function getFechasEndPoint(req, res) {
    try {
      
      const datos = await getFechasSQLFilter();
  
      res.json(datos);
      // clasificar en porcentaje
    } catch (error) {
      console.error('Error al obtener la cantidad de masculinos:', error);
      res.status(500).send('Error en el servidor');
    }
  }
  
  async function getFechasPsicologia(req, res) {
    try {
      
      const datos = await getFechasSQLFilterPsicologia();
  
      res.json(datos);
      // clasificar en porcentaje
    } catch (error) {
      console.error('Error al obtener la cantidad de masculinos:', error);
      res.status(500).send('Error en el servidor');
    }
  }
module.exports = {
    getSexos,
    getFechasEndPoint,
    getFechasPsicologia
} 