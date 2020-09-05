const { Router } = require('express');
const router = Router();
const path = require('path');

router.get('/', (req, res) => {
  res.sendFile(path.resolve('./backend/public/' + 'index.html'));
});


module.exports = router;
