import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './roles.model';

@Injectable()
export class RolesService {

    // Инжектим модель, чтобы иметь возможность делать записи в базу данных
    // После инъекции зависимости можно обращаться к репозиторию через this
    constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

    async createRole(dto: CreateRoleDto) {
        const role = await this.roleRepository.create(dto);
        return role;
    }

    async getRoleByName(name: string) {
        const role = await this.roleRepository.findOne({ where: {name: name} })
        return role;
    }

}
