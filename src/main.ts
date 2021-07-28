import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import * as cookieParser from 'cookie-parser';
import {AllExceptionsFilter} from "./filters/all-exceptions.filter";
import {InternalServerErrorInterceptor} from "./interceptors/internal-server-error.interceptor";



async function start() {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.useGlobalFilters(new AllExceptionsFilter())
    app.enableCors({credentials: true, origin: process.env.URL_CLIENT});
    app.useGlobalInterceptors(new InternalServerErrorInterceptor());

    const config = new DocumentBuilder()
        .setTitle('Autorization')
        .setDescription('Документация по Autorization API')
        .setVersion('1.0.0')
        .build()
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document)

    await app.listen(PORT, () => console.log(`Сервер запущен на порте = ${PORT}`))

}

start()