import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

enum ErrorMessages {
  MIN = 'the password needs to be 8 characters minimum',
  MAX = 'the password reach the maximum allowed',
}

export class ChangePasswordDto {
  @IsOptional()
  @IsEmail()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: ErrorMessages.MIN })
  @MaxLength(30, { message: ErrorMessages.MAX })
  newPassword: string;
}
