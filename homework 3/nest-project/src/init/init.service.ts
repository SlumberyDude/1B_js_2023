import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProfilesService } from 'src/profiles/profiles.service';
import { RolesService } from 'src/roles/roles.service';
import { UsersService } from 'src/users/users.service';
import { InitDto } from './dto/init.dto';
import { initRoles } from './init.roles';

@Injectable()
export class InitService {

    constructor(private roleService: RolesService,
                private profileService: ProfilesService,
                private userService: UsersService,
                private jwtService: JwtService ) {}

    async createAdminAndRoles(initDto: InitDto): Promise<{ token: string; }> {
        // Метод должен быть вызван только единожды, поэтому проверяем, есть ли уже роль OWNER и как следствие главный админ
        const hasOwner = await this.roleService.getRoleByName(initRoles['OWNER'].name);
        if (hasOwner) {
            throw new HttpException('Инициализация уже была выполнена, невозможен повторный вызов', HttpStatus.FORBIDDEN);
        }
        // Создаём 3 базовые роли - USER, ADMIN и OWNER
        await this.roleService.createRole(initRoles['USER']);
        await this.roleService.createRole(initRoles['ADMIN']);
        await this.roleService.createRole(initRoles['OWNER']);
        // Зарегистрируем владельца ресурса
        const tokenObj = await this.profileService.registration({
            email: initDto.email,
            password: initDto.password,
            username: 'owner',
            social: ''
        })
        // Необходимо знать, какой у него id в базе
        const ownerId = this.jwtService.decode(tokenObj.token)['id'];
        // Присвоим владельцу ресурса соответствующую роль
        await this.userService.addRole({userId: ownerId, roleName: initRoles['OWNER'].name});
        return tokenObj;
    }
}
