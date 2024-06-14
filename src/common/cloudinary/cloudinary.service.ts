import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
  UploadApiOptions,
  DeleteApiResponse,
} from 'cloudinary';
import { createReadStream } from 'node:fs';

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise<UploadApiResponse | UploadApiErrorResponse>(
      (resolve, reject) => {
        const options: UploadApiOptions = {
          folder: folder,
          use_filename: true,
          unique_filename: true,
          overwrite: true,
        };
        const uploadStream = cloudinary.uploader.upload_stream(
          options,
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );
        createReadStream(file.buffer).pipe(uploadStream);
      },
    );
  }

  async deleteFile(publicId: string): Promise<DeleteApiResponse> {
    return new Promise<DeleteApiResponse>((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) reject(error);
        resolve(result);
      });
    });
  }
}
