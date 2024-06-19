const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const path = require('path');
const hbs = require('handlebars');
const fs = require('fs');
const handlebars = exphbs.create({ extname: '.hbs' });
const bodyParser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
app.set('views', path.join(__dirname, 'views'));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Parsing middleware
app.use(session({
    secret: 'secreto', // Cambia esto por una cadena secreta más segura
    resave: false,
    saveUninitialized: false
}));

// Parse Application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));

// Directorio donde se encuentran los partials
const partialsDir = path.join(__dirname, 'views', 'partials');

// Función para registrar todos los partials en el directorio
fs.readdir(partialsDir, (err, files) => {
    if (err) {
        throw new Error('Error al leer el directorio de partials: ' + err);
    }

    files.forEach(file => {
        const filePath = path.join(partialsDir, file);
        const partialName = path.parse(file).name;

        // Leer el contenido del partial
        const partialContent = fs.readFileSync(filePath, 'utf8');

        // Registrar el partial
        hbs.registerPartial(partialName, partialContent);
    });

    console.log('Partials registrados correctamente.');
});

// Parse application/json
app.use(bodyParser.json());



// Static Files
app.use(express.static('public'));

// Configure el motor de plantillas Handlebars
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

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

app.use(require('./server/routes'))

app.get('/layouts/navbar', (req, res) => {
    res.render('layouts/navbar'); // Nombre del archivo Handlebars para el partial
});

// Registrar helpers personalizados
handlebars.handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

// Registrar el helper eq
handlebars.handlebars.registerHelper('eq', function (a, b) {
    return a === b;
});

app.use((req, res, next) => {
    res.locals.tipoCargo = req.session.user ? req.session.user.tipoCargo : null;
    next();
});
app.listen(port, () => console.log(`Listening on port ${port}`));
