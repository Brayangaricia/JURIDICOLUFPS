const controller = {};
const mysql = require('mysql');

const conexion = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Establecer la conexión a la base de datos
conexion.connect((error) => {
  if (error) {
    console.error('Error al conectar a la base de datos:', error);
    return;
  }
  console.log('Conexión a la base de datos exitosa');
});

controller.dashboard = async (req, res) => {
  console.log("Iniciando función dashboard...");

  const tipoCargo = req.session.user ? req.session.user.tipoCargo : null;
  console.log("Tipo de cargo:", tipoCargo);

  let datos = {}; // Inicializamos datos aquí
  console.log("Datos inicializados:", datos);

  const queryUsuarios = "SELECT COUNT(*) AS total FROM user";
  console.log("Consulta a la base de datos (usuarios):", queryUsuarios);

  const queryConsultas = "SELECT COUNT(*) AS total FROM consulta";
  console.log("Consulta a la base de datos (consultas):", queryConsultas);

  const queryConsultasPorDia = "SELECT DATE_FORMAT(fechaRecepcion, '%Y-%m-%d') AS dia, COUNT(*) AS total FROM consulta GROUP BY dia";
  console.log("Consulta a la base de datos (consultas por día):", queryConsultasPorDia);

  try {
    // Consulta para obtener el total de usuarios registrados
    const [usuariosRegistrados] = await new Promise((resolve, reject) => {
      conexion.query(queryUsuarios, (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
    console.log("Resultado de la consulta (usuarios):", usuariosRegistrados);

    // Consulta para obtener el total de consultas
    const [consultas] = await new Promise((resolve, reject) => {
      conexion.query(queryConsultas, (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
    console.log("Resultado de la consulta (consultas):", consultas);

    // Nueva consulta para obtener las consultas registradas por día
    const consultasPorDia = await new Promise((resolve, reject) => {
      conexion.query(queryConsultasPorDia, (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
    console.log("Resultado de la consulta (consultas por día):", consultasPorDia);

    // Procesar resultados de la consulta de usuarios registrados
    if (usuariosRegistrados && usuariosRegistrados.total !== undefined) {
      console.log("Total de usuarios registrados:", usuariosRegistrados.total);
      datos.usuariosRegistrados = usuariosRegistrados.total;
    } else {
      console.log("No se encontraron datos de usuarios registrados.");
      throw new Error("No se encontraron datos de usuarios registrados");
    }

    // Procesar resultados de la consulta de consultas
    if (consultas && consultas.total !== undefined) {
      console.log("Total de consultas:", consultas.total);
      datos.consultas = consultas.total;
    } else {
      console.log("No se encontraron datos de consultas.");
      throw new Error("No se encontraron datos de consultas");
    }

    // Procesar resultados de la consulta de consultas por día
    if (consultasPorDia) {
      console.log("Consultas por día:", consultasPorDia);
      // Organizar los datos para la gráfica
      const dias = consultasPorDia.map(consulta => consulta.dia);
      const totalConsultasPorDia = consultasPorDia.map(consulta => consulta.total);
      datos.consultasPorDia = {
        dias: dias, // Sin convertir a JSON
      // Organizar los datos para la gráfica
        totales: totalConsultasPorDia // Sin convertir a JSON
      };
    } else {
      console.log("No se encontraron datos de consultas por día.");
      throw new Error("No se encontraron datos de consultas por día");
    }

    res.render("dashboard", { tipoCargo, datos }); // Renderizamos la plantilla "dashboard" con tipoCargo y datos
    console.log("Plantilla renderizada con éxito.");
  } catch (error) {
    console.error("Error al obtener datos:", error);
    res.render("dashboard", { tipoCargo, datos }); // Si ocurre un error, renderizamos la plantilla "dashboard" con tipoCargo y datos vacíos
    console.log("Error al renderizar la plantilla:", error);
  }
};


module.exports = controller;

