const express = require('express');
const router = express.Router();
const churchController = require('../controllers/church.controller');

router.post('/', churchController.create);
router.get('/all', churchController.findAll);
router.put('/:id', churchController.update);
router.delete('/:id', churchController.delete);

module.exports = router;
