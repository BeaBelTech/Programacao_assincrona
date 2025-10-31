const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');

router.post('/registro', authController.register);
router.post('/login', authController.login);
router.get('/sair', authController.logout);

module.exports = router;
