import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentications/jwt-auth.guard';
import { RequestWithUser } from 'src/authentications/request-with-user.interface';
import { FileStreamQueryParam } from './image.dtos';
import { ImagesService } from './images.service';
import { Response } from 'express';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get('stream')
  async getPrivateFile(
    @Req() request: RequestWithUser,
    @Res() res: Response,
    @Query() query: FileStreamQueryParam,
  ) {
    const { Key, size } = query;
    // const file = await this.imagesService.getPrivateFile(Key);
    const file = await this.imagesService.getPrivateFileWithSize(Key, size);
    file.stream.pipe(res);
  }
}
