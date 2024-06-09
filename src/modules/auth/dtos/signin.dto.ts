import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { IUser } from 'src/modules/user/user.interface';

export class SignInDto implements IUser {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
