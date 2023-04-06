import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../pipes/validation.pipe';
import { CreateProfileDto, RegisterProfileDto } from './dto/create-profile.dto';
import { ProfilesService } from './profiles.service';
import { AuthTokenDto } from '../auth/dto/auth.token.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './profiles.model';
import { RoleAccess } from '../auth/roles.decorator';
import { initRoles } from '../init/init.roles';
import { RolesGuard } from '../auth/roles.guard';
import { EmailUserParamDto } from '../users/dto/email.user.param.dto';
import { UsernameProfileParamDto } from './dto/username-profile.param.dto';


@ApiTags('Профиль')
@UsePipes(ValidationPipe)
@Controller('profiles')
export class ProfilesController {

    constructor(private profileService: ProfilesService) {}
    
    @ApiTags('Авторизация')
    @ApiOperation({ summary: 'Регистрация нового профиля' })
    @ApiResponse({ status: 200, type: AuthTokenDto })
    @Post('/registration')
    registration(@Body() registerProfileDto: RegisterProfileDto) {
        return this.profileService.registration(registerProfileDto);
    }

    @ApiOperation({ summary: 'Получение всех профилей' })
    @ApiResponse({ status: 200, type: [Profile] })
    @RoleAccess(initRoles.ADMIN.value)
    @UseGuards(RolesGuard)
    @Get()
    getAllProfiles() {
        return this.profileService.getAllProfiles();
    }

    // Получаю, обновляю и удаляю пользователя по email
    // Так как email привязан к User и находится в токене авторизации
    // Соответственно мы можем сделать логику проверки прав в гварде
    // Иначе придется выносить её в сервис, что наверное не совсем правильно
    // Или можно записывать username в токен авторизации, но тогда авторизация
    // Уже будет зависима от профиля, что неправильно

    @ApiOperation({ summary: 'Получение профиля по email' })
    @ApiResponse({ status: 200, type: Profile })
    @RoleAccess({minRoleVal: initRoles.ADMIN.value, allowSelf: true})
    @UseGuards(RolesGuard)
    @Get('/:email')
    getProfileByEmail(@Param(new ValidationPipe()) {email}: EmailUserParamDto) {
        return this.profileService.getProfileByEmail(email);
    }

    @ApiOperation({ summary: 'Обновление профиля по email' })
    @ApiResponse({ status: 200, type: Profile })
    @RoleAccess({minRoleVal: initRoles.ADMIN.value, allowSelf: true})
    @UseGuards(RolesGuard)
    @Put('/:email')
    updateProfileByEmail(
        @Param(new ValidationPipe()) {email}: EmailUserParamDto,
        @Body() updateProfileDto: UpdateProfileDto) {
        return this.profileService.updateProfileByEmail(email, updateProfileDto);
    }

    @ApiOperation({ summary: 'Удаление профиля по email' })
    @ApiResponse({ status: 204 })
    @RoleAccess({minRoleVal: initRoles.ADMIN.value, allowSelf: true})
    @UseGuards(RolesGuard)
    @Delete('/:email')
    deleteProfileByEmail(@Param(new ValidationPipe()) {email}: EmailUserParamDto) {
        return this.profileService.deleteProfileByEmail(email);
    }

}
