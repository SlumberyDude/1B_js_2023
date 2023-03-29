import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProfilesService } from 'src/profiles/profiles.service';
import { RolesService } from 'src/roles/roles.service';
import { UsersService } from 'src/users/users.service';
import { InitDto } from './dto/init.dto';

@Injectable()
export class InitService {

    constructor(private roleService: RolesService,
                private profileService: ProfilesService,
                private userService: UsersService,
                private jwtService: JwtService ) {}

    async createAdminAndRoles(initDto: InitDto): Promise<{ token: string; }> {
        // Метод должен быть вызван только единожды, поэтому проверяем, есть ли уже роль OWNER и как следствие главный админ
        const hasOwner = await this.roleService.getRoleByName('OWNER');
        if (hasOwner) {
            throw new HttpException('Инициализация уже была выполнена, невозможен повторный вызов', HttpStatus.FORBIDDEN);
        }
        // Создаём 3 базовые роли - USER, ADMIN и OWNER
        await this.roleService.createRole({name: 'USER', value: 1, description: 'Базовый пользователь'});
        await this.roleService.createRole({name: 'ADMIN', value: 10, description: 'Базовый администратор'});
        await this.roleService.createRole({name: 'OWNER', value: 999, description: 'Владелец ресурса'});
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
        await this.userService.addRole({userId: ownerId, roleName: 'OWNER'});
        return tokenObj;
    }
}
