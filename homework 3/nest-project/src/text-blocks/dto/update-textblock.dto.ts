import { PartialType } from "@nestjs/swagger";
import { CreateTextBlockDto } from "./create-textblock.dto";

export class UpdateTextBlockDto extends PartialType(CreateTextBlockDto) {}