const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/logout', authController.logout);

router.get('/centro', (req, res) => {
    res.render('centro');
});

module.exports = router;
