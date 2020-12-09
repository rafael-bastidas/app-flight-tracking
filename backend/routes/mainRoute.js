const { Router } = require('express');
const router = Router();
const path = require('path');
const Schemas = require('../DataBase/EsquemaDB.js');
const nodemailer = require("nodemailer");

router.get('/', (req, res) => {
  res.sendFile(path.resolve('./backend/public/' + 'index.html'));
});

router.post('/db', async (req, res) => {
  const usuarioID = req.body;
  console.log(usuarioID);
  const visit = new Schemas.Usuario(usuarioID);
  await visit.save();
  res.json({"message": "User Inserted"});
});

router.get('/db/:id', async (req, res) => {
  const usuario = await Schemas.Usuario.find({'email': req.params.id});
  res.json(usuario);
});

router.post('/db/update', async (req, res) => {
  const dataUser = req.body;
  const usuario = await Schemas.Usuario.find({'email': dataUser.email});
  console.log(usuario[0].info.length);
  usuario[0].info[usuario[0].info.length] = { departure: dataUser.info.departure, arrival: dataUser.info.arrival, airline: dataUser.info.airline, flight: dataUser.info.flight, index: usuario[0].info.length};
  console.log(usuario[0].info);
  await Schemas.Usuario.where({email: dataUser.email}).update({info: usuario[0].info});
  res.json({"message": "User Update"});
});

router.post('/db/delete', async (req, res) => {
  let arrayAux = [];
  const dataUser = req.body;
  console.log(dataUser);
  const usuario = await Schemas.Usuario.find({'email': dataUser.email});
  usuario[0].info.forEach(element => {
    if(element.index !== dataUser.index){
      arrayAux[arrayAux.length] = {departure: element.departure, arrival: element.arrival, airline: element.airline, flight: element.flight, index: arrayAux.length};
    }
  });
  await Schemas.Usuario.where({email: dataUser.email}).update({info: arrayAux});
  res.json({"message": "User Update"});
});

router.post('/sendMail', async (req, res) => {
  const dataUser = req.body;
  console.log(dataUser);

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "mail.atpendocrina.com",
        port: 465,
        secure: true,
        auth: {
            user: 'flight@atpendocrina.com', // generated ethereal user
            pass: 'ri+0S!JF&r#G', // generated ethereal password
        },
      });
    
      try {
        // CORREO DE CONSULTAS ONLINE A PACIENTE.
        let info = await transporter.sendMail({
          from: '"Flight-Tracking" <flight@atpendocrina.com>',
          to: dataUser.email,
          subject: "ACTUALIZACIÓN DE INFORMACIÓN DE VUELOS",
          html: dataUser.msgHtml,
        });
        console.log('send: ', info);
      } catch (error) {
        console.log('err: ', error);
      }
  
      setInterval(async () => {
        console.log('Enviando actualizacion...');
        try {
          // CORREO DE CONSULTAS ONLINE A PACIENTE.
          let info = await transporter.sendMail({
            from: '"Flight-Tracking" <flight@atpendocrina.com>',
            to: dataUser.email,
            subject: "ACTUALIZACIÓN DE INFORMACIÓN DE VUELOS",
            html: dataUser.msgHtml,
          });
          console.log('send: ', info);
        } catch (error) {
          console.log('err: ', error);
        }
      }, 1800000);

  res.json({"message": "message send"});
});

//Para USO personal
router.get('/db/delete/:id', async (req, res) => {
  await Schemas.Usuario.where({email: req.params.id}).update({info: []});
  res.json({"message": "Delete DATA"});
});

module.exports = router;
