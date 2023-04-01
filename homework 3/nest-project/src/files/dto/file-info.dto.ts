import { ApiProperty } from "@nestjs/swagger";
import { CreateFileDto } from "./create-file.dto";

export class FileInfoDto extends CreateFileDto {

    @ApiProperty({ example: 'grumpy_cat.jpg', description: 'Имя загруженного файла' })
    originalName: string

    @ApiProperty({ example: '481516', description: 'Размер файла в байтах' })
    dataLengthBytes: number;
}