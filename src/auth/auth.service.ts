import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    private issuer = 'login';
    private audience = 'users';

    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly userService: UserService
    ){}

    createToken(user: User) {
        return {
            accessToken: this.jwtService.sign({
                // PAYLOAD
                id: user.id,
                name: user.name,
                email: user.email
            },
            {   // CONFIGURAÇÕES DO TOKEN
                expiresIn: "5 days",  // Tempo de expiração do token Ex.: 5000, 5 seconds, 5 days
                subject: String(user.id),  // Identificador do assunto do token, geralmente o ID do usuário
                issuer: this.issuer,  // Emissor do token, quem gerou o token
                audience: this.audience  // Público alvo do token, para quem o token é destinado
            })
        }
    }
    

    checkToken(token: string){
        try {
            const data = this.jwtService.verify(token, {
                audience: this.audience,
                issuer: this.issuer
            });
            return data;
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    isValidToken(token: string) {
        try {
            this.checkToken(token);
            return true;
        }catch (e) {
            return false;
        }
    }

    async login(email: string, password: string){
        
        // console.log('Variáveis de ambiente: ', process.env); // REMOVER - NÃO ENVIAR PARA PRD

        const user = await this.prisma.user.findFirst({
            where: {
                email
            }
        });

        if(!user) {
            throw new UnauthorizedException('E-mail e/ou senha incorretos.');
        }

        if (!await bcrypt.compare(password, user.password)) {
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
