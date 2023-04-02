import { Type } from "class-transformer";
import { IsInt } from "class-validator";

export class FileIdParamDto {
    @IsInt({message: 'Должно быть целым числом'})
    @Type(() => Number)
    id: number;
}