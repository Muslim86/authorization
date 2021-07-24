import { Injectable } from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookService {

    constructor(private userService: UsersService,
                private authService: AuthService) {}

    async facebookLogin(req: {user: any}) {
        if (!req.user) {
            return 'Нет пользователя Facebook'
        }

        const user = await this.userService.getUserByLogin(req.user.emails);
        if (!user) {
            const userDto = {
                "login": req.user.emails,
                "password": req.user.accesToken,
                "name": `${req.user.firstName} ${req.user.lastName}`,
                "type": 'Facebook',
                "picture": String(req.user.picture),
            }
            const user = await this.authService.registration(userDto)
            return {
                message: 'Информация о пользователе Facebook',
                user: req.user,
                refreshToken: user.ref,
                accessToken: user.acc
            }
        } else {
            await this.userService.updateUserToken(req.user.emails, req.user.password);
        }
        const tokens = await this.userService.getUserRefreshTokenById(user.id);
        return {
            message: 'Информация о пользователе Facebook',
            user: req.user,
            refreshToken: tokens.refreshToken,
            accessToken: tokens.accessToken
        }
    }
}
