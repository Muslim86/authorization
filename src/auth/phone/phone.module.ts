import { forwardRef } from '@nestjs/common';
import { Module } from '@nestjs/common';

import { UsersModule } from 'src/users/users.module';
import { AuthModule } from '../auth.module';
import { PhoneController } from './phone.controller';

@Module({
  controllers: [PhoneController],
  providers: [],
  imports: [forwardRef(() =>AuthModule ),forwardRef(() => UsersModule)],
  exports: [PhoneModule,]
})
export class PhoneModule {}
