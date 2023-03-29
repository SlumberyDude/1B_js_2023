import { Body, Controller, Post } from '@nestjs/common';
import { RegisterProfileDto } from './dto/create-profile.dto';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {

    constructor(private profileService: ProfilesService) {}
    
    @Post('/registration')
    registration(@Body() registerProfileDto: RegisterProfileDto) {
        return this.profileService.registration(registerProfileDto);
    }
}
