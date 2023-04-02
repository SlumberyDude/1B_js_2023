## Код для работы с профилем

Таблицы `users` и `roles` соответствуют ролику "Продвинутый BACKEND.." от Ulbi TV.

таблица **users** содержит все данные связанные с доступом:

    - email
    - password

таблица **roles** содержит данные о роли

    - name
    - value
    - description

между **users** и **roles** устанавливается связь многие-ко-многим через таблицу **user_roles**

---
Используется модуль авторизации `auth`, который зависит от модуля `users` и инкапсулирует логику авторизации на JWT токенах.

Однако, модуль не имеет эндпоинта `/registration` в контроллере, регистрация осуществляется в модуле `profile`.

---
## Модуль профиля

Имеет эндпоинт регистрации, который использует сервис модуля auth, соответственно он подключается как зависимость `authService`.

При обновлении профиля происходит обновление пользователя (для этого доступно только поле email)

Необходимо установить ограничение в правах - "*только администратор и ты сам*"". Так как у меня установлена многоуровневая система ролей, то будет условие "*только роль с правами выше администраторских (в которую также входит и владелец ресурса) и ты сам*"

Рассмотрим, как это можно реализовать.

### Реализация проверки прав
Для проверки прав роли достаточно гвадра


## Модуль пользователя
В основном будет работать как сервис для других модулей, так как доступ будет осуществляться через модуль профиля.

### Изменение пользователя


Дроп таблиц:
drop table if exists posts cascade;
drop table if exists users cascade;
drop table if exists roles cascade;
drop table if exists user_roles cascade;
drop table if exists profiles cascade;


## Тестирую Работу модуля файла.

Загружаю:

1. 
{
    "id": 6,
    "storageType": "DBSTORE",
    "essenceTable": "cat",
    "essenceId": 5,
    "originalName": "16798070514410.gif",
    "data": "Byte Array Data [11250694] byte",
    "filename": null,
    "createdAt": "2023-04-02T04:37:33.912Z"
}

2.
{
    "id": 7,
    "storageType": "DBSTORE",
    "essenceTable": "clown",
    "essenceId": 78,
    "originalName": "16797643729840.png",
    "data": "Byte Array Data [822729] byte",
    "filename": null,
    "createdAt": "2023-04-02T04:39:50.952Z"
}

3.
{
    "id": 8,
    "storageType": "FSSTORE",
    "essenceTable": "meercat",
    "essenceId": 16,
    "originalName": "16782039491820.png",
    "data": null,
    "filename": "3afb0cd1-5c38-426f-901d-1a44c45f8650.png",
    "createdAt": "2023-04-02T04:40:42.702Z"
}

4. (dog picture)
{
    "id": 9,
    "storageType": "FSSTORE",
    "essenceTable": null,
    "essenceId": null,
    "originalName": "16742108414350.jpg",
    "data": null,
    "filename": "23d22ffc-acc9-4912-ac73-c4d40bf94c16.jpg",
    "createdAt": "2023-04-02T04:41:38.785Z"
}

Загрузка файлов работает исправно.

Проверка изменения файлов.

## Изменение метаданных без изменения файла и способа хранения.

1. Исправлю данные для картинки собаки
Пусть она будет dog 13
{
    "id": 9,
    "storageType": "FSSTORE",
    "essenceTable": "dog",
    "essenceId": "13",
    "originalName": "16742108414350.jpg",
    "data": null,
    "filename": "23d22ffc-acc9-4912-ac73-c4d40bf94c16.jpg",
    "createdAt": "2023-04-02T04:41:38.785Z"
}

2. Все норм, теперь изменение файла. Поменяю картинку и id на 17
{
    "id": 9,
    "storageType": "FSSTORE",
    "essenceTable": "dog",
    "essenceId": "17",
    "originalName": "16714507603530.jpeg",
    "data": null,
    "filename": "d0d2d2e0-193a-4056-8eff-6d7419f01108.jpeg",
    "createdAt": "2023-04-02T04:41:38.785Z"
}

Все норм, картинка поменялась и запись в базе тоже, старая удалена.

3. Теперь поменяю как файл так и способ хранения FS -> DB
{
    "id": 9,
    "storageType": "DBSTORE",
    "essenceTable": "dog",
    "essenceId": 17,
    "originalName": "16794859547320.png",
    "data": "Byte Array Data [374213] byte",
    "filename": null,
    "createdAt": "2023-04-02T04:41:38.785Z"
}
Видим, что картинка теперь в базе.

Теперь в обратную сторону DB -> FS

{
    "id": 9,
    "storageType": "FSSTORE",
    "essenceTable": "dog",
    "essenceId": 17,
    "originalName": "image-13.png",
    "data": null,
    "filename": "6243e7f6-5325-4e3a-9c16-f175ef28315a.png",
    "createdAt": "2023-04-02T04:41:38.785Z"
}

Все отработало нормально, картинка в папке есть, на базе порядок.

4. Осталось проверить изменение способа хранения без изменения файла

FS -> DB
{
    "id": 9,
    "storageType": "DBSTORE",
    "essenceTable": "dog",
    "essenceId": 17,
    "originalName": "image-13.png",
    "data": "Byte Array Data [1428001] byte",
    "filename": null,
    "createdAt": "2023-04-02T04:41:38.785Z"
}

DB -> FS
{
    "id": 9,
    "storageType": "FSSTORE",
    "essenceTable": "dog",
    "essenceId": 17,
    "originalName": "image-13.png",
    "data": null,
    "filename": "d37daf98-ab57-4d5d-8ca4-20e13823dfbc.png",
    "createdAt": "2023-04-02T04:41:38.785Z"
}

При конвертациях получаю тот же файл, генерируется новое имя, во время переброски в БД все стирается.