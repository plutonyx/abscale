import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImagesModule } from './images/images.module';
import { AuthenticationsModule } from './authentications/authentications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ImagesModule,
    AuthenticationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
