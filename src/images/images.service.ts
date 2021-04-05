import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import sharp from 'sharp';

@Injectable()
export class ImagesService {
  private logger: Logger = new Logger(ImagesService.name);

  constructor(private readonly configService: ConfigService) {}

  async getPrivateFileWithSize(Key: string, size: string) {
    const availableSize = this.configService.get('SCALE_SIZES', '').split(',');
    const originKey = Key;
    const targetKey = originKey.replace('origin', size);
    this.logger.error(`${targetKey} ${size}`);
    if (availableSize.includes(size)) {
      const s3 = new S3();
      try {
        const headCode = await s3
          .headObject({
            Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
            Key: targetKey,
          })
          .promise();
        return this.getPrivateFile(targetKey);
      } catch (headErr) {
        if (headErr.code === 'NotFound') {
          const sourceObject = await this.getPrivateFile(originKey);
          // const imageBuffer = this.getPrivateFile(originKey);
          const transform = sharp()
            .resize(+size)
            .toFormat('jpeg');

          const newBuffer = sourceObject.stream.pipe(transform);
          const result = await s3
            .upload({
              Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
              Body: newBuffer,
              Key: targetKey,
            })
            .promise();
          return this.getPrivateFile(targetKey);
        }
      }
    }
    throw new NotFoundException();
  }
  async getPrivateFile(Key: any) {
    const s3 = new S3();
    const stream = await s3
      .getObject({
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
        Key,
      })
      .createReadStream();
    return {
      stream,
    };
  }
}
