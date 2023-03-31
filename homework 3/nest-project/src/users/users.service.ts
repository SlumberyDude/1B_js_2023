import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from 'src/roles/roles.model';
import { RolesService } from 'src/roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto, UnbanUserDto } from './dto/ban-user.dto';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {

    // Сервис должен работать с таблицей пользователя, поэтому
    // делаем инъекцию модели пользователя (которая по декоратору связана с таблицей)
    // Также необходимо иметь доступ к работе с таблицей ролей, но делать это уже будем
    // не напрямую с моделью ролей, а через сервис ролей, поэтому подключаем и его но уже без декоратора
    // Для того, чтобы работать с сервисом из другого модуля импортируем модуль в файле модулей
    constructor(
        @InjectModel(User) private userRepository: typeof User,
                           private roleService: RolesService) {}

    async createUser(dto: CreateUserDto) {
        const role = await this.roleService.getRoleByName('USER');

        if (role === null) { throw new HttpException(
            "Роль 'USER' не найдена, необходимо выполнение инициализации ресурса",
            HttpStatus.NOT_FOUND
        )}

        const user = await this.userRepository.create(dto);
        await user.$set('roles', [role.id]); // $set позволяет изменить объект и сразу обновить его в базе

        user.roles = [role];
        return user;
    }

    async getAllUsers() {
        const users = await this.userRepository.findAll({ include: {all: true} });
        return users;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({ where: {email: email}, include: {all: true} });
        return user;
    }

    async updateUserByEmail(email: string, dto: UpdateUserDto) {
        const user = await this.userRepository.findOne({where: {email}});

        if (!user) {
            throw new HttpException(`Пользователя с email ${email} не существует`, HttpStatus.NOT_FOUND);
        }

        await user.update(dto);
        return user;
    }

    async deleteUserByEmail(email: string) {
        const user = await this.userRepository.findOne({where: {email}});

        if (!user) {
            throw new HttpException(`Пользователя с email ${email} не существует`, HttpStatus.NOT_FOUND);
        }

        await user.destroy();
    }

    async addRole(dto: AddRoleDto) {
        const role = await this.roleService.getRoleByName(dto.roleName);
        const user = await this.userRepository.findByPk(dto.userId);

        if (role && user) {
            await user.$add('roles', role.id);
            return dto;
        }
        
        throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
    }

    // async banUser(dto: BanUserDto) {
    //     const user = await this.userRepository.findByPk(dto.userId);
    //     if (!user) {
    //         return new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    //     }
    //     user.banned = true;
    //     user.banReason = dto.banReason;
    //     await user.save();
    //     return user;
    // }

    // async unbanUser(dto: UnbanUserDto) {
    //     const user = await this.userRepository.findByPk(dto.userId);
    //     if (!user) {
    //         return new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    //     }
    //     user.banned = false;
    //     user.banReason = null;
    //     await user.save();
    //     return user;
    // }

}
