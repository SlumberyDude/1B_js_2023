import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";


// Если не пометить класс декоратором, то инъекция в него JWT сервиса не сработает
// this.jwtService не будет инициализирован Nest'ом
@Injectable()
export class JwtAuthGuard implements CanActivate {

    // Для определения доступа необходимо будет использовать jwtService поэтому делаем инъекцию
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const error = new UnauthorizedException({message: 'Пользователь не авторизован'});
        try {
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];

            if (bearer !== 'Bearer' || !token) {
                throw error;
            }

            const user = this.jwtService.verify(token);
            req.user = user;
            return true;

        } catch (e) {
            throw error;
        }
    }
}