const express = require('express');
const router = express.Router();
const ideaController = require('../controllers/idea_controller');

router.get('/create', (req, res) => {
    res.render('create');
});

router.post('/create', ideaController.createIdea);
router.get('/centro', ideaController.getAllIdeas);
router.get('/get/:id', ideaController.getIdeaById);
router.put('/update/:id', ideaController.updateIdea);

router.delete('/delete/:id', ideaController.deleteIdea);
router.get('/user/getByUserId/:userId', ideaController.getIdeasByUser);

module.exports = router;
