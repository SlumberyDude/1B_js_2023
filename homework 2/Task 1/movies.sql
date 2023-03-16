drop table if exists person CASCADE; 
drop table if exists genre CASCADE; 
drop table if exists genre_person CASCADE; 
drop table if exists movie CASCADE; 
drop table if exists genre_movie CASCADE; 
drop table if exists actor_movie CASCADE; 
drop table if exists award CASCADE; 
drop table if exists material CASCADE; 

-- Таблица для любых людей, участвовавших в кинопроизводстве, как актеров так и режиссеров/художников
create table person (
    person_id   serial PRIMARY KEY
,   name_rus    varchar(255)
,   name_orig   varchar(255)
,   height      real
,   birthdate   date
,   birthplace  varchar(255)
,   couple_id   int REFERENCES person (person_id) 
,   image_url   text
,   info        text
);

-- Карьера, есть только у персоны
create table career(
    career_id   serial PRIMARY KEY
,   career_name varchar(255)
);

-- Связь карьеры и персоны
create table career_person(
    career_id int REFERENCES career (career_id) ON DELETE CASCADE
,   person_id int REFERENCES person (person_id) ON DELETE CASCADE
,   CONSTRAINT career_person_pkey PRIMARY KEY (career_id, person_id)
);

-- Жанр, есть у персоны и у фильма
create table genre (
    genre_id   serial PRIMARY KEY
,   genre_name varchar(255)
);

-- Связь жанра и персоны
create table genre_person (
    genre_id  int REFERENCES genre (genre_id) ON DELETE CASCADE -- При удалении жанра удалятся все его связи
,   person_id int REFERENCES person (person_id) ON DELETE CASCADE
,   CONSTRAINT genre_person_pkey PRIMARY KEY (genre_id, person_id)
);

-- Информация по фильму, возможно имеет смысл выделить несколько дополнительных таблиц one-to-one
-- для определенных данных вроде scores, budget, date, persons
create table movie (
    movie_id          serial PRIMARY KEY
,   name_rus          varchar(360)
,   name_orig         varchar(360)
,   image_url         text
,   trailer_url       text
,   info              text

,   score_orig        real
,   votes_orig        int
,   reviews_orig      int
,   score_imdb        real
,   votes_imdb        int

,   creation_year     int
,   country           varchar(127)
,   tagline           varchar(511)

,   budget            varchar(255)
,   marketing         varchar(255)
,   box_office_usa    varchar(255)
,   box_office_world  varchar(255)
,   box_office_russia varchar(255)

,   premiere_world    date
,   premiere_russia   date
,   release_dvd       date
,   release_digital   date

,   age_req           varchar(63)
,   mpaa_rating       varchar(63)

,   director_id       int
,   screenwriter_id   int
,   producer_id       int
,   operator_id       int
,   composer_id       int
,   artist_id         int
,   editor_id         int
,   CONSTRAINT fk_director     FOREIGN KEY (director_id)     REFERENCES person (person_id)
,   CONSTRAINT fk_screenwriter FOREIGN KEY (screenwriter_id) REFERENCES person (person_id)
,   CONSTRAINT fk_producer     FOREIGN KEY (producer_id)     REFERENCES person (person_id)
,   CONSTRAINT fk_operator     FOREIGN KEY (operator_id)     REFERENCES person (person_id)
,   CONSTRAINT fk_composer     FOREIGN KEY (composer_id)     REFERENCES person (person_id)
,   CONSTRAINT fk_artist       FOREIGN KEY (artist_id)       REFERENCES person (person_id)
,   CONSTRAINT fk_editor       FOREIGN KEY (editor_id)       REFERENCES person (person_id)
);

-- Связь жанра и фильма
create table genre_movie (
    genre_id int REFERENCES genre (genre_id) ON DELETE CASCADE -- При удалении жанра удалятся все его связи
,   movie_id int REFERENCES movie (movie_id) ON DELETE CASCADE
,   CONSTRAINT genre_movie_pkey PRIMARY KEY (genre_id, movie_id)
);

-- Связь фильма и персоны (возможно двух - актёра и дублёра), также определяет роль.
-- Образует связь многие-ко-многим для фильмов и актёров, фильмов и дублёров.
create table actor_movie (
    actor_id   int REFERENCES person (person_id)
,   movie_id   int REFERENCES movie (movie_id)
,   dubbing_id int
,   actor_role varchar(255)
,   CONSTRAINT actor_movie_pkey PRIMARY KEY (actor_id, movie_id)
,   CONSTRAINT fk_dubbing FOREIGN KEY (dubbing_id) REFERENCES person (person_id)
);

-- Награда, которая должна привязываться к фильму и персоне
create table award (
    award_id     serial PRIMARY KEY
,   award_name   varchar(255)
,   award_year   int
,   award_cat    varchar(255) -- best actor/best music
,   movie_id     int
,   person_id    int
,   award_status varchar(63) -- nominated/won

,   CONSTRAINT fk_movie  FOREIGN KEY (movie_id)  REFERENCES movie  (movie_id)
,   CONSTRAINT fk_person FOREIGN KEY (person_id) REFERENCES person (person_id)
);

-- Материал (фото, статья, видео, пр..). Персона или Фильм могут иметь много материалов разных типов.
create table material (
    material_id   serial PRIMARY KEY
,   material_url  text
,   material_type varchar(63) -- video/photo/article. Can be replaced by enum
,   movie_id      int
,   person_id     int
,   CONSTRAINT fk_movie  FOREIGN KEY (movie_id)  REFERENCES movie  (movie_id)
,   CONSTRAINT fk_person FOREIGN KEY (person_id) REFERENCES person (person_id)
);