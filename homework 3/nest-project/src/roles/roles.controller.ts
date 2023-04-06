import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../pipes/validation.pipe';
import { UserMaxPermission } from '../users/users.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { DeleteRoleDto } from './dto/delete-role.dto';
import { UpdateRoleParamDto } from './dto/update-role-param.dto';
import { RolesService } from './roles.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { initRoles } from '../init/init.roles';
import { RoleAccess } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

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
    @RoleAccess(initRoles['ADMIN'].value)
    @UseGuards(RolesGuard)
    @Post()
    create(
        @Body() dto: CreateRoleDto,
        @UserMaxPermission() userPerm: number
    ) {
        return this.roleService.createRole(dto, userPerm);
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
    @RoleAccess(initRoles['ADMIN'].value)
    @UseGuards(RolesGuard)
    @Delete()
    deleteByName(@Body() dto: DeleteRoleDto,
                 @UserMaxPermission() userPerm: number
    ) {
        return this.roleService.deleteByName(dto, userPerm);
    }


    @UsePipes(ValidationPipe)
    @RoleAccess(initRoles['ADMIN'].value)
    @UseGuards(RolesGuard)
    @Put('/:name')
    updateRole(@Param(new ValidationPipe()) {name: name}: UpdateRoleParamDto,
               @Body() updateDto: UpdateRoleDto,
               @UserMaxPermission() userPerm: number
    ) {
        return this.roleService.updateByName(name, updateDto, userPerm);
    }
}
