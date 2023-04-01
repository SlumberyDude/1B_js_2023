import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/users.model';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/roles.model';
import { UserRoles } from './roles/user-roles.model';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProfilesModule } from './profiles/profiles.module';
import { InitModule } from './init/init.module';
// import { TextBlocksModule } from './text-blocks/text-blocks.module';
import * as path from 'path';

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `${process.env.NODE_ENV}.env`
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: +process.env.POSTGRES_PORT,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User, Role, UserRoles],
            autoLoadModels: true
        }),
        ServeStaticModule.forRoot({
            rootPath: path.join(__dirname, 'static')
        }),
        UsersModule,
        RolesModule,
        AuthModule,
        ProfilesModule,
        InitModule,
        // TextBlocksModule,
        // PostsModule,
        FilesModule,
    ],
})
export class AppModule {
    constructor() {
        console.log(`root path ${path.join(__dirname, 'static')}`);
    }
}