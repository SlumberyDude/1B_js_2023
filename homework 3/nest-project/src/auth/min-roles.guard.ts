import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { User } from "src/users/users.model";
import { ROLES_KEY } from "./roles-auth.decorator";


@Injectable()
export class MinRoleValueGuard implements CanActivate {

    // Для определения доступа необходимо будет использовать jwtService поэтому делаем инъекцию
    constructor(private jwtService: JwtService,
                private reflector: Reflector) {}

    // По сравнению с роликом ulbi tv измению логику ролей - эндпоинт доступен для всех ролей, value которых
    // выше указанного. То есть указывается роль с минимальным value.
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const unauthorizedError = new UnauthorizedException({message: 'Пользователь не авторизован'});
        const badRoleError = new HttpException('Недостаточно прав', HttpStatus.FORBIDDEN);
        try {
            // Достаём значение минимального доступа
            const roleVal = this.reflector.getAllAndOverride<number>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ])
            if (!roleVal) {
                return true;
            }
            console.log(`\n=====\nMIN ROLE VAL:\n${roleVal}\n=====`);
            // Достаём и декодируем jwt token, тем самым получаем поля объекта User
            // Среди которых также есть и роли
            const req = context.switchToHttp().getRequest();

            // Проверим авторизацию
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];

            if (bearer !== 'Bearer' || !token) {
                throw unauthorizedError;
            }
            
            const user = this.jwtService.verify<User>(token);
            req.user = user; // Сохраняем объект пользователя в реквест, потом можно будет достать  
            // Проверим уровень доступа, что хоть какая-то роль пользователя обладает уровнем доступа выше необходимого
            return user.roles.some(role => role.value >= roleVal);
        } catch (e) {
            throw badRoleError;
        }
    }
}