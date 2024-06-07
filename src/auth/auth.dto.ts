import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { IUser } from 'src/user/user.interface';

export class AuthDto implements IUser {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
