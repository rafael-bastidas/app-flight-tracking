const morgan = require('morgan');
const express = require('express');
const path = require('path');
//const cors = require('cors');

//Initializations
const app = express();

//Setting
app.set('port', 4000);

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
//app.use(cors());

//Routes
app.use('/', require('./routes/mainRoute'));

//Static files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(app.get('port'),() => {
  console.log('server on port', app.get('port'));
});
