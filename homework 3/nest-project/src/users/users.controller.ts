import { Body, Controller, Get, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto, UnbanUserDto } from './dto/ban-user.dto';
import { CreateUserDto } from './dto/create.user.dto';
import { User } from './users.model';
import { UsersService } from './users.service';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @ApiOperation({ summary: 'Создание пользователя' })
    @ApiResponse({ status: 200, type: User })
    @Post()
    create(@Body() userDto: CreateUserDto) {
        return this.usersService.createUser(userDto);
    }

    @ApiOperation({ summary: 'Получение всех пользователей' })
    @ApiResponse({ status: 200, type: [User] })
    @Roles('ADMIN') // Используем созданный декоратор, чтобы установить, какая роль необходима для данного эндпоинта
    @UseGuards(RolesGuard) // Заменяем JwtAuthGuard на RolesGuard, он уже включает проверку авторизации но также и проверку роли
    @Get()
    getAll() {
        return this.usersService.getAllUsers();
    }

    @ApiOperation({ summary: 'Выдача роли пользователю' })
    @ApiResponse({ status: 200 })
    @Roles('ADMIN') // Используем созданный декоратор, чтобы установить, какая роль необходима для данного эндпоинта
    @UseGuards(RolesGuard) // Заменяем JwtAuthGuard на RolesGuard, он уже включает проверку авторизации но также и проверку роли
    @Post('/role')
    addRole(@Body() roleDto: AddRoleDto) {
        return this.usersService.addRole(roleDto);
    }

    @ApiOperation({ summary: 'Бан пользователя' })
    @ApiResponse({ status: 200 })
    @Roles('ADMIN') // Используем созданный декоратор, чтобы установить, какая роль необходима для данного эндпоинта
    @UseGuards(RolesGuard) // Заменяем JwtAuthGuard на RolesGuard, он уже включает проверку авторизации но также и проверку роли
    @Post('/ban')
    banUser(@Body() banUserDto: BanUserDto) {
        return this.usersService.banUser(banUserDto);
    }

    @ApiOperation({ summary: 'Разбан пользователя' })
    @ApiResponse({ status: 200 })
    @Roles('ADMIN') // Используем созданный декоратор, чтобы установить, какая роль необходима для данного эндпоинта
    @UseGuards(RolesGuard) // Заменяем JwtAuthGuard на RolesGuard, он уже включает проверку авторизации но также и проверку роли
    @Post('/unban')
    unbanUser(@Body() unbanUserDto: UnbanUserDto) {
        return this.usersService.unbanUser(unbanUserDto);
    }
}
