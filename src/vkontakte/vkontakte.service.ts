import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class VkontakteService {

    constructor(private userService: UsersService) {}

    async vkLogin(req: {user: any}) {
        if (!req.user) {
            return 'Нет пользователя вк'
        }

        const user = await this.userService.getUserByLogin(String(req.user.id));
        if (!user) {
            const userDto = {
                "login": req.user.id,
                "password": req.user.accesToken
            }
            const newUser = this.userService.createUser(userDto);
        }

        return {
            message: 'Информация о пользователе Вконтакте',
            user: req.user
        }
    }
}
