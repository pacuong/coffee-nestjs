import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResult } from 'src/common/interfaces/cloudinary-result.interface';
import { CloudinaryUploadResult } from 'src/common/interfaces/upload-result.interface';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'coffee-products',
        },
        (error: unknown, result: CloudinaryResult | undefined) => {
          if (error) {
            const message =
              error instanceof Error
                ? error.message
                : typeof error === 'string'
                  ? error
                  : JSON.stringify(error);

            return reject(new Error(message));
          }

          if (!result) return reject(new Error('Upload failed'));

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        },
      );

      stream.end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<any> {
    return cloudinary.uploader.destroy(publicId);
  }
}
