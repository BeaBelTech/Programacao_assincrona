const express = require('express');
const router = express.Router();
const voteController = require('../controllers/vote_controller');

router.post('/vote', voteController.toggleVote);

router.get('/getVotesByIdea/:ideaId', voteController.getVotesByIdea);

router.get('/:ideaId/count', voteController.countVotes);

module.exports = router;
