import { PassportStrategy } from "@nestjs/passport";
import { VerifyCallback, Strategy } from "passport-google-oauth20";
import { config } from "dotenv";
import { Injectable } from "@nestjs/common";

config()

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

    constructor() {
        
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `http://localhost:${process.env.PORT}/google/redirect`,
            scope: ['email', 'profile'],
        });
    }
    async validate(accesToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const {name, emails, photos} = profile;
            const user = {
            emails: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accesToken
            }

        done(null, user)      
    }
}