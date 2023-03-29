import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { RegisterProfileDto } from './dto/create-profile.dto';
import { ProfilesService } from './profiles.service';

@UsePipes(ValidationPipe)
@Controller('profiles')
export class ProfilesController {

    constructor(private profileService: ProfilesService) {}
    
    @Post('/registration')
    registration(@Body() registerProfileDto: RegisterProfileDto) {
        return this.profileService.registration(registerProfileDto);
    }
}
