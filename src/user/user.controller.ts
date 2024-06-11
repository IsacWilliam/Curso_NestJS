import { Controller, Post, Body, Get, Put, Patch, Delete, UseGuards } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePutUserDTO } from "./dto/update-user-dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import { UserService } from "./user.service";
import { ParamId } from "src/decorators/param-id.decorator";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";
import { RoleGuard } from "src/guards/role.guard";
import { AuthGuard } from "src/guards/auth.guard";

@UseGuards(AuthGuard, RoleGuard)
//@UseInterceptors(LogInterceptor) // Aplica o interceptador para todas as rotas do controller
@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService){}

    //@UseInterceptors(LogInterceptor) // Aplica o interceptador apenas para uma rota do controller
    @Roles(Role.ADMIN)
    @Post()
    async create(@Body() data: CreateUserDTO) {
        return this.userService.create(data);
    }

    @Roles(Role.ADMIN)
    @Get()
    async list(){
        return this.userService.list();
    }

    @Get(':id')
    async show(@ParamId() id: number) {  // @Param utilizando Pipe de transformação de String para Number
        console.log('ParamId: ', {id});
        return this.userService.show(id);
    }

    @Roles(Role.ADMIN)
    @Put(':id')
    async update(@Body() data: UpdatePutUserDTO, @ParamId() id: number) {
        return this.userService.update(id, data);
    }

    @Roles(Role.ADMIN)
    @Patch(':id')
    async updatePartial(@Body() data: UpdatePatchUserDTO, @ParamId() id: number) {
        return this.userService.updatePartial(id, data);
    }

    @Roles(Role.ADMIN)
    @Delete(':id')
    async delete(@ParamId() id: number) {
        return this.userService.delete(id);
    }
}
