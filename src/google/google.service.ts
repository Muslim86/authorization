import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleService {
    googleLogin(req: { user: any; }) {
        if (!req.user) {
            console.log("логин провал")
            return 'Нет пользователя гугл'
        }
        return {
            message: 'Информация о пользователе гугл',
            user: req.user
        }
    }
}
