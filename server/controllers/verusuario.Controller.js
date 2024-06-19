const controller = {};
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

// Función para obtener todos los usuarios
controller.obtenerUsuarios = (req, res) => {

    const tipoCargo = req.session.user ? req.session.user.tipoCargo : null;
    const id = req.params.id;


    pool.query('SELECT * FROM user', (error, results) => {
        if (error) {
            console.error('Error al obtener datos de la base de datos:', error);
            res.status(500).send('Error al obtener datos de la base de datos');
            return;
        }

        res.render('verusuario', { usuarios: results, tipoCargo });
    });
};

// Función para eliminar un usuario
controller.eliminarUsuario = (req, res) => {
    const userId = req.params.id;
    console.log(`Intentando eliminar usuario con ID: ${userId}`); // Log para depuración

    pool.query('DELETE FROM user WHERE id = ?', [userId], (error, results) => {
        if (error) {
            console.error('Error al eliminar usuario:', error);
            res.status(500).send('Error al eliminar usuario');
            return;
        }

        if (results.affectedRows === 0) {
            console.log('No se encontró el usuario con el ID proporcionado');
            res.status(404).send('Usuario no encontrado');
            return;
        }

        console.log('Usuario eliminado correctamente');
        res.status(200).send('Usuario eliminado correctamente');
    });
};

// Controlador para actualizar un usuario por ID
controller.actualizarUsuario = (req, res) => {
    const id = req.params.id;
    const { nombres, apellidos, tipoCargo, correo, areaDerecho, codigo, usuario, contrasena } = req.body;
    const sql = 'UPDATE user SET nombres = ?, apellidos = ?, tipoCargo = ?, correo = ?, areaDerecho = ?, codigo = ?, usuario = ?, contrasena = ? WHERE id = ?';
    const values = [nombres, apellidos, tipoCargo, correo, areaDerecho, codigo, usuario, contrasena, id];
    pool.query(sql, values, (error, results) => {
        if (error) {
            console.error('Error al actualizar usuario:', error);
            res.status(500).send('Error al actualizar usuario');
        } else {
            res.status(200).send({ success: true });
        }
    });
};

// Controlador para obtener un usuario por ID y renderizar la vista de edición
controller.obtenerUsuarioPorId = (req, res) => {
    const tipoCargo = req.session.user ? req.session.user.tipoCargo : null;
    const id = req.params.id;
    pool.query('SELECT * FROM user WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error('Error al obtener usuario:', error);
            res.status(500).send('Error al obtener usuario');
        } else if (results.length === 0) {
            res.status(404).send('Usuario no encontrado');
        } else {
            const usuario = results[0];
            res.render('editarusuario', { tipoCargo, usuario });
        }
    });
};


module.exports = controller;

