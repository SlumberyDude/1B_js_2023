import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';

@ApiTags('Роли')
@Controller('roles')
export class RolesController {
    // В контроллер внедряем зависимость сервиса. Декораторы не используются (почему ?)
    constructor(private roleService: RolesService) {}

    // Через декораторы помечаем метод, как запрос с методом POST
    // Параметр пути в декораторе отсутствует, то есть он будет проходить на родительский рут /roles
    // Также параметром метода является тело определенного вида, что выражается в
    // наличии декоратора и определенного типа объекта данных
    @Post()
    create(
        @Body() dto: CreateRoleDto
    ) {
        return this.roleService.createRole(dto);
    }

    // Через декораторы помечаем метод, как запрос с методом GET
    // Параметр пути в декораторе содержит плейсхолдер для значения
    // Для отлова значения в пути необходим декоратор @Param
    @Get('/:name')
    getByName(
        @Param('name') name: string
    ) {
        return this.roleService.getRoleByName(name);
    }
}
