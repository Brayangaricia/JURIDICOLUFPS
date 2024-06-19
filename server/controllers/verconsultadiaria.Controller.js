const fs = require('fs');
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

const controller = {};

controller.obtenerConsultadiaria = (req, res) => {
    const tipoCargo = req.session.user ? req.session.user.tipoCargo : null;
    // Realiza la consulta SELECT a la base de datos para obtener los datos del día actual
    pool.query(`SELECT 
                    c.id, c.radicado, c.fechaRecepcion, c.hechos, c.pretensiones, c.observaciones, c.archivoPDF,
                    s.papellido AS papellidoSolicitante, s.sapellido AS sapellidoSolicitante, s.nombre AS nombreSolicitante, s.tipoIdentificacion, s.numeroIdentificacion, s.genero, s.fechaNacimiento, s.edad, s.lugarNacimiento, s.discapacidad, s.vulnerabilidad, s.direccionActual, s.correo, s.celular,
                    cs.actividadEconomica, cs.estrato, cs.sisben, 
                    e.nombreRecepciona, e.apellidosRecepciona, e.codigoRecepciona, e.correoRecepciona, e.celularRecepciona,
                    ac.nombreAccionante, ac.telefonoAccionante, ac.correoAccionante, ac.direccionAccionante,
                    ad.nombreAccionado, ad.telefonoAccionado, ad.correoAccionado, ad.direccionAccionado
                FROM consulta c
                JOIN solicitante s ON c.idSolicitante = s.id
                JOIN caracterizacionsocioeconomica cs ON c.idSolicitante = cs.idSolicitante
                JOIN estudianterecepciona e ON c.idEstudianteRecepciona = e.id
                JOIN accionante ac ON c.idAccionante = ac.id
                JOIN accionado ad ON c.idAccionado = ad.id
                WHERE c.fechaRecepcion = CURDATE()`,
        (error, results) => {
            if (error) {
                console.error('Error al obtener datos de la base de datos:', error);
                res.status(500).send('Error al obtener datos de la base de datos');
                return;
            }
            // Muestra los resultados en la consola
            console.log('Datos obtenidos de la base de datos:', results);

            // Renderiza la vista verconsulta.hbs con los resultados de la consulta
            res.render('verconsultadiaria', { usuarios: results, tipoCargo });
        });
};

// Controlador para generar el radicado


controller.obtenerPDFdiaria = (req, res) => {
    const idConsulta = req.params.id;
    console.log("ID de la consulta:", idConsulta);

    pool.query('SELECT archivoPDF FROM consulta WHERE id = ?', [idConsulta], (error, results) => {
        if (error) {
            console.error('Error al recuperar el PDF:', error);
            return res.status(500).send('Error al recuperar el PDF');
        }

        if (results.length === 0) {
            return res.status(404).send('PDF no encontrado');
        }

        const archivoBase64PDF = results[0].archivoPDF;
        // Convertir el archivo base64 a formato de archivo PDF y enviarlo como respuesta
        const buffer = Buffer.from(archivoBase64PDF, 'base64');
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename=archivo.pdf' // Cambia 'inline' a 'attachment' si quieres que se descargue automáticamente
        });
        res.send(buffer);
    });
};


controller.editarRadicado = (req, res) => {
    const { id } = req.params;
    const { radicado } = req.body;

    console.log('ID:', id);
    console.log('Nuevo Radicado:', radicado);

    pool.query('UPDATE consulta SET radicado = ? WHERE id = ?', [radicado, id], (error, results) => {
        if (error) {
            console.error('Error al editar el radicado:', error);
            return res.status(500).send('Error al editar el radicado');
        }
        console.log('Resultados:', results);
        res.sendStatus(200);
    });
};

module.exports = controller;
