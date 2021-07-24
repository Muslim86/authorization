import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Auth } from 'src/auth/auth.model';
import { RolesService } from 'src/roles/roles.service';
import { User } from './users.model';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userRepository: typeof User,
                @InjectModel(Auth) private authRepository: typeof Auth,
                private roleService: RolesService) {}

    async getAllUsers() {
        const users = await this.userRepository.findAll({include: {all: true}});
        return users;
    }

    async getUserByLogin(login: string) {
        let user = await this.userRepository.findOne({where: {login}, include: {all: true}});
        return user;
    }

    async getUserById(id: number) {
        const user = await this.userRepository.findOne({where: {id}});
        return user;
    }

    async getUserRefreshTokenById(id: number) {
        const user = await this.authRepository.findOne({where: {id}})
        return user;
    }

    async updateUserToken(login: string, accessToken: string) {
        const user = await this.userRepository.findOne({where: {login}});
        user.password = accessToken
        await user.save();
    }
}
