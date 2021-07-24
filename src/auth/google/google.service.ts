import { Injectable } from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleService {

    constructor(private userService: UsersService,
                private authService: AuthService) {}

    async googleLogin(req: { user: any; }) {
        if (!req.user) {
            return 'Нет пользователя Google'
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
            return {
                message: 'Информация о пользователе Google',
                user: req.user,
                refreshToken: user.ref,
                accessToken: user.acc
            }
        } else {
            await this.userService.updateUserToken(req.user.emails, req.user.password);
        }
        const tokens = await this.userService.getUserRefreshTokenById(user.id);
        return {
            message: 'Информация о пользователе Google',
            user: req.user,
            refreshToken: tokens.refreshToken,
            accessToken: tokens.accessToken
        }
    }
}
