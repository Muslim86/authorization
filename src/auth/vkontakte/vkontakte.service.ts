import { Injectable } from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class VkontakteService {

    constructor(private userService: UsersService,
                private authService: AuthService) {}

    async vkLogin(req: {user: any}) {
        if (!req.user) {
            return 'Нет пользователя Вконтакте'
        }
        const user = await this.userService.getUserByLogin(String(req.user.id));
        
        if (!user) {
            const userDto = {
                "login": String(req.user.id),
                "password": String(req.user.password),
                "name": `${req.user.firstName} ${req.user.lastName}`,
                "typeAccount": 'VK',
                "picture": String(req.user.picture),
            }
            const user = await this.authService.registration(userDto);
            const refreshToken = user.ref;

            return {
                message: 'Информация о пользователе Вконтакте',
                user: req.user,
                refreshToken: refreshToken,
                accessToken: user.acc
            }
        } 
        await this.userService.updateUserToken(String(req.user.id), String(req.user.password));
        const tokens = await this.userService.getUserRefreshTokenById(user.id);
        return {
            message: 'Информация о пользователе Вконтакте',
            user: req.user,
            refreshToken: tokens.refreshToken,
            accessToken: tokens.accessToken
        }
    }
}
