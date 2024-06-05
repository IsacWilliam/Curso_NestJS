import { Injectable } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateUserDTO) {
        return await this.prisma.user.create({ data });
    }

    async list(){
        return await this.prisma.user.findMany();
    }
    
    async show(id: number){
        return await this.prisma.user.findUnique({
            where: { id }
        });
    }
}
