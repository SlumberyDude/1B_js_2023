import { PickType } from "@nestjs/swagger";
import { CreateRoleDto } from "./create-role.dto";

export class UpdateRoleParamDto extends PickType(CreateRoleDto, ['name'] as const) {}