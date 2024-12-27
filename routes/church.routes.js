const express = require('express');
const router = express.Router();
const churchController = require('../controllers/church.controller');

router.post('/add', churchController.create);
router.get('/all', churchController.findAll);
router.put('/edit/:id', churchController.update);
router.delete('/delete/:id', churchController.delete);

module.exports = router;
