import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

enum ErrorMessages {
  USERNAME_INVALID_ERROR = 'the username should not contain any special character except: "-" or "_"',
  MIN = 'the password needs to be 8 characters minimum',
  MAX = 'the password reach the maximum allowed',
}

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9-_]+$/, {
    message: ErrorMessages.USERNAME_INVALID_ERROR,
  })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: ErrorMessages.MIN })
  @MaxLength(30, { message: ErrorMessages.MAX })
  password: string;
}
