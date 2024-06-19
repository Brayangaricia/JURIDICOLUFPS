const controller = {};

const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

pool.getConnection((err, connection) => {
    if (err) throw err; //not connectd
    console.log(' Connectd as ID' + connection.threadId);
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
        console.error('Error al conectar a la base de datos:', error);
        return;
    }
    console.log('Conexión a la base de datos exitosa');
});

controller.registrarconsulta = (req, res) => {

    const tipoCargo = req.session.user ? req.session.user.tipoCargo : null;
    res.render('registrarconsulta', { tipoCargo });
};


controller.registrarconsultapost = (req, res) => {
    const tipoCargoSession = req.session.user ? req.session.user.tipoCargo : null;

    const {
        radicado,
        fechaRecepcion,
        papellido,
        sapellido,
        nombre,
        tipoIdentificacion,
        numeroIdentificacion,
        genero,
        fechaNacimiento,
        edad,
        lugarNacimiento,
        ciudad,
        discapacidad,
        vulnerabilidad,
        direccionActual,
        correo,
        celular,
        estrato,
        sisben,
        nivelEstudio,
        oficio,
        nivelIngresoEconomico,
        actividadEconomica,
        apellidosRecepciona,
        correoRecepciona,
        nombreRecepciona,
        celularRecepciona,
        codigoRecepciona,
        nombreAccionante,
        correoAccionante,
        telefonoAccionante,
        direccionAccionante,
        nombreAccionado,
        correoAccionado,
        telefonoAccionado,
        direccionAccionado,
        hechos,
        pretensiones,
        observaciones,
        archivoNamePDF,
        archivoBase64PDF
    } = req.body;

    // Imprimir los datos del solicitante
    console.log(`${archivoNamePDF} ${archivoBase64PDF}`);

    // Iniciar una transacción para asegurar que todas las inserciones se realicen
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error al obtener la conexión:', err);
            return res.status(500).send('Error al registrar la consulta');
        }

        connection.beginTransaction(errorTransaction => {
            if (errorTransaction) {
                console.error('Error al iniciar la transacción:', errorTransaction);
                connection.release();
                return res.status(500).send('Error al registrar la consulta');
            }

            // Insertar datos del solicitante
            connection.query('INSERT INTO solicitante (papellido, sapellido, nombre, tipoIdentificacion, numeroIdentificacion, genero,ciudad, fechaNacimiento, edad, lugarNacimiento, discapacidad, vulnerabilidad, direccionActual, correo, celular) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)',
                [papellido, sapellido, nombre, tipoIdentificacion, numeroIdentificacion, genero, ciudad, fechaNacimiento, edad, lugarNacimiento, discapacidad, vulnerabilidad, direccionActual, correo, celular],
                (errorSolicitante, solicitanteQuery) => {
                    if (errorSolicitante) {
                        console.error('Error al insertar datos del solicitante:', errorSolicitante);
                        return connection.rollback(() => {
                            connection.release();
                            res.status(500).send('Error al registrar la consulta del solicitante');
                        });
                    }

                    const idSolicitante = solicitanteQuery.insertId;

                    console.log('Datos del solicitante insertados correctamente.');
                    console.log('ID del solicitante:', idSolicitante);

                    // Insertar datos de la caracterización socioeconómica



                    connection.query('INSERT INTO caracterizacionsocioeconomica (nivelEstudio, estrato, sisben, oficio , nivelIngresoEconomico, actividadEconomica, idSolicitante) VALUES (?, ?,  ?, ?, ?, ?,?)',
                        [nivelEstudio, estrato, sisben, oficio, nivelIngresoEconomico, actividadEconomica, idSolicitante],
                        (errorCaracterizacion, caracterizacionQuery) => {
                            if (errorCaracterizacion) {
                                console.error('Error al insertar datos de la caracterización socioeconómica:', errorCaracterizacion);
                                return connection.rollback(() => {
                                    connection.release();
                                    res.status(500).send('Error al registrar la consulta de caracterización socioeconómica');
                                });
                            }


                            // Insertar datos del estudiante que recepciona
                            connection.query('INSERT INTO estudianterecepciona (nombreRecepciona, apellidosRecepciona, codigoRecepciona, correoRecepciona, celularRecepciona) VALUES (?, ?, ?, ?, ?)',
                                [nombreRecepciona, apellidosRecepciona, codigoRecepciona, correoRecepciona, celularRecepciona],
                                (errorRecepciona, recepcionaQuery) => {
                                    if (errorRecepciona) {
                                        console.error('Error al insertar datos del estudiante que recepciona:', errorRecepciona);
                                        return connection.rollback(() => {
                                            connection.release();
                                            res.status(500).send('Error al registrar la consulta del estudiante que recepciona');
                                        });
                                    }
                                    const idEstudianteRecepciona = recepcionaQuery.insertId;
                                    console.log('Datos del estudiante que recepciona insertados correctamente.');

                                    connection.query('INSERT INTO accionante (nombreAccionante, telefonoAccionante, correoAccionante, direccionAccionante) VALUES (?, ?, ?, ?)',
                                        [nombreAccionante, telefonoAccionante, correoAccionante, direccionAccionante],
                                        (errorAccionante, accionanteQuery) => {
                                            if (errorAccionante) {
                                                console.error('Error al insertar datos del accionante:', errorAccionante);
                                                return connection.rollback(() => {
                                                    connection.release();
                                                    res.status(500).send('Error al registrar la consulta del accionante');
                                                });
                                            }
                                            const idAccionante = accionanteQuery.insertId;

                                            console.log('Datos del accionante insertados correctamente.');
                                            console.log('ID del accionante:', idAccionante);

                                            // Insertar datos del accionado
                                            connection.query('INSERT INTO accionado (nombreAccionado, telefonoAccionado, correoAccionado, direccionAccionado) VALUES (?, ?, ?, ?)',
                                                [nombreAccionado, telefonoAccionado, correoAccionado, direccionAccionado],
                                                (errorAccionado, accionadoQuery) => {
                                                    if (errorAccionado) {
                                                        console.error('Error al insertar datos del accionado:', errorAccionado);
                                                        return connection.rollback(() => {
                                                            connection.release();
                                                            res.status(500).send('Error al registrar la consulta del accionado');
                                                        });
                                                    }

                                                    const idAccionado = accionadoQuery.insertId;

                                                    console.log('Datos del accionado insertados correctamente.');
                                                    console.log('ID del accionado:', idAccionado);

                                                    // Insertar datos de la consulta
                                                    connection.query('INSERT INTO consulta (radicado, fechaRecepcion, hechos, pretensiones, observaciones, archivoPDF, idSolicitante, idEstudianteRecepciona, idAccionante, idAccionado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? )',
                                                        [radicado, fechaRecepcion, hechos, pretensiones, observaciones, archivoBase64PDF, idSolicitante, idEstudianteRecepciona, idAccionante, idAccionado],
                                                        (errorConsulta, consultaQuery) => {
                                                            if (errorConsulta) {
                                                                console.error('Error al insertar datos de la consulta:', errorConsulta);
                                                                return connection.rollback(() => {
                                                                    connection.release();
                                                                    res.status(500).send('Error al registrar la consulta');
                                                                });
                                                            }

                                                            console.log('Consulta registrada correctamente.');

                                                            connection.commit(commitError => {
                                                                if (commitError) {
                                                                    console.error('Error al realizar el commit de la transacción:', commitError);
                                                                    return connection.rollback(() => {
                                                                        connection.release();
                                                                        res.status(500).send('Error al registrar la consulta');
                                                                    });
                                                                }

                                                                connection.release();
                                                                console.log('Consulta registrada con éxito');
                                                                res.render('registrarconsulta', { tipoCargo: tipoCargoSession, successMessage: 'Formulario enviado con éxito.' });
                                                            });
                                                        });
                                                });
                                        });
                                });
                        });
                });
        });
    });
};

module.exports = controller;