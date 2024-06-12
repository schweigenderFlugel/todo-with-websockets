import { IsString, IsNotEmpty, Matches } from 'class-validator';

enum ErrorMessages {
  INVALID_ERROR = 'the username should not contain any number or special character',
  MIN = 'the password needs to be 8 characters minimum',
  MAX = 'the password reach the maximum allowed',
}

export class ProfileDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z]+$/, {
    message: ErrorMessages.INVALID_ERROR,
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
