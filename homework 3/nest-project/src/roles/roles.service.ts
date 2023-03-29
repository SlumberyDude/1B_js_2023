import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { CreateRoleDto } from './dto/create-role.dto';
import { DeleteRoleDto } from './dto/delete-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './roles.model';

@Injectable()
export class RolesService {

    // Инжектим модель, чтобы иметь возможность делать записи в базу данных
    // После инъекции зависимости можно обращаться к репозиторию через this
    constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

    async createRole(dto: CreateRoleDto) {
        try {
            const role = await this.roleRepository.create(dto);
            return role;
        } catch (error) {
            throw new HttpException('Ошибка при создании роли (роль уже существует)', HttpStatus.CONFLICT);
        }
    }

    async getRoleByName(name: string) {
        const role = await this.roleRepository.findOne({ where: {name: name} })
        return role;
    }

    async getAllRoles() {
        const roles = await this.roleRepository.findAll();
        return roles;
    }

    async deleteByName(dto: DeleteRoleDto, userPerm: number) {
        const role = await this.roleRepository.findOne({where: {name: dto.name}});
        if (role) {
            // Проверим, что пользователь вправе удалить роль
            if (userPerm <= role.value) {
                throw new HttpException('Недостаточно прав', HttpStatus.FORBIDDEN);
            }
            role.destroy();
            return;
        }
        throw new HttpException('Роли с таким именем не существует', HttpStatus.NOT_FOUND);
    }

    async updateByName(name: string, dto: UpdateRoleDto, userPerm: number) {
        console.log(`update role with name ${name}`)
        const role = await this.roleRepository.findOne({where: {name: name}});
        console.log(`find role ${JSON.stringify(role)}`)
        if (role) {
            if (userPerm <= role.value) {
                throw new HttpException('Недостаточно прав', HttpStatus.FORBIDDEN);
            }
            role.update(dto);
            return role;
        }
        throw new HttpException('Роли с таким именем не существует', HttpStatus.NOT_FOUND);
    }

}
