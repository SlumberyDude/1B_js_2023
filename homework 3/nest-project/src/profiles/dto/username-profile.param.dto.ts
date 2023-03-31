import { PickType } from "@nestjs/swagger";
import { CreateProfileDto } from "./create-profile.dto";

export class UsernameProfileParamDto extends PickType(CreateProfileDto, ['username'] as const) {}