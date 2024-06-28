import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, Matches, IsOptional } from 'class-validator';
import { ObjectId } from 'mongoose';
import { IsObjectId } from 'src/common/constraints/object-id.constraint';

enum ErrorMessages {
  INVALID_NAME_ERROR = 'the name should not contain any number or special character',
  INVALID_LASTNAME_ERROR = 'the lastname should not contain any number or special character',
  MIN = 'the password needs to be 8 characters minimum',
  MAX = 'the password reach the maximum allowed',
}

export class CreateProfileDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z]+$/, {
    message: ErrorMessages.INVALID_NAME_ERROR,
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z]+$/, {
    message: ErrorMessages.INVALID_LASTNAME_ERROR,
  })
  lastname: string;

  @IsOptional()
  @IsString()
  description: string;
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  @IsOptional()
  @IsObjectId()
  task: ObjectId;
}
