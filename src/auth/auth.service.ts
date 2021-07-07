import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/users.model';
import { InjectModel } from '@nestjs/sequelize';
import * as jwt from 'jsonwebtoken'

import { Auth } from './auth.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
                @InjectModel(User) private userRepository: typeof User,
                @InjectModel(Auth) private authRepository: typeof Auth) {}

    async login(createUserDto: CreateUserDto) {
        const user = await this.validateUser(createUserDto);
        const userDto = new UserDto(user);
        const tokens = this.generateToken({...userDto});
        const acc = (await tokens).accesToken;
        const ref = (await tokens).refreshToken;
        await this.saveToken(userDto.id, (await tokens).refreshToken)
        return {
            acc,
            ref,
            user: userDto
        }
    }

    async logout(refreshToken: string) {
        const token = await this.authRepository.destroy({where: {refreshToken}})
        return token;
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw new HttpException('Нет данных', HttpStatus.BAD_REQUEST)
        }
        const userData = await this.validateRefreshToken(refreshToken);
        const tokenFromDb = await this.authRepository.findOne({where:{refreshToken}});
        if (!userData || !tokenFromDb) {
            throw new HttpException('Пользователь не авторизован!', HttpStatus.BAD_REQUEST);
        }
        const user = await this.userService.getUserById(Number(userData["id"]));
        const userDto = new UserDto(user);
        const tokens = this.generateToken({...userDto});
        const acc = (await tokens).accesToken;
        const ref = (await tokens).refreshToken;
        await this.saveToken(userDto.id, (await tokens).refreshToken)
        return {
            acc,
            ref,
            user: userDto
        }
    }

    async registration(createUserDto: CreateUserDto) {
        const candidate = await this.userService.getUserByLogin(createUserDto.login);
        if (candidate) {
            throw new HttpException('Пользователь существует!', HttpStatus.BAD_REQUEST);
        }
        
        const hashPassword = await bcrypt.hash(createUserDto.password, 4);
        const user = await this.userRepository.create({...createUserDto, password: hashPassword});
        
        const userDto = new UserDto(user);
        const tokens = this.generateToken({...userDto});
        const acc = (await tokens).accesToken;
        const ref = (await tokens).refreshToken;
        
        await this.saveToken(userDto.id, (await tokens).refreshToken)
        return {
            acc,
            ref,
            user: userDto
        }
    }

    async generateToken(payload) {
        const accesToken = jwt.sign(payload, process.env.JWT_ACCES_SECRET, {expiresIn:'30m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn:'30d'});
        return {
            accesToken,
            refreshToken
        }
    }

    async saveToken(user, refreshToken) {
        const tokenData = await this.authRepository.findOne({where: {user}})
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
         const auth = new this.authRepository();
         auth.user = user;
         auth.refreshToken = refreshToken;
         auth.save();
        return 
    }

    private async validateUser(userDto: CreateUserDto) {
        const login = userDto.login
        try {
            const user = await this.userRepository.findOne({where: {login}});
            const passwordEquals = await bcrypt.compare(userDto.password, user.password)
            if (user && passwordEquals) {
                return user;
            }
            throw new UnauthorizedException({message:'Некорректная почта или пароль'});
        } catch (error) {
            throw new UnauthorizedException({message:'Некорректная почта или пароль'});
        }
        
    }

    private async validateAccesToken(token: string) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCES_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }

    private async validateRefreshToken(token: string) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }
}
