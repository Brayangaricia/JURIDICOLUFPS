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

controller.obtenerConsulta = (req, res) => {
    const tipoCargo = req.session.user ? req.session.user.tipoCargo : null;
    // Realiza la consulta SELECT a la base de datos
    pool.query(`SELECT 
                    c.id, c.radicado, c.fechaRecepcion, c.hechos, c.pretensiones, c.observaciones, c.archivoPDF,
                    s.papellido AS sapellidoSolicitante, s.sapellido AS sapellidoSolicitante, s.nombre AS nombreSolicitante, s.tipoIdentificacion, s.numeroIdentificacion, s.genero, s.fechaNacimiento, s.edad, s.lugarNacimiento, s.discapacidad, s.vulnerabilidad, s.direccionActual, s.correo, s.celular,
                    cs.actividadEconomica, cs.estrato, cs.sisben, 
                    e.nombreRecepciona, e.apellidosRecepciona, e.codigoRecepciona, e.correoRecepciona, e.celularRecepciona,
                    ac.nombreAccionante, ac.telefonoAccionante, ac.correoAccionante, ac.direccionAccionante,
                    ad.nombreAccionado, ad.telefonoAccionado, ad.correoAccionado, ad.direccionAccionado
                FROM consulta c
                JOIN solicitante s ON c.idSolicitante = s.id
                JOIN caracterizacionsocioeconomica cs ON c.idSolicitante = cs.idSolicitante
                JOIN estudianterecepciona e ON c.idEstudianteRecepciona = e.id
                JOIN accionante ac ON c.idAccionante = ac.id
                JOIN accionado ad ON c.idAccionado = ad.id`,
        (error, results) => {
            if (error) {
                console.error('Error al obtener datos de la base de datos:', error);
                res.status(500).send('Error al obtener datos de la base de datos');
                return;
            }
            // Muestra los resultados en la consola
            console.log('Datos obtenidos de la base de datos:', results);

            // Renderiza la vista verconsulta.hbs con los resultados de la consulta
            res.render('verconsulta', { usuarios: results, tipoCargo });
        });
};

// Controlador para generar el radicado
controller.generarRadicado = (req, res) => {
    const { areaDerecho, idConsulta, idUser } = req.body;

    // Obtenemos la fecha actual para incluirla en el radicado
    const fechaActual = new Date();
    const year = fechaActual.getFullYear();
    const month = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Se agrega 1 al mes porque en JavaScript los meses van de 0 a 11
    const day = fechaActual.getDate().toString().padStart(2, '0');
    const fechaFormateada = `${year}${month}${day}`;

    // Consultamos en la base de datos el último radicado generado para el área de derecho y la fecha actual
    pool.query('SELECT MAX(radicado) AS ultimoRadicado FROM consulta WHERE areaDerecho = ? AND YEAR(fechaRecepcion) = ? AND MONTH(fechaRecepcion) = ? AND DAY(fechaRecepcion) = ?', [areaDerecho, year, month, day], (error, results) => {
        if (error) {
            console.error('Error al obtener último radicado:', error);
            res.status(500).json({ error: 'Error al generar radicado1' });
        } else {
            let nuevoRadicado = 1; // Por defecto, si no hay radicados para la fecha actual, el nuevo radicado será el número 1

            if (results[0].ultimoRadicado) {
                nuevoRadicado = results[0].ultimoRadicado + 1; // Si hay radicados para la fecha actual, se incrementa en 1
            }

            // Formateamos el nuevo radicado con el año, mes, día y un número consecutivo
            const radicado = `${areaDerecho}-${fechaFormateada}-${nuevoRadicado}`;

            // Actualizamos la base de datos con el radicado generado
            pool.query('UPDATE consulta SET radicado = ? WHERE id = ?', [radicado, idConsulta], (error, results) => {
                if (error) {
                    console.error('Error al actualizar radicado en la base de datos:', error);
                    res.status(500).json({ error: 'Error al generar radicado2' });
                } else {
                    res.json({ radicado: radicado });
                }
            });
        }
    });
};

controller.obtenerPDF = (req, res) => {
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

module.exports = controller;

