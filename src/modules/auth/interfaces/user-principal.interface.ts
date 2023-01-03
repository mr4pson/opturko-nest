import { RoleType } from 'src/modules/shared/enum/role-type.enum';

export interface UserPrincipal {
  readonly id: number;
  readonly username: string;
  readonly fullName: string;
  readonly login: string;
  readonly role: RoleType;
}
