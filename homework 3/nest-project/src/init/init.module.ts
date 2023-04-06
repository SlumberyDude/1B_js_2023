import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProfilesModule } from '../profiles/profiles.module';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';
import { InitController } from './init.controller';
import { InitService } from './init.service';

@Module({
    controllers: [InitController],
    providers: [InitService],
    imports: [
        ProfilesModule, // для регистрации владельца ресурса
        RolesModule, // для создания и проверки ролей
        UsersModule, // для addRole
        JwtModule // для получения id пользователя без необходимости менять метод регистрации
    ]
})
export class InitModule {}
