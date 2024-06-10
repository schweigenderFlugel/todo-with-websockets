import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SignInDto {
  @IsOptional()
  @IsString()
  username: string | null;

  @IsOptional()
  @IsEmail()
  email: string | null;

  @IsNotEmpty()
  @IsString()
  password: string;
}
