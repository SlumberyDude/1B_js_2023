import { createParamDecorator, ExecutionContext } from '@nestjs/common';

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

        return Math.max(...roles.map( role => role.value ));
    },  
);