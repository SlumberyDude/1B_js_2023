const Router = require('../framework/Router');
const movieController = require('../controller/movie.controller');

const router = new Router();

router.post('/movie', movieController.create);
router.get('/movie', movieController.getAll);
router.get('/movie/:id', movieController.getBy('movie_id'));
router.put('/movie/:id', movieController.updateBy('movie_id'));
router.delete('/movie/:id', movieController.deleteBy('movie_id'));

module.exports = router;