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
            scope: ["email"],
        },
        async function validate(accesToken: string, refreshToken: string, params: any , profile : Profile, done: VerifyCallback): Promise<any> {
            const {name, emails} = profile; 
            const user = {
                firstName: name.givenName,
                lastName: name.familyName,
                id: profile.id,
                accesToken
            }
    
            done(null, user)
        }
        );
    }
}