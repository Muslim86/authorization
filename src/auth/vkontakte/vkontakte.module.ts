import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { VkontakteController } from './vkontakte.controller';
import { VkontakteService } from './vkontakte.service';
import { VkontakteStategy } from './vkontakte.strategy';

@Module({
  controllers: [VkontakteController],
  providers: [VkontakteService, VkontakteStategy],
  imports: [UsersModule],
  exports: [VkontakteModule],
})
export class VkontakteModule {}
