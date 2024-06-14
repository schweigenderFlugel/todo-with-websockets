import { IsNotEmpty, IsEnum } from 'class-validator';
import { Role } from 'src/common/enums/roles';

export class UserDto {
  @IsNotEmpty()
  @IsEnum({ object: Role })
  role: Role;
}
