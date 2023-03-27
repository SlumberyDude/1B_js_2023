import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt'

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        forwardRef(() => UsersModule), // Используем для доступа к сервису пользователей. Разрешаем кольцевую зависимость
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY ?? "SECRET",
            signOptions: {
                expiresIn: '24h'
            }
        })
    ],
    exports: [
        AuthService, JwtModule
    ]
})
export class AuthModule {}
