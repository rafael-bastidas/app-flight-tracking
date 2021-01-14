const { Router } = require('express');
const router = Router();
const path = require('path');
const Schemas = require('../DataBase/EsquemaDB.js');
const nodemailer = require("nodemailer");
const axios = require('axios');

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
  const usuario = await Schemas.Usuario.find({});
  console.log(usuario);
  let count;
  let dataFligth;
  let msgHTML;

  for (let index = 0; index < usuario.length; index++) {
    const dataUser = usuario[index].info;
    
    //Inicia el FOR para revisar la INFO de cada USUARIO
    msgHTML = "<h1>Informe de vuelos:</h1><br>";
    count = 0;
    for (let i = 0; i < dataUser.length; i++) {
      //INICIO DE PETICION
      dataFligth = await axios.get(`https://aviation-edge.com/v2/public/timetable?key=8af1a5-06b638&iataCode=${dataUser[i].departure}&type=departure`);
      //FIN DE PETICION
      if (typeof dataFligth[0] !== 'undefined'){
        count = 0;
        dataFligth.forEach(element => {
          if(element.flight.number === dataUser[i].flight && element.airline.icaoCode === dataUser[i].airline && element.departure.iataCode === dataUser[i].departure && element.arrival.iataCode === dataUser[i].arrival){
            console.log({
              Vuelo: element.flight.number,
              Aerolinea: element.airline.name,
              Salida: element.departure.iataCode,
              Hrs_Salida: element.departure.scheduledTime,
              Llegada: dataUser[i].arrival,
              Hrs_Llegada: element.arrival.scheduledTime,
              Estado: element.status,
              User: usuario[index].name,
              Email: usuario[index].email});
              msgHTML += "<h3>Vuelo: "+element.flight.number+", Estado: "+element.status+"</h3><br>";
          } else {
            count++;
            if (dataFligth.length === count){
              console.log('El Vuelo', dataUser[i].flight, 'ya no esta en la tabla TIMESTABLES de aviation-edge.comya', count, dataFligth.length);
              console.log({
                Vuelo: dataUser[i].flight,
                Aerolinea: dataUser[i].airline,
                Salida: dataUser[i].departure,
                Hrs_Salida: '---',
                Llegada: dataUser[i].arrival,
                Hrs_Llegada: '---',
                Estado: 'unknown',
                User: usuario[index].name,
                Email: usuario[index].email});
                msgHTML += "<h3>El Vuelo: "+dataUser[i].flight+", ya aterrizo</h3><br>";
            }
          }
        });
      } else {
        console.log('Error de busqueda: El Vuelo', dataUser[i].flight, 'no tiene ninguna coincidencia de busqueda.');
        console.log({
          Vuelo: dataUser[i].flight,
          Aerolinea: dataUser[i].airline,
          Salida: dataUser[i].departure,
          Hrs_Salida: '---',
          Llegada: dataUser[i].arrival,
          Hrs_Llegada: '---',
          Estado: 'unknown',
          User: usuario[index].name,
          Email: usuario[index].email});
          msgHTML += "<h3>El Vuelo: "+dataUser[i].flight+", ya aterrizo</h3><br>";
      }
    } //Fin del for INterno
    //SE ENVIA LOS MESNAJES A CADA USUARIO.
    if (dataUser.length > 0) {
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
        let info = await transporter.sendMail({
          from: '"Flight-Tracking" <flight@atpendocrina.com>',
          to: usuario[index].email,
          subject: "ACTUALIZACIÓN DE INFORMACIÓN DE VUELOS",
          html: msgHTML,
        });
        console.log('send: ', info);
      } catch (error) {
        console.log('err: ', error);
      }
    }
    //FIN DE ENVIO DE LOS MESNAJES A CADA USUARIO.
  } //Fin del for EXterno

  res.json({"message": "message send"});
});

//Para USO personal
router.get('/db/delete/:id', async (req, res) => {
  await Schemas.Usuario.where({email: req.params.id}).update({info: []});
  res.json({"message": "Delete DATA"});
});

module.exports = router;
