import { Injectable } from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleService {

    constructor(private userService: UsersService,
                private authService: AuthService) {}

    async googleLogin(req: { user: any; }) {
        if (!req.user) {
            return 'Нет пользователя гугл'
        }

        const user = await this.userService.getUserByLogin(req.user.emails);
        if (!user) {
            let userName = `${req.user.firstName}`
            if (req.user.lastName) {
                userName = `${userName} ${req.user.lastName}`
            }
            const userDto = {
                "login": String(req.user.emails),
                "password": String(req.user.accesToken),
                "name": `${userName}`,
                "typeAccount": "Google",
                "picture": String(req.user.picture),
            }
            const user = await this.authService.registration(userDto)
            const refreshToken = user.ref;
            return {
                message: 'Информация о пользователе Вконтакте',
                user: req.user,
                refreshToken: refreshToken,
            }
        } else {
            const updateUser = this.userService.updateUserToken(req.user.emails, req.user.accesToken);
        }
        const refreshToken = await this.userService.getUserRefreshTokenById(user.id);
        return {
            message: 'Информация о пользователе Вконтакте',
            user: req.user,
            refreshToken: refreshToken.refreshToken,
        }
    }
}
