import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";

import { User } from "./users/users.model";
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { Role } from "./roles/roles.model";
import { UserRoles } from "./roles/user-roles.model";
import { GoogleModule } from './auth/google/google.module';
import { FacebookModule } from './auth/facebook/facebook.module';
import { VkontakteModule } from './auth/vkontakte/vkontakte.module';
import { Auth } from "./auth/auth.model";
import { AuthModule } from "./auth/auth.module";
import { ErrorMiddleware } from "./middleware/error-middleware"

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User, Role, UserRoles, Auth],
            autoLoadModels: true
        }),
        UsersModule,
        AuthModule,
        RolesModule,
        GoogleModule,
        FacebookModule,
        VkontakteModule,
    ],
})
export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ErrorMiddleware)
            .forRoutes('*')
    }
}