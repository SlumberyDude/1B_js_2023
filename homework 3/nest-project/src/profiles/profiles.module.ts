import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/users.model';
import { UsersModule } from '../users/users.module';
import { ProfilesController } from './profiles.controller';
import { Profile } from './profiles.model';
import { ProfilesService } from './profiles.service';

@Module({
    controllers: [ProfilesController],
    providers: [ProfilesService],
    imports: [
        SequelizeModule.forFeature([User, Profile]),
        AuthModule,
        JwtModule, // Уже был зарегистрирован в модуле авторизации, используется для расшифровки токена
        UsersModule,
    ],
    exports: [
        ProfilesService
    ]
})
export class ProfilesModule {}
