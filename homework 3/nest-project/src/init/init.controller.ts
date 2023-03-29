import { Body, Controller, Post } from '@nestjs/common';
import { InitDto } from './dto/init.dto';
import { InitService } from './init.service';

@Controller('init')
export class InitController {

    constructor(private initService: InitService) {}

    @Post()
    createAdminAndRoles(@Body() initDto: InitDto) {
        return this.initService.createAdminAndRoles(initDto);
    }
    
}
