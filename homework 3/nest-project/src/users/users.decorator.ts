import { createParamDecorator, ExecutionContext, HttpException } from '@nestjs/common';

export const UserFromReq = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },    
);

type Role = {
    id: number;
    name: string;
    value: number;
    description: string;
}

export const UserMaxPermission = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const roles: Role[] = request.user?.roles;
        if (!roles) {
            throw Error('Забыл поставить гварды, соответственно нет поля user в request');
        }

        return Math.max(...roles.map( role => role.value ));
    },  
);