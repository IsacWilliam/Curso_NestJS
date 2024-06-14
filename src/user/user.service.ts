import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePutUserDTO } from "./dto/update-user-dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import * as bcrypt from 'bcrypt';
import { Repository } from "typeorm";
import { UserEntity } from "./entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>
    ) {}

    async create(data: CreateUserDTO) {

        if(await this.usersRepository.exist({
            where: {
                email: data.email
            }
        })){
            throw new BadRequestException('Este email já está cadastrado!');
        }
        
        const salt = await bcrypt.genSalt();
        
        //console.log('Salt: ', salt);
        //console.log('Senha SEM hash: ', data.password);
        
        data.password = await bcrypt.hash(data.password, await salt);
        
        //console.log('Senha COM hash: ', data.password);
        
        const user = this.usersRepository.create(data);
        
        return this.usersRepository.save(user);
        
    }

    async list(){
        return this.usersRepository.find();
    }
    
    async show(id: number){
        await this.exists(id);

        return this.usersRepository.findOne({
            where: { id }
        });
    }

    async update(id: number, {email, name, password, birthAt, role}: UpdatePutUserDTO) {
        //console.log('update: ', {data})

        await this.exists(id);

        const salt = await bcrypt.genSalt();

        password = await bcrypt.hash(password, salt);

        await this.usersRepository.update(id, {
            email,
            name,
            password,
            birthAt: birthAt ? new Date(birthAt) : null,
            role
        });

        return this.show(id);
    }
    
    async updatePartial(id: number, {email, name, password, birthAt, role}: UpdatePatchUserDTO) {
        //console.log('updatePartial: ', {data})

        await this.exists(id);

        const data: any = {};

        if(birthAt) {
            data.birthAt = new Date(birthAt);
        }
        
        if(email) {
            data.email = email;
        }

        if(name) {
            data.name = name;
        }

        if(password) {
            const salt = await bcrypt.genSalt();
            data.password = await bcrypt.hash(password, salt);
        }
        
        if(role) {
            data.role = role;
        }
        

        await this.usersRepository.update(id, data);

        return this.show(id);
    }

    async delete(id: number) {
        
        await this.exists(id);

        return this.usersRepository.delete(id);
    }

    async exists(id: number) {

        if(!(await this.usersRepository.exist({
            where: {
                id
            }
        }))) {
            throw new NotFoundException (`O usuário ${id} não existe!`);
        }
    }
}
