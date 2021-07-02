import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';
import { GoogleStrategy } from './google.strategy';

@Module({
  controllers: [GoogleController],
  providers: [GoogleService, GoogleStrategy],
  imports: [
    UsersModule
  ],
  exports: [
    GoogleModule
  ]
})
export class GoogleModule {}
