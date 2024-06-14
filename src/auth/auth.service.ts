import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import { MailerService } from '@nestjs-modules/mailer/dist';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

    private issuer = 'login';
    private audience = 'users';

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly mailer: MailerService,
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>
    ){}

    createToken(user: UserEntity) {
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

        //const user = await this.usersRepository.findOneBy({ email }); //Equivalente com o FindOne abaixo
        const user = await this.usersRepository.findOne({ 
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
        const user = await this.usersRepository.findOne({
            where: {
                email
            }
        });

        if(!user) {
            throw new UnauthorizedException('E-mail incorreto.');
        }

        const token = this.jwtService.sign({
            id: user.id
        },{
            expiresIn: "30 minutes",
            subject: String(user.id),
            issuer: 'forget',
            audience: 'users'
        });

        await this.mailer.sendMail({
            subject: 'Recuperação de senha',
            to: 'hailisac@hotmail.com',
            template: 'forget',
            context: {
                name: user.name,
                token
            }
        });

        return {token};
    }

    async reset(password: string, token: string){
        try {
            const data: any = this.jwtService.verify(token, {
                issuer: 'forget',
                audience: 'users'
            });

            if(isNaN(Number(data.id))) {
                throw new BadRequestException("Token inválido.");
            }

            const salt = await bcrypt.genSalt();
            password = await bcrypt.hash(password, salt);
            
            await this.usersRepository.update(Number(data.id), {
                password
            });
            
            const user = await this.userService.show(Number(data.id));

            return this.createToken(user);

        }catch(e) {
            throw new BadRequestException(e);
        }
    }

    async register(data: AuthRegisterDTO) {

        const user = await this.userService.create(data);

        return this.createToken(user);
    }
}
