import { Injectable } from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class VkontakteService {

    constructor(private userService: UsersService,
                private authService: AuthService) {}

    async vkLogin(req: {user: any}) {
        if (!req.user) {
            return 'Нет пользователя вк'
        }
        const user = await this.userService.getUserByLogin(String(req.user.id));
        
        if (!user) {
            const userDto = {
                "login": String(req.user.id),
                "password": String(req.user.accesToken),
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
            }
        } 
        const updateUser = this.userService.updateUserToken(String(req.user.id), String(req.user.accesToken));
        const refreshToken = await this.userService.getUserRefreshTokenById(user.id);
        return {
            message: 'Информация о пользователе Вконтакте',
            user: req.user,
            refreshToken: refreshToken.refreshToken,
        }
    }
}
