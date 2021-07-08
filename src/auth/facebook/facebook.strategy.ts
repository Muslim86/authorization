import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-facebook";


@Injectable()
export class FacebookStategy extends PassportStrategy(Strategy, 'facebook') {
    constructor() {

        super({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: `http://localhost:${process.env.PORT}/facebook/redirect`,
            scope: "email",
            profileFields: ["emails", "name"],
        });
    }

    async validate(accesToken: string, refreshToken: string, profile : Profile, done: (err: any, user: any, info?: any) => void): Promise<any> {
        const {name, emails} = profile; 
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: profile.photos[0].value,
            accesToken
        }
        const payload = {
            user,
            accesToken,
        };

        done(null, payload)
    } 
}