const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://manttoDB:123mantto@cluster0.4advy.mongodb.net/app_flight?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(db => console.log('DB is connected'))
  .catch(err => console.error(err));