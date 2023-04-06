import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
// import { AppModule } from './../src/app.module';
import { ProfilesModule } from './../src/profiles/profiles.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { InitModule } from './../src/init/init.module';
import * as fs from 'fs';

const testDbName = 'testdb.sqlite';


describe('e2e', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                SequelizeModule.forRoot({
                    dialect: 'sqlite',
                    // storage: ':memory:',
                    storage: testDbName,
                    autoLoadModels: true,
                    logging: false,
                    // omitNull: true,
                    // synchronize: true,
                }),
                ProfilesModule,
                InitModule
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('Пытаемся регистрировать пользователя до инициализации сервера - ошибка 418', () => {
        return request(app.getHttpServer())
            .post('/profiles/registration')
            .send({email: 'user@mail.ru', password: '123321' })
            .expect(418)
            .expect({"statusCode":418,"message":"Роль 'USER' не найдена, необходимо выполнение инициализации ресурса"});
    });

    it('Инициализируем ресурс /api/init. Создаем админа со слабым паролем - ошибка', () => {
        return request(app.getHttpServer())
            .post('/init')
            .send({email: 'admin@mail.ru', password: 'admin' })
            .expect(400)
            .expect(['password - Пароль должен иметь минимальную длину 6 символов, иметь минимум 1 строчную букву, 1 заглавную, 1 цифру и 1 спецсимвол']);
    });

    it('Инициализируем ресурс /api/init. Создаем админа с сильным паролем - успех', () => {
        return request(app.getHttpServer())
            .post('/init')
            .send({email: 'admin@mail.ru', password: 'Adm1nPa$$word' })
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty('token');
                expect(res.body.token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
            });
    });

    afterAll(async () => {
        fs.rmSync(testDbName);
        await app.close();
    });
});