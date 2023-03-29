import { Body, Controller, Get, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MinRoleValueGuard } from 'src/auth/min-roles.guard';
// import { Roles } from 'src/auth/roles-auth.decorator';
import { MinRoleValue } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto, UnbanUserDto } from './dto/ban-user.dto';
import { CreateUserDto } from './dto/create.user.dto';
import { User } from './users.model';
import { UsersService } from './users.service';

@UsePipes(ValidationPipe)
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
    @MinRoleValue(10) // Минимально необходимая роль (с минимальным уровнем прав доступа) 10 - ADMIN по умолчанию
    @UseGuards(MinRoleValueGuard)
    @Get()
    getAll() {
        return this.usersService.getAllUsers();
    }

    @ApiOperation({ summary: 'Выдача роли пользователю' })
    @ApiResponse({ status: 200 })
    @MinRoleValue(10)
    @UseGuards(MinRoleValueGuard)
    @Post('/role')
    addRole(@Body() roleDto: AddRoleDto) {
        return this.usersService.addRole(roleDto);
    }

    @ApiOperation({ summary: 'Бан пользователя' })
    @ApiResponse({ status: 200 })
    @MinRoleValue(10)
    @UseGuards(MinRoleValueGuard)
    @Post('/ban')
    banUser(@Body() banUserDto: BanUserDto) {
        return this.usersService.banUser(banUserDto);
    }

    @ApiOperation({ summary: 'Разбан пользователя' })
    @ApiResponse({ status: 200 })
    @MinRoleValue(10)
    @UseGuards(MinRoleValueGuard)
    @Post('/unban')
    unbanUser(@Body() unbanUserDto: UnbanUserDto) {
        return this.usersService.unbanUser(unbanUserDto);
    }
}
