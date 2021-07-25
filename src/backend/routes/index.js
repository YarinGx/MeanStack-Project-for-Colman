const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/scrap', require('./scraps'));
router.use('/reviews', require('./reviews'));

module.exports = router;
