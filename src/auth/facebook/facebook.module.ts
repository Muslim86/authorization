import { Module } from '@nestjs/common';

import { FacebookService } from './facebook.service';
import { FacebookController } from './facebook.controller';
import { FacebookStategy } from './facebook.strategy';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from '../auth.module';

@Module({
  providers: [FacebookService, FacebookStategy],
  controllers: [FacebookController],
  imports: [UsersModule, AuthModule],
  exports: [FacebookModule],
})
export class FacebookModule {}
