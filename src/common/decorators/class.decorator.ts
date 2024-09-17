import { SetMetadata } from '@nestjs/common';

export const CLASS_METADATA_KEY = 'class_metadata';

export const ClassMetadata = (...target: []) =>
  SetMetadata(CLASS_METADATA_KEY, target);
