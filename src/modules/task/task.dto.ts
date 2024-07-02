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
  @IsEnum(ChallengeType)
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
