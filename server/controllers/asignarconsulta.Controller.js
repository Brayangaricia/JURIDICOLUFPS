const controller = {};
module.exports = controller;

controller.asignarconsulta = (req, res) => {
  const tipoCargo = req.session.user ? req.session.user.tipoCargo : null;

  // Renderizar la vista del dashboard con el tipo de cargo
  res.render("asignarconsulta", { tipoCargo });
};

controller.asignarConsultaAleatoria = (req, res) => {
  // Obtener el área de derecho deseado
  const areaDerecho = req.params.areaDerecho;

  // Consulta para obtener los alumnos interesados en el área de derecho
  const sqlAlumnos = `SELECT * FROM alumnorecepciona WHERE areaDerecho = ?`;
  connection.query(sqlAlumnos, [areaDerecho], (err, alumnos) => {
    if (err) {
      console.error("Error al obtener alumnos:", err);
      res.status(500).send("Error en el servidor al obtener alumnos.");
      return;
    }

    if (alumnos.length === 0) {
      res
        .status(404)
        .send(
          "No hay alumnos interesados en el área de derecho proporcionado."
        );
      return;
    }

    // Consulta para obtener las consultas disponibles para el área de derecho
    const sqlConsultas = `SELECT * FROM consulta WHERE areaDerecho = ? AND asignada = 0`;
    connection.query(sqlConsultas, [areaDerecho], (err, consultas) => {
      if (err) {
        console.error("Error al obtener consultas:", err);
        res.status(500).send("Error en el servidor al obtener consultas.");
        return;
      }

      if (consultas.length === 0) {
        res
          .status(404)
          .send(
            "No hay consultas disponibles para el área de derecho proporcionado."
          );
        return;
      }

      // Asignar consultas aleatorias a los alumnos
      alumnos.forEach((alumno) => {
        const consultasAsignadas = [];
        // Mezclar la lista de consultas
        consultas.sort(() => Math.random() - 0.5);
        // Seleccionar las primeras 4 consultas
        for (let i = 0; i < 4 && i < consultas.length; i++) {
          const consulta = consultas[i];
          consultasAsignadas.push(consulta);
          // Actualizar la consulta para marcarla como asignada
          const sqlUpdateConsulta = `UPDATE consulta SET asignada = 1, idAlumno = ? WHERE idConsulta = ?`;
          connection.query(
            sqlUpdateConsulta,
            [alumno.idAlumno, consulta.idConsulta],
            (err, result) => {
              if (err) {
                console.error("Error al actualizar consulta:", err);
              }
            }
          );
        }
        console.log(
          `Consultas asignadas al alumno ${alumno.idAlumno}:`,
          consultasAsignadas
        );
      });

      res.send("Asignación de consultas realizada exitosamente.");
    });
  });
};
