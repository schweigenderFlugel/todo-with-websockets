import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsOptional,
  IsMongoId,
  ArrayMinSize,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { ObjectId } from 'mongoose';
import { ChallengeType } from './challenge-type.enum';
import { PartialType } from '@nestjs/mapped-types';

enum ErrorMessages {
  CHALLENGE_TYPE_INVALID_ERROR = 
  `challengeType must be ${ChallengeType.INDIVIDUAL}, ${ChallengeType.LONGTERM}, or ${ChallengeType.FLASH}`,
}

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  timeLimit: boolean;

  @IsNotEmpty()
  @IsEnum(ChallengeType, {
    message: ErrorMessages.CHALLENGE_TYPE_INVALID_ERROR,
  })
  challengeType: ChallengeType;

  @IsOptional()
  @IsNumber()
  limit: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @IsMongoId({ each: true })
  items: ObjectId[];
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
