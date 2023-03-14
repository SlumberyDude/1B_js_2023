const Router = require('../framework/Router');
const Controller = require('../controller/controller')

const genreController = new Controller('genre');
const router = new Router();

router.post('/genre', genreController.create);
router.get('/genre', genreController.getAll);
router.get('/genre/:id', genreController.getBy('genre_id'));
router.put('/genre/:id', genreController.updateBy('genre_id'));
router.delete('/genre/:id', genreController.deleteBy('genre_id'));

module.exports = router;