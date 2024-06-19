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
  if (err) throw err; //not connected
  console.log("Connected as ID" + connection.threadId);
});

const conexion = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Establecer la conexión a la base de datos
conexion.connect((error) => {
  if (error) {
    console.error("Error al conectar a la base de datos:", error);
    return;
  }
  console.log("Conexión a la base de datos exitosa");
});

controller.registrarusuario = (req, res) => {
  const tipoCargo = req.session.user ? req.session.user.tipoCargo : null;
  res.render("registrarusuario", { tipoCargo });
};

controller.registrarusuariopost = (req, res) => {
  const tipoCargoSession = req.session.user ? req.session.user.tipoCargo : null;
  const {
    nombres,
    apellidos,
    correo,
    tipoCargo,
    areaDerecho,
    codigo,
    usuario,
    contrasena,
  } = req.body;

  const existenciaQuery =
    "SELECT COUNT(*) AS count FROM user WHERE usuario = ? OR correo = ? OR codigo = ?";
  conexion.query(
    existenciaQuery,
    [usuario, correo, codigo],
    (error, resultados) => {
      if (error) {
        console.error(
          "Error al verificar existencia de usuario/correo/código:",
          error
        );
        return res.render("registrarusuario", { tipoCargo: tipoCargoSession, error: "Error al registrar usuario" });
      }

      const { count } = resultados[0];
      if (count > 0) {
        return res.render("registrarusuario", { tipoCargo: tipoCargoSession, error: "El usuario, el correo o el código ya están en uso" });
      }

      const registroQuery =
        "INSERT INTO user (nombres, apellidos, tipoCargo, correo, areaDerecho, codigo, usuario, contrasena) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      conexion.query(
        registroQuery,
        [
          nombres,
          apellidos,
          tipoCargo,
          correo,
          areaDerecho,
          codigo,
          usuario,
          contrasena,
        ],
        (errorRegistro, resultadosRegistro) => {
          if (errorRegistro) {
            console.error("Error al registrar usuario:", errorRegistro);
            return res.render("registrarusuario", { tipoCargo: tipoCargoSession, error: "Error al registrar usuario" });
          }
          console.log("Usuario registrado con éxito");
          res.render("registrarusuario", { tipoCargo: tipoCargoSession, success: "Usuario registrado con éxito" });
        }
      );
    }
  );
};

module.exports = controller;

