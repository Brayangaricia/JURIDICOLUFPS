const controller = {};
const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log("Connected as ID " + connection.threadId);
});

controller.login = (req, res) => {
  res.render("home");
};

controller.authenticateUser = (req, res) => {
  const { usuario, contrasena } = req.body;
  console.log("Datos recibidos:", usuario, contrasena);

  // Realizar la consulta SQL para buscar el usuario
  pool.query(
    "SELECT * FROM user WHERE usuario = ? AND contrasena = ?",
    [usuario, contrasena],
    async (error, results) => {
      if (error) {
        // Manejar errores de consulta SQL
        console.error("Error al ejecutar la consulta SQL:", error);
        return res.status(500).send("Error de servidor");
      }
      // Verificar si se encontraron resultados
      if (results.length > 0) {
        const user = results[0];
        // Almacenar los datos del usuario en la sesión
        req.session.user = {
          id: user.id,
          usuario: user.usuario,
          tipoCargo: user.tipoCargo,
        };

        console.log(
          "Datos del usuario almacenados en la sesión:",
          req.session.user
        );

        console.log("Tipo de usuario:", user.tipoCargo);

        // Consultar los datos necesarios para el dashboard
        try {
          const [usuariosRegistrados] = await new Promise((resolve, reject) => {
            pool.query("SELECT COUNT(*) AS total FROM user", (error, results) => {
              if (error) reject(error);
              resolve(results);
            });
          });
          console.log("Resultado de la consulta (usuarios):", usuariosRegistrados);

          const [consultas] = await new Promise((resolve, reject) => {
            pool.query("SELECT COUNT(*) AS total FROM consulta", (error, results) => {
              if (error) reject(error);
              resolve(results);
            });
          });
          console.log("Resultado de la consulta (consultas):", consultas);

          const datos = {
            usuariosRegistrados: usuariosRegistrados.total,
            consultas: consultas.total,
          };

          // Redirigir al dashboard y pasar tipoCargo y datos a la vista
          return res.render("dashboard", { tipoCargo: user.tipoCargo, datos });
        } catch (error) {
          console.error("Error al obtener datos para el dashboard:", error);
          return res.status(500).send("Error de servidor");
        }
      } else {
        // Renderizar la página de inicio de sesión nuevamente con un mensaje de error
        console.log(
          "No se encontraron resultados para las credenciales proporcionadas."
        );
        return res.render("home", {
          error: "Usuario o contraseña incorrectos",
        });
      }
    }
  );
};


module.exports = controller;
