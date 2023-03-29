import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = 'roles'; // По ключу мы сможем получать метаданные внутри гварда

// export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles); // перечисляем роли в декораторе
export const MinRoleValue = (roleVal: number) => SetMetadata(ROLES_KEY, roleVal); // пробрасываем одну роль с наименьшим необходимым уровнем доступаs