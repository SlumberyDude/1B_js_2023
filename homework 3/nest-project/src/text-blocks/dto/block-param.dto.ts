import { PickType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsString } from "class-validator";
import { CreateTextBlockDto } from "./create-textblock.dto";

export class BlockIdParamDto {
    @IsInt({message: 'Должно быть целым числом'})
    @Type(() => Number)
    readonly id: number;
}

export class BlockNameParamDto {
    @IsString({message: 'Должно быть строкой'})
    readonly name: string;
}

export class BlockGroupParamDto extends PickType(CreateTextBlockDto, ['group'] as const) {}