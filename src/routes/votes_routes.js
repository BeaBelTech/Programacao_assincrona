const express = require('express');
const router = express.Router();
const voteController = require('../controllers/vote_controller');

router.post('/add', voteController.addVote);

router.delete('/remove', voteController.removeVote);

router.get('/getVotesByIdea/:ideaId', voteController.getVotesByIdea);

router.get('/:ideaId/count', voteController.countVotes);

module.exports = router;
