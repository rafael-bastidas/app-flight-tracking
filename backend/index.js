const morgan = require('morgan');
const express = require('express');
const path = require('path');
const cors = require('cors');
const nodemailer = require("nodemailer");

//Initializations
const app = express();
require('./DataBase/conectionDB.js');

//Setting
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

//Routes
app.use('/', require('./routes/mainRoute'));

//Static files
app.use(express.static(path.join(__dirname, 'public')));

//PRUEBA

//FIN PRUEBA

// Start the server
app.listen(app.get('port'),() => {
  console.log('server on port', app.get('port'));
});

//Cliente ID: 253180086978-l94m00cmc73d885pj81tultb9aa47f3l.apps.googleusercontent.com
//Password: xIBoavidbWgrdxnjRyQGLgdI
// flight@atpendocrina.com / ri+0S!JF&r#G
