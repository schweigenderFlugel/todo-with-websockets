import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

enum ErrorMessages {
  MIN = 'the password needs to be 8 characters minimum',
  MAX = 'the password reach the maximum allowed',
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: ErrorMessages.MIN })
  @MaxLength(30, { message: ErrorMessages.MAX })
  newPassword: string;
}
