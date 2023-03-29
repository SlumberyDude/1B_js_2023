## Код для работы с профилем

Таблицы `users` и `roles` соответствуют ролику "Продвинутый BACKEND.." от Ulbi TV.

таблица **users** содержит все данные связанные с доступом:

    - email
    - password
    - banned
    - banReason

таблица **roles** содержит данные о роли

    - value
    - description

между **users** и **roles** устанавливается связь многие-ко-многим через таблицу **user_roles**

---
Используется модуль авторизации `auth`, который зависит от модуля `users` и инкапсулирует логику авторизации на JWT токенах.

Однако, модуль не имеет эндпоинта `/registration` в контроллере, регистрация осуществляется в модуле `profile`.

---
## Модуль профиля

Имеет эндпоинт регистрации, который использует сервис модуля auth, соответственно он подключается как зависимость `authService`


Дроп таблиц:
drop table if exists posts cascade;
drop table if exists users cascade;
drop table if exists roles cascade;
drop table if exists user_roles cascade;
drop table if exists profiles cascade;


