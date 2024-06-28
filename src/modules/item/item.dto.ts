import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsArray()
  requirements: string[];

  @IsOptional()
  @IsString()
  details: string;
}
