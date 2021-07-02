import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleService {

    constructor(private userService: UsersService) {}

    async googleLogin(req: { user: any; }) {
        if (!req.user) {
            return 'Нет пользователя гугл'
        }

        const user = await this.userService.getUserByEmail(req.user.emails);
        if (!user) {
            const userDto = {
                "email": req.user.emails,
                "password": req.user.accesToken
            }
            const newUser = this.userService.createUser(userDto);
        }
        return {
            message: 'Информация о пользователе гугл',
            user: req.user
        }
    }
}
