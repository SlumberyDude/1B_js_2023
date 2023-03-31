import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProfileDto, RegisterProfileDto } from './dto/create-profile.dto';
import { Profile } from './profiles.model';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create.user.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {

    constructor(@InjectModel(Profile) private profileRepository: typeof Profile,
                                      private authService: AuthService,
                                      private jwtService: JwtService,
                                      private userService: UsersService) {}

    async registration(registerProfileDto: RegisterProfileDto) {
        // Зарегистрируем пользователя пройдя через сервис авторизации, который в свою очередь 
        // дергает сервис пользователя. Сервис авторизации создает пользователя и отдает его данные в виде токена
        // что я не хочу менять, так как придется менять интерфейс авторизации и нарушать стандарты.
        const tokenObj = await this.authService.registration(registerProfileDto);
        // Нам нужен user_id, поэтому придется распаковать объект токена
        const user_id = this.jwtService.decode(tokenObj.token)['id'];
        // console.log(`userObj: ${JSON.stringify(userObj)}`);
        await this.createProfile({...registerProfileDto, user_id: user_id});
        return tokenObj;
    }


    private async createProfile(createProfileDto: CreateProfileDto) {
        // console.log(`createProfileDto: ${JSON.stringify(createProfileDto)}`);
        return await this.profileRepository.create(createProfileDto)
    }

    async getAllProfiles() {
        return await this.profileRepository.findAll({
            include: {all: true, nested: true},
        });
    }

    async getProfileByEmail(email: string) {
        const user = await this.userService.getUserByEmail(email);

        if (!user) {
            throw new HttpException(`Нет пользователя с email ${email}`, HttpStatus.NOT_FOUND);
        }

        return await this.profileRepository.findOne({
            where: {user_id: user.id}, 
            include: {all: true, nested: true},
        });
    }

    async updateProfileByEmail(email: string, updateProfileDto: UpdateProfileDto) {
        const profile = await this.getProfileByEmail(email);
        await profile.update(updateProfileDto);
        return profile
    }

    async deleteProfileByEmail(email: string) {
        const user = await this.userService.getUserByEmail(email);

        if (!user) return;

        const profile = await this.profileRepository.findOne({ where: {user_id: user.id} });

        await profile.destroy();

        await this.userService.deleteUserByEmail(email);
    }
}
