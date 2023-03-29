import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/users.model';
import { ProfilesController } from './profiles.controller';
import { Profile } from './profiles.model';
import { ProfilesService } from './profiles.service';

@Module({
    controllers: [ProfilesController],
    providers: [ProfilesService],
    imports: [
        SequelizeModule.forFeature([User, Profile]),
        AuthModule,
        JwtModule // Уже был зарегистрирован в модуле авторизации, используется для расшифровки токена
    ],
    exports: [
        ProfilesService
    ]
})
export class ProfilesModule {}
