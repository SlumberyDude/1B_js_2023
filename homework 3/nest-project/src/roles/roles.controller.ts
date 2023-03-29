import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MinRoleValueGuard } from 'src/auth/min-roles.guard';
import { MinRoleValue } from 'src/auth/roles-auth.decorator';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { UserMaxPermission } from 'src/users/users.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { DeleteRoleDto } from './dto/delete-role.dto';
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
    @UsePipes(ValidationPipe)
    @Post()
    create(
        @Body() dto: CreateRoleDto
    ) {
        return this.roleService.createRole(dto);
    }

    // Через декораторы помечаем метод, как запрос с методом GET
    // Параметр пути в декораторе содержит плейсхолдер для значения
    // Для отлова значения в пути необходим декоратор @Param

    // Пока что без Пайпа, необходимо настроить валидацию не только объектов dto но и строк например
    @Get('/:name')
    getByName(
        @Param('name') name: string
    ) {
        return this.roleService.getRoleByName(name);
    }

    @Get()
    getAllRoles() {
        return this.roleService.getAllRoles();
    }

    @UsePipes(ValidationPipe)
    @MinRoleValue(10)
    @UseGuards(MinRoleValueGuard)
    @Delete()
    deleteByName(@Body() dto: DeleteRoleDto,
                 @UserMaxPermission() userPerm: number
    ) {
        console.log(`got user permission in delete: ${JSON.stringify(userPerm)}`);
        return this.roleService.deleteByName(dto, userPerm);
    }
}
