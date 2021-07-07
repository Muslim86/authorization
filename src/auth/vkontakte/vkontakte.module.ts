import { Module } from '@nestjs/common';

import { UsersModule } from 'src/users/users.module';
import { AuthModule } from '../auth.module';
import { VkontakteController } from './vkontakte.controller';
import { VkontakteService } from './vkontakte.service';
import { VkontakteStategy } from './vkontakte.strategy';

@Module({
  controllers: [VkontakteController],
  providers: [VkontakteService, VkontakteStategy],
  imports: [UsersModule, AuthModule],
  exports: [VkontakteModule],
})
export class VkontakteModule {}
