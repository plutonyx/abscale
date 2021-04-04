import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Injectable()
export class ImagesService {
  constructor(private readonly configService: ConfigService) {}

  async getPrivateFileWithSize(Key: string, size: string) {
    return this.getPrivateFile(Key);
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
