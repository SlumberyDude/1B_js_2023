import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = 'roles'; // По ключу мы сможем получать метаданные внутри гварда

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);