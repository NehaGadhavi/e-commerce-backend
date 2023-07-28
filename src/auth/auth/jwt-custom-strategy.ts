import { UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersEntity } from "src/users/users/users.entity";
import { Repository } from "typeorm";

export class jwtCustomStrategy extends PassportStrategy(Strategy) {
    constructor(@InjectRepository(UsersEntity) private userRepository: Repository<UsersEntity>) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'sdwe4DFSD3sasweftyjab'
        });
    }

    async validate(payload: { username: string }) {
        const { username } = payload;
        const user = await this.userRepository.findOne({
            where: { username }
        });

        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}