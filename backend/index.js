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
setInterval(async () => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
          user: 'remotepc288@gmail.com', // generated ethereal user
          pass: '2remotepc.', // generated ethereal password
      },
    });
    // CORREO DE CONSULTAS ONLINE A PACIENTE.
    let info = await transporter.sendMail({
      from: '"Flight-Tracking" <remotepc288@gmail.com>',
      to: "rafaelbastidas93@gmail.com",
      subject: "Prueba nesima",
      html: "hola que tal",
    });
    console.log('send: ', info);
  } catch (error) {
    console.log('err: ', error);
  }
}, 10000);
//FIN PRUEBA

// Start the server
app.listen(app.get('port'),() => {
  console.log('server on port', app.get('port'));
});
