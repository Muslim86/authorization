import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile, VerifyCallback } from "passport-vkontakte";
import { config } from "dotenv";

config();

@Injectable()
export class VkontakteStategy extends PassportStrategy(Strategy, 'vkontakte') {
    constructor() {

        super({
            clientID: process.env.VK_APP_ID,
            clientSecret: process.env.VK_APP_SECRET,
            callbackURL: `http://localhost:${process.env.PORT}/vk/redirect`,
            scope: ["email", "profile"],
        },
        async function validate(accessToken: string, refreshToken: string, params: any , profile : Profile, done: VerifyCallback): Promise<any> {
            const {name, emails} = profile; 
            const user = {
                firstName: name.givenName,
                lastName: name.familyName,
                id: profile.id,
                picture: profile.photos[0].value,
                password: accessToken
            }
    
            done(null, user)
        }
        );
    }
}