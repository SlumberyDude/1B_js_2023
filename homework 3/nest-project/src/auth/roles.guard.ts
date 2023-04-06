import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { User } from "../users/users.model";
import { RoleDecoratorParams, ROLES_KEY } from "./roles.decorator";
import { JwtService } from "@nestjs/jwt";

// Гард проверяет авторизацию пользователя, а затем уровень доступа.
// Если передан параметр allowSelf: true, то доступ дается самому пользователю
// (по своему же email), а также если он обладает ролью с администраторским уровнем доступа и выше.
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector,
                private jwtService: JwtService) {}

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        // Пытаемся достать метаданные из заголовка 
        let roleParams = this.reflector.get<RoleDecoratorParams>(
            ROLES_KEY,
            context.getHandler(),
        )
        if (!roleParams) {
            // Затем из класса
            roleParams = this.reflector.get<RoleDecoratorParams>(
                ROLES_KEY,
                context.getClass(),
            )
        }
        // Если их нет, то гвард проходит проверку (то есть даже не проверяем авторизацию)
        if (!roleParams) return true;

        // Далее необходимо проверить авторизацию (JWT token и вытащить из него полезную инфу)
        const authHeader = request.headers.authorization;

        if (!authHeader) throw new UnauthorizedException({message: 'Нет заголовка авторизации'});
        
        const bearer = authHeader.split(' ')[0] as string;
        const token = authHeader.split(' ')[1];

        if (bearer.toLowerCase() !== 'bearer' || !token) {
            throw new UnauthorizedException({message: 'Пользователь не авторизован'});
        }

        try {
            const user = this.jwtService.verify(token) as User;
            request.user = user; // сохраняем пользователя, что пригодится в методах, где для дальнейшей проверки доступа необходимо делать запросы к базе, тогда проверка происходит внутри сервиса.
            
            // Теперь используем объект пользователя для проверки ролей
            if (roleParams.allowSelf && request.params['email'] == user.email) return true;

            // console.log(`minRoleVal = ${roleParams.minRoleVal}`)
            // console.log(`userRoles = ${JSON.stringify(user.roles, undefined, 2)}`)
            if (user.roles.some( role => role.value >= roleParams.minRoleVal)) return true;

            // если с ролями не получилось, то выкидываем ошибку, которая будет сразу поймана парой строк дальше
            throw Error;

        } catch {
            throw new HttpException('Недостаточно прав', HttpStatus.FORBIDDEN);
        }
    }
}