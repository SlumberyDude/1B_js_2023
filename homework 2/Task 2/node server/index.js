const Application = require('./framework/Application');
// middlewares
const jsonParser = require('./framework/parseJson');
const bodyParser = require('./framework/bodyParser');
const urlParser = require('./framework/parseUrl');
// routers
const movieRouter = require('./routes/movie.routes');
const genreRouter = require('./routes/genre.routes');


const app = new Application();
const PORT = process.env.PORT || 5000;

// adding middlewares
app.use(jsonParser);
app.use(bodyParser);
app.use(urlParser(`http://localhost:${PORT}`));
// adding routes
app.addRouter(movieRouter, '/api');
app.addRouter(genreRouter, '/api');

app.listen(PORT, () => {
    console.log(`server started on ${PORT} port`);
});