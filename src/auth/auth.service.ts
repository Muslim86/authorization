import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import {InjectModel} from '@nestjs/sequelize';
import * as jwt from 'jsonwebtoken'
import {HttpService} from '@nestjs/axios';

import {UsersService} from 'src/users/users.service';
import {User} from 'src/users/users.model';
import {Auth} from './auth.model';
import {CreateUserDto} from './dto/create-user.dto';
import {UserDto} from './dto/user.dto';
import {CreateNumberUserDto} from './dto/create-number-user.dto';
import {NumberUserDto} from './dto/number-user.dto';

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
                private httpService: HttpService,
                @InjectModel(User) private userRepository: typeof User,
                @InjectModel(Auth) private authRepository: typeof Auth) {}

    async login(createUserDto: CreateUserDto) {
        const user = await this.validateUser(createUserDto);
        const userDto = new UserDto(user);
        const tokens = this.generateToken({...userDto});
        const acc = (await tokens).accesToken;
        const ref = (await tokens).refreshToken;
        await this.saveToken(userDto.id, (await tokens).refreshToken);
        return {
            acc,
            ref,
            user: userDto
        }
    }
    
    async loginPhoneStepOne(createNumberUserDto: NumberUserDto) {
        const user = await this.validateNumberUser(createNumberUserDto);
        const login = user.login;
        const password = await this.generatePassword();
        await this.sendPhonePassword(String(password), login);
        const userData = await this.userRepository.findOne({where: {login}});
        userData.password = await bcrypt.hash(String(password), 4);
        await userData.save();
        return userData;
    }

    async loginPhoneStepTwo(createNumberUserDto: CreateNumberUserDto) {
        const user = await this.validateNumberUser(createNumberUserDto);
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
        return await this.authRepository.destroy({where: {refreshToken}});
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw new HttpException('Нет данных', HttpStatus.BAD_REQUEST)
        }
        const userData = await AuthService.validateRefreshToken(refreshToken);
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

    async registrationPhone(createUserDto: CreateNumberUserDto) {
        const candidate = await this.userService.getUserByLogin(createUserDto.login);
        if (candidate) {
            throw new HttpException('Пользователь существует!', HttpStatus.BAD_REQUEST);
        }
        const password = await this.generatePassword();
        const hashPassword = await bcrypt.hash(String(password), 4);
        const user = await this.userRepository.create({...createUserDto, password: hashPassword});
        await this.sendPhonePassword(password, user.login.replace('+', ''));
        
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
         await auth.save();
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

    private async validateNumberUser(userDto: CreateNumberUserDto) {
        const login = userDto.login
        const name = userDto.name
        try {
            const userLogin = await this.userRepository.findOne({where: {login}});
            const userName = await this.userRepository.findOne({where: {name}});
            if (userLogin && userName) {
                return userLogin;
            }
            throw new UnauthorizedException({message:'Некорректное имя или номер'});
        } catch (error) {
            throw new UnauthorizedException({message:'Некорректное имя или номер'});
        }
    }

    private static async validateRefreshToken(token: string) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }

    private async generatePassword() {
        let password = '';
        for (let i = 0; i < Number(process.env.PASSWORD_LENGTH); i++) {
            password = password + String(Math.floor(Math.random() * 10));
        }
        return password;
    }

    private async sendPhonePassword(password: string, phone) {
        const url = encodeURI(`https://sms.ru/sms/send?api_id=${process.env.PHONE_API_ID}&to=${phone},74993221627&msg=Ваш+код+доступа:+${password}&json=1`);
        return this.httpService.post(url, {message: 'test'}).subscribe(
            res => {
                //console.log(res)
            }
        )
    }
}
