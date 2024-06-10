import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly userService: UserService
    ){}

    async createToken(user: User) {
        return {
            accessToken: this.jwtService.sign(
                {  // PAYLOAD
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                {  // CONFIGURAÇÕES DO TOKEN
                    expiresIn: "7 days",  // Tempo de expiração do token
                    subject: String(user.id),  // Identificador do assunto do token, geralmente o ID do usuário
                    issuer: 'login',  // Emissor do token, quem gerou o token
                    audience: 'users'  // Público alvo do token, para quem o token é destinado
                }
            )
            
        }
    }
    

    async checkToken(token: string){
        //return this.jwtService.verify();
    }

    async login(email: string, password: string){
        const user = await this.prisma.user.findFirst({
            where: {
                email,
                password
            }
        });

        if(!user) {
            throw new UnauthorizedException('E-mail e/ou senha incorretos.');
        }

        return this.createToken(user);
    }

    async forget(email: string){
        const user = await this.prisma.user.findFirst({
            where: {
                email
            }
        });

        if(!user) {
            throw new UnauthorizedException('E-mail incorreto.');
        }

        //TO DO: Enviar o email...

        return true;
    }

    async reset(password: string, token: string){
        //TO DO: Validar Token

        const id = 0;

        const user = await this.prisma.user.update({
            where: {
                id
            },
            data: {
                password
            }
        });

        return this.createToken(user);
    }

    async register(data: AuthRegisterDTO) {

        const user = await this.userService.create(data);

        return this.createToken(user);
    }
}
