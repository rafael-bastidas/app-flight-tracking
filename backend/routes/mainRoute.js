const { Router } = require('express');
const router = Router();
const path = require('path');
const Schemas = require('../DataBase/EsquemaDB.js');

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

//Para USO personal
router.get('/db/delete/:id', async (req, res) => {
  await Schemas.Usuario.where({email: req.params.id}).update({info: []});
  res.json({"message": "Delete DATA"});
});

module.exports = router;
