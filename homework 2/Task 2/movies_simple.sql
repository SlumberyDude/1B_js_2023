-- Код создания таблиц упрощенной БД для CRUD сервера на node js.
-- Используется отношение один-ко-многим, по условию у каждого фильма может быть несколько жанров

DROP TABLE IF EXISTS genre CASCADE;
DROP TABLE IF EXISTS movie CASCADE;

CREATE TABLE movie (
    movie_id     serial PRIMARY KEY
,   movie_name   varchar(255) NOT NULL
,   release_year int
);

CREATE TABLE genre (
    genre_id   serial PRIMARY KEY
,   genre_name varchar(255) NOT NULL
,   movie_id   int NOT NULL
,   CONSTRAINT fk_movie FOREIGN KEY (movie_id) REFERENCES movie(movie_id) ON DELETE CASCADE
,   UNIQUE (movie_id, genre_name) -- нельзя добавить фильму один и тот же жанр дважды
);