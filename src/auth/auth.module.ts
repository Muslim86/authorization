import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { Auth } from './auth.model';
import { User } from 'src/users/users.model';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: 'some_secret_key',
      signOptions: {
        expiresIn: '24h'
      }
    }),
    SequelizeModule.forFeature([Auth, User]),
  ],
  exports: [
    AuthService,
    JwtModule
  ]
})
export class AuthModule {}