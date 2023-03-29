import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { User } from "src/users/users.model";
import { ROLES_KEY } from "./roles-auth.decorator";


@Injectable()
export class RolesGuard implements CanActivate {

    // Для определения доступа необходимо будет использовать jwtService поэтому делаем инъекцию
    constructor(private jwtService: JwtService,
                private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const unauthorizedError = new UnauthorizedException({message: 'Пользователь не авторизован'});
        const badRoleError = new HttpException('Недостаточно прав', HttpStatus.FORBIDDEN);
        try {
            // Достаём роли
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]) // TODO: чекнуть документацию по рефлектору
            if (!requiredRoles) {
                return true;
            }
            // Достаём и декодируем jwt token, тем самым получаем поля объекта User
            // Среди которых также есть и роли
            const req = context.switchToHttp().getRequest();

            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];

            if (bearer !== 'Bearer' || !token) {
                throw unauthorizedError;
            }
            
            const user = this.jwtService.verify<User>(token);
            req.user = user;
            // Теперь ищем, есть ли у пользователя необходимая роль
            return user.roles.some(role => requiredRoles.includes(role.name));
        } catch (e) {
            throw badRoleError;
        }
    }
}