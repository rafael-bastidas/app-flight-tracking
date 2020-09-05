const { Router } = require('express');
const router = Router();


router.get('/', (req, res) => {
  res.json({message: 'Hello word'});
});


module.exports = router;
